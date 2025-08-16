# 📋 package.json 脚本命令详解

本指南详细解释 package.json 中各个脚本命令的用途、区别和最佳使用场景。

## 🎯 命令分类概览

```
构建命令:
├── build           # 基础构建
├── build:min       # 压缩构建
├── build:watch     # 监听构建
├── build:ts        # TypeScript 构建
└── build:react     # React 构建

开发服务器:
├── serve           # 简单静态服务器
├── dev             # 开发模式 (监听 + 服务器)
└── dev-server      # 高级开发服务器

高级功能:
└── build:plugins   # 插件构建
```

## 📦 构建命令详解

### 1. `npm run build`
```bash
"build": "esbuild src/index.js --bundle --outfile=dist/bundle.js"
```

**功能**: 基础构建命令
- 打包 `src/index.js` 及其依赖
- 输出到 `dist/bundle.js`
- 不压缩，保持可读性
- 适合开发调试

**使用场景**:
- 快速测试构建
- 开发环境验证
- 调试构建产物

### 2. `npm run build:min`
```bash
"build:min": "esbuild src/index.js --bundle --minify --outfile=dist/bundle.min.js"
```

**功能**: 压缩构建
- 所有功能同 `build`
- 额外启用代码压缩 (`--minify`)
- 移除空格、重命名变量、删除注释
- 适合生产部署

**使用场景**:
- 生产环境部署
- 性能优化测试
- 文件大小优化

### 3. `npm run build:watch`
```bash
"build:watch": "esbuild src/index.js --bundle --outfile=dist/bundle.js --watch"
```

**功能**: 监听模式构建
- 文件变化时自动重新构建
- 持续运行直到手动停止 (Ctrl+C)
- 快速响应代码变更
- 不提供 HTTP 服务器

**使用场景**:
- 开发时持续构建
- 配合其他服务器使用
- CI/CD 管道中的监听构建

## 🌐 开发服务器详解

### 1. `npm run serve`
```bash
"serve": "esbuild src/index.js --bundle --outfile=dist/bundle.js --serve=8000"
```

**功能**: 简单静态服务器
- 构建代码并启动 HTTP 服务器
- 端口: 8000
- 只在启动时构建一次
- 不监听文件变化

**特点**:
- 最简单的服务器
- 快速预览构建结果
- 无热重载功能

**访问**: http://localhost:8000

### 2. `npm run dev`
```bash
"dev": "esbuild src/index.js --bundle --outfile=dist/bundle.js --watch --serve=8000"
```

**功能**: 开发模式 (监听 + 服务器)
- 结合了 `--watch` 和 `--serve`
- 文件变化时自动重新构建
- 提供 HTTP 服务器
- 基础的开发环境

**特点**:
- 自动重新构建
- 即时查看变更
- 简单配置

**访问**: http://localhost:8000

### 3. `npm run dev-server`
```bash
"dev-server": "node dev-server.js"
```

**功能**: 高级开发服务器
- 使用自定义的 `dev-server.js`
- 支持插件系统
- 更丰富的配置选项
- 构建通知和错误处理

**特点**:
- 完全可定制
- 插件支持
- 高级功能 (代理、中间件等)
- 更好的开发体验

**访问**: http://localhost:3000 (可配置)
