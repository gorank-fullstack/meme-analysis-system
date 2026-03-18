// generate-safelist.js
// Gpt写的：自动生成 safelist 脚本
// 在你的项目根目录运行：node generate-safelist.js
// 但实际，也是无法完全分析出：safelist应该写哪些 tailWindCss 属性

const fs = require('fs');
const path = require('path');

const FILE_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.html'];
const scanDir = path.resolve(__dirname, 'src'); // 修改为你代码目录
const classNameRegex = /class(Name)?=["'`]{1}([^"'`]+?)["'`]{1}/g;

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (FILE_EXTS.includes(path.extname(fullPath))) {
      callback(fullPath);
    }
  });
};

const safelist = new Set();

walkDir(scanDir, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');

  let match;
  while ((match = classNameRegex.exec(content)) !== null) {
    const raw = match[2];
    // 拆分 class 名并过滤掉包含 ${} 的动态内容
    raw.split(/\s+/)
      .filter((cls) => cls && !cls.includes('${'))
      .forEach((cls) => safelist.add(cls));
  }
});

// 输出结果
const safelistArray = Array.from(safelist).sort();
console.log('🔐 Tailwind Safelist:');
console.log(JSON.stringify(safelistArray, null, 2));
