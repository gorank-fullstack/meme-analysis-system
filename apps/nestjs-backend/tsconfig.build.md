## tsconfig.build.json

职责说明：

该文件仅用于 NestJS 生产构建阶段，
保证生成的 dist 目录在任何运行环境中
都可以直接通过 Node 执行。

注意：
由于 nest build 阶段使用严格 JSON 解析，
该文件禁止写任何注释。
