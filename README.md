# ESBuild 学习指南

这个项目包含了学习 ESBuild 构建工具的完整示例和教程。

## 什么是 ESBuild？

ESBuild 是一个极快的 JavaScript 打包器和压缩器，由 Go 语言编写。与 Webpack 相比，它的主要优势是：

- **速度极快**: 比 Webpack 快 10-100 倍
- **零配置**: 开箱即用，无需复杂配置
- **内置功能**: 支持 TypeScript, JSX, CSS 等
- **Tree Shaking**: 自动移除未使用的代码
- **代码分割**: 支持动态导入和代码分割

## 项目结构

```
esbuild-learning/
├── src/                  # 源代码目录
│   ├── index.js         # 基本 JavaScript 示例
│   ├── app.ts           # TypeScript 示例
│   ├── react-app.jsx    # React 示例
│   ├── styles/          # CSS 样式
│   └── utils/           # 工具函数
├── dist/                # 构建输出目录
├── examples/            # 高级示例
└── package.json         # 项目配置

```

## 学习步骤

1. **基础打包** - 学习基本的 JavaScript 打包
2. **语法转换** - ES6+ 到 ES5 的转换
3. **TypeScript** - TypeScript 编译和打包
4. **React/JSX** - React 组件的处理
5. **CSS 处理** - 样式文件的打包
6. **插件系统** - 扩展 ESBuild 功能
7. **开发服务器** - 热重载开发环境
8. **高级配置** - 性能优化和高级特性

## 快速开始

```bash
# 安装依赖
npm install

# 基本构建
npm run build

# 监听模式构建
npm run build:watch

# 启动开发服务器
npm run dev
```
