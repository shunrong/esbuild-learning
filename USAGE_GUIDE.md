# ESBuild 配置与 API 使用指南

这是一个完整的 ESBuild 配置和 API 使用教程，结合与 Webpack 的对比来帮助你快速掌握 ESBuild。

## 📚 文档结构

### 核心文档
- **[ESBUILD_CONFIG_GUIDE.md](./ESBUILD_CONFIG_GUIDE.md)** - 完整的配置项详解
- **[WEBPACK_VS_ESBUILD.md](./WEBPACK_VS_ESBUILD.md)** - 与 Webpack 的详细对比
- **[API_EXAMPLES.js](./API_EXAMPLES.js)** - 完整的 API 调用示例
- **[config-demo.js](./config-demo.js)** - 交互式配置演示

### 实际示例
- **[esbuild.config.js](./esbuild.config.js)** - 基础配置示例
- **[advanced-config.js](./advanced-config.js)** - 高级配置示例
- **[performance-benchmark.js](./performance-benchmark.js)** - 性能基准测试

---

## 🚀 快速开始

### 1. 运行配置演示
```bash
# 运行所有配置演示
npm run config:demo

# 运行特定演示
npm run config:basic      # 基础配置
npm run config:entry      # 入口和输出配置
npm run config:platform   # 平台和目标环境
npm run config:loaders    # 文件加载器
npm run config:env        # 环境配置对比
npm run config:transform  # 代码转换演示
```

### 2. 运行 API 示例
```bash
# 运行所有 API 示例
npm run api:examples

# 运行特定 API 示例
npm run api:basic         # 基础构建 API
npm run api:transform     # 代码转换 API
npm run api:advanced      # 高级配置 API
npm run api:batch         # 批量构建 API
```

### 3. 性能基准测试
```bash
# 运行性能基准测试
npm run benchmark
```

---

## 📖 学习路径

### 第一步：理解基础概念
1. 阅读 [ESBUILD_CONFIG_GUIDE.md](./ESBUILD_CONFIG_GUIDE.md) 的前几章
2. 运行 `npm run config:basic` 查看基础配置
3. 对比 [WEBPACK_VS_ESBUILD.md](./WEBPACK_VS_ESBUILD.md) 中的配置差异

### 第二步：掌握核心配置
1. 运行 `npm run config:entry` 学习入口和输出配置
2. 运行 `npm run config:platform` 了解平台差异
3. 运行 `npm run config:loaders` 掌握文件处理

### 第三步：学习 API 调用
1. 运行 `npm run api:basic` 学习基础 API
2. 运行 `npm run api:transform` 学习代码转换
3. 阅读 [API_EXAMPLES.js](./API_EXAMPLES.js) 了解完整 API

### 第四步：实践高级特性
1. 运行 `npm run config:env` 学习环境配置
2. 运行 `npm run api:advanced` 学习高级配置
3. 运行 `npm run benchmark` 了解性能特性

---

## 🔧 ESBuild vs Webpack 核心差异

### 配置复杂度对比

**ESBuild (简单直接)**:
```javascript
import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'dist/app.js',
  jsx: 'automatic',
  minify: true
});
```

**Webpack (功能丰富)**:
```javascript
module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader' }
    ]
  },
  plugins: [new HtmlWebpackPlugin()],
  optimization: { minimize: true }
};
```

### 性能对比
- **ESBuild**: 构建速度极快 (10-100x)
- **Webpack**: 功能丰富，生态成熟

### 学习曲线
- **ESBuild**: 平缓，约定优于配置
- **Webpack**: 陡峭，高度可配置

---

## 📝 常用配置模式

### 1. 现代 Web 应用
```javascript
const modernWebConfig = {
  entryPoints: ['src/app.tsx'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  splitting: true,
  jsx: 'automatic',
  minify: true,
  target: ['es2020', 'chrome90']
};
```

### 2. Node.js 应用
```javascript
const nodeConfig = {
  entryPoints: ['src/server.ts'],
  outfile: 'dist/server.js',
  platform: 'node',
  format: 'esm',
  target: 'node18',
  external: ['fs', 'path']
};
```

### 3. 库开发
```javascript
const libraryConfig = {
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  format: 'esm',
  external: ['*'],
  keepNames: true
};
```

---

## 🎯 实用技巧

### 1. 环境变量配置
```javascript
const isDev = process.env.NODE_ENV === 'development';

const config = {
  minify: !isDev,
  sourcemap: isDev ? 'inline' : 'external',
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
  }
};
```

### 2. 代码分割最佳实践
```javascript
const config = {
  format: 'esm',        // 仅在 ESM 下支持分割
  splitting: true,
  chunkNames: 'chunks/[name]-[hash]',
  assetNames: 'assets/[name]-[hash]'
};
```

### 3. 性能优化
```javascript
const optimizedConfig = {
  treeShaking: true,    // 默认开启
  minify: true,
  target: ['es2020'],   // 避免过度转译
  external: ['react']   // 大型库外部化
};
```

---

## 🔍 调试和问题排查

### 1. 构建分析
```javascript
const result = await build({
  ...config,
  metafile: true  // 生成构建元信息
});

// 分析构建结果
const analysis = await analyzeMetafile(result.metafile);
console.log(analysis);
```

### 2. 错误处理
```javascript
import { formatMessages } from 'esbuild';

try {
  await build(config);
} catch (error) {
  if (error.errors) {
    const formatted = await formatMessages(error.errors, {
      kind: 'error',
      color: true
    });
    console.log(formatted.join('\n'));
  }
}
```

### 3. 常见问题

**问题1: TypeScript 类型检查**
- ESBuild 不进行类型检查，只做转译
- 解决: 配合 `tsc --noEmit` 使用

**问题2: CSS 预处理器**
- ESBuild 基础 CSS 支持有限
- 解决: 使用插件或预处理

**问题3: 复杂的代码分割**
- ESBuild 代码分割较简单
- 解决: 手动优化入口点配置

---

## 📦 迁移指南

### 从 Webpack 迁移到 ESBuild

#### 步骤1: 配置转换
```javascript
// Webpack
module.exports = {
  entry: './src/index.js',
  output: { filename: 'bundle.js' }
};

// ESBuild
await build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/bundle.js'
});
```

#### 步骤2: Loader 替换
```javascript
// Webpack loaders → ESBuild loaders
{
  '.ts': 'ts',      // ts-loader
  '.jsx': 'jsx',    // babel-loader
  '.css': 'css',    // css-loader
  '.png': 'file'    // file-loader
}
```

#### 步骤3: 插件迁移
- 分析现有 Webpack 插件功能
- 寻找 ESBuild 等价实现
- 或自定义 ESBuild 插件

### 渐进式迁移策略
1. **并行运行**: 同时保持两套构建
2. **功能对比**: 确保功能一致性
3. **性能验证**: 对比构建速度和输出质量
4. **逐步替换**: 先替换开发环境，再替换生产环境

---

## 🛠️ 开发工作流

### 1. 开发环境设置
```bash
# 启动开发服务器
npm run dev

# 或者使用配置文件
npm run dev-server
```

### 2. 生产构建
```bash
# 基础构建
npm run build

# 高级构建
npm run build:advanced

# 压缩构建
npm run build:min
```

### 3. 监听模式
```bash
# 文件监听
npm run build:watch

# 配置演示中的监听
npm run config:watch
```

---

## 📈 性能监控

### 构建时间分析
```javascript
const startTime = Date.now();
const result = await build(config);
const buildTime = Date.now() - startTime;

console.log(`构建时间: ${buildTime}ms`);
```

### 输出大小分析
```javascript
if (result.metafile) {
  const outputs = result.metafile.outputs;
  const totalSize = Object.values(outputs)
    .reduce((sum, output) => sum + output.bytes, 0);
  
  console.log(`总大小: ${formatBytes(totalSize)}`);
}
```

---

## 🎉 总结

### ESBuild 的优势
- ⚡ **极快的构建速度**: 比 Webpack 快 10-100 倍
- 🎯 **零配置**: TypeScript/JSX 开箱即用
- 📦 **内置优化**: Tree shaking, 代码压缩
- 🔧 **简单配置**: 约定优于配置

### 适用场景
- ✅ 现代 Web 应用开发
- ✅ TypeScript/React 项目
- ✅ 追求极致构建速度
- ✅ 简单到中等复杂度项目

### 学习建议
1. **从简单开始**: 先掌握基础配置
2. **实践为主**: 多运行示例和演示
3. **对比学习**: 理解与 Webpack 的差异
4. **逐步深入**: 掌握高级特性和 API

通过这个完整的学习资源，你应该能够熟练掌握 ESBuild 的配置和 API 使用，并能根据项目需求选择合适的构建方案。

---

## 📞 获取帮助

如果在学习过程中遇到问题：

1. **查看文档**: 先查阅相关的 `.md` 文档
2. **运行示例**: 使用 `npm run` 命令运行相关示例
3. **对比配置**: 参考 [WEBPACK_VS_ESBUILD.md](./WEBPACK_VS_ESBUILD.md)
4. **实验修改**: 在示例基础上进行修改和实验

祝你学习愉快！🚀
