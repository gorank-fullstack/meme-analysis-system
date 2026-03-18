/**
 * count-lines.ts
 * 
 * 功能说明：
 * - 遍历多个项目目录，统计每种文件类型的代码行数（真实代码 / 单行注释 / 块注释 / 空行）
 * - 支持 .ts、.tsx、.css 等后缀类型
 * - 额外统计：React 组件数、SVG 组件数、普通 .ts 文件数（不包含 .d.ts）
 * - SVG 组件的定义：tsx 文件中包含 <svg 与 </svg>，且总行数 ≤ 150 行
 */

import * as fs from 'fs';
import * as path from 'path';

// 定义行数统计结构
interface LineStats {
    realCode: number;       // 真实代码行
    lineComments: number;   // 单行注释行
    blockComments: number;  // 多行注释块行
    emptyLines: number;     // 空行
}

// 当前支持统计的文件扩展名（可扩展）
const SUPPORTED_EXTENSIONS = ['.ts', '.tsx', '.css'];

// 🔍 Monorepo 各子模块根目录路径（相对当前脚本）
const MONOREPO_DIR_HEAD = '../../';

const AXIOS_CLIENT_DIR_HEAD = '../../axios-client';
const INTERFACE_API_DIR_HEAD = '../../interface-api';
const INTERFACE_BASE_DIR_HEAD = '../../interface-base';
const INTERFACE_TASK_DIR_HEAD = '../../interface-task';
const INTERFACE_UTILS_DIR_HEAD = '../../interface-utils';

const NESTJS_SRC_DIR_HEAD = '../../u_nestjs_ioredis_api';
const NEXTJS_SRC_DIR_HEAD = '../../u_nextjs_nextauth_rtk';

// 每个模块配置：目录路径 + 要排除的子目录
const DIRECTORY_CONFIGS: { dir: string; excludeSubDirs: string[] }[] = [
    {
        dir: path.join(__dirname, MONOREPO_DIR_HEAD),
        excludeSubDirs: [
            'mono_stop_code', 'axios-client', 'backup',
            'interface-api','interface-base',  'interface-task', 'interface-utils', 'node_modules',
            'u_nestjs_ioredis_api', 'u_nextjs_nextauth_rtk'
        ],
    },

    { dir: path.join(__dirname, AXIOS_CLIENT_DIR_HEAD), excludeSubDirs: ['dist', 'node_modules'] },
    { dir: path.join(__dirname, INTERFACE_API_DIR_HEAD), excludeSubDirs: ['dist', 'node_modules'] },
    { dir: path.join(__dirname, INTERFACE_BASE_DIR_HEAD), excludeSubDirs: ['dist', 'node_modules'] },
    { dir: path.join(__dirname, INTERFACE_TASK_DIR_HEAD), excludeSubDirs: ['dist', 'node_modules'] },
    { dir: path.join(__dirname, INTERFACE_UTILS_DIR_HEAD), excludeSubDirs: ['dist', 'node_modules'] },
        
    { dir: path.join(__dirname, NESTJS_SRC_DIR_HEAD), excludeSubDirs: ['nestJs_stop_code', 'dist', 'node_modules', 'test', 'my_script'] },
    { dir: path.join(__dirname, NEXTJS_SRC_DIR_HEAD), excludeSubDirs: ['nextJs_stop_code', 'dist', 'node_modules', '.next', 'data', 'public'] },
];

let reactComponentCount = 0;
let svgComponentCount = 0;
let tsFileCount = 0;

/**
 * 统计某个文件中的各类行数（真实代码、注释、空行）
 */
function countLinesInFile(filePath: string): LineStats {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const stats: LineStats = {
        realCode: 0,
        lineComments: 0,
        blockComments: 0,
        emptyLines: 0,
    };

    let inBlockComment = false;

    for (const line of lines) {
        const trimmed = line.trim();

        if (inBlockComment) {
            stats.blockComments++;
            if (trimmed.endsWith('*/')) {
                inBlockComment = false;
            }
            continue;
        }

        if (trimmed === '') {
            stats.emptyLines++;
        } else if (trimmed.startsWith('//')) {
            stats.lineComments++;
        } else if (trimmed.startsWith('/*')) {
            inBlockComment = true;
            stats.blockComments++;
            if (trimmed.endsWith('*/')) {
                inBlockComment = false;
            }
        } else {
            stats.realCode++;
        }
    }

    return stats;
}

/**
 * 递归遍历目录，按文件扩展名分类统计行数
 */
function walkDirByExt(
    dir: string,
    baseDir: string,
    excludeSubDirs: string[],
    statsByExt: Record<string, LineStats>
): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(baseDir, fullPath);

        // 是否是被排除的目录（子路径匹配）
        const isExcluded = excludeSubDirs.some((excludedSubDir) =>
            relativePath === excludedSubDir || relativePath.startsWith(excludedSubDir + path.sep)
        );
        if (isExcluded) continue;

        if (entry.isDirectory()) {
            walkDirByExt(fullPath, baseDir, excludeSubDirs, statsByExt);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (!SUPPORTED_EXTENSIONS.includes(ext)) continue;

            const content = fs.readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');

            // SVG 组件检测
            if (ext === '.tsx' && content.includes('<svg') && content.includes('</svg>') && lines.length <= 100) {
                svgComponentCount++;
            }

            // React 组件检测
            if (ext === '.tsx') {
                const isLikelyComponent = content.includes('export default') || content.includes('return (');
                if (isLikelyComponent) {
                    reactComponentCount++;
                }
            }

            // 普通 .ts 文件计数（排除 .d.ts）
            if (ext === '.ts' && !entry.name.endsWith('.d.ts')) {
                tsFileCount++;
            }

            const fileStats = countLinesInFile(fullPath);
            const target = statsByExt[ext] || {
                realCode: 0,
                lineComments: 0,
                blockComments: 0,
                emptyLines: 0,
            };

            statsByExt[ext] = {
                realCode: target.realCode + fileStats.realCode,
                lineComments: target.lineComments + fileStats.lineComments,
                blockComments: target.blockComments + fileStats.blockComments,
                emptyLines: target.emptyLines + fileStats.emptyLines,
            };
        }
    }
}

// 主流程：统计每个目录的代码行数
for (const { dir, excludeSubDirs } of DIRECTORY_CONFIGS) {
    if (!fs.existsSync(dir)) {
        console.warn(`❗️ 目录不存在，跳过：${dir}`);
        continue;
    }

    const statsByExt: Record<string, LineStats> = {};
    walkDirByExt(dir, dir, excludeSubDirs, statsByExt);

    for (const ext of Object.keys(statsByExt)) {
        const stats = statsByExt[ext];
        console.log(`\n📂 目录：${dir} [文件类型: ${ext}]`);
        console.log('统计结果：');
        console.log(`✅ 真实代码行数: ${stats.realCode}`);
        console.log(`📝 单行注释行数 (//): ${stats.lineComments}`);
        console.log(`🗂️ 多行注释块行数 (/* */): ${stats.blockComments}`);
        console.log(`📭 空行数: ${stats.emptyLines}`);
    }
}

// 🚀 全局组件统计
console.log('\n===== 🧩 组件数量统计 =====');
console.log(`🔷 React 组件数 (.tsx): ${reactComponentCount}`);
console.log(`🟣 SVG 组件数 (.tsx): ${svgComponentCount}`);
console.log(`📘 普通 .ts 文件数: ${tsFileCount}`);
