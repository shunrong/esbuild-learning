# ESBuild 配置项和 API 详解

## 目录
1. [入口和输出配置](#入口和输出配置)
2. [打包相关配置](#打包相关配置)
3. [代码转换和优化](#代码转换和优化)
4. [平台和目标环境](#平台和目标环境)
5. [文件处理](#文件处理)
6. [路径解析](#路径解析)
7. [插件系统](#插件系统)
8. [开发和调试](#开发和调试)
9. [与 Webpack 的对比](#与-webpack-的对比)
10. [实用配置示例](#实用配置示例)

---

## 入口和输出配置

### 🎯 entryPoints - 入口文件

**ESBuild**:
```javascript
// 单个入口
entryPoints: ['src/index.js']

// 多个入口（数组形式）
entryPoints: ['src/app.js', 'src/admin.js']

// 多个入口（对象形式，可自定义输出名称）
entryPoints: {
  'app': 'src/app.js',
  'admin': 'src/admin.js',
  'worker': 'src/worker.js'
}
```

**vs Webpack**:
```javascript
// webpack.config.js
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  }
}
```

**差异**:
- ESBuild 的对象形式更简洁，直接指定输出名称
- Webpack 的 entry 功能更复杂，支持依赖数组等高级特性

### 📁 输出配置

**outfile vs outdir**:
```javascript
// 单文件输出
{
  entryPoints: ['src/index.js'],
  outfile: 'dist/bundle.js'  // 指定单个输出文件
}

// 多文件输出
{
  entryPoints: ['src/app.js', 'src/worker.js'],
  outdir: 'dist',  // 输出目录
  outExtension: {
    '.js': '.mjs'  // 自定义文件扩展名
  }
}
```

**vs Webpack**:
```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js'
  }
}
```

**优势对比**:
- ESBuild: 配置更简单直观
- Webpack: 提供更多命名模板和自定义选项

---

## 打包相关配置

### 📦 bundle - 是否打包

```javascript
{
  bundle: true,  // 将所有依赖打包到一起
  // vs
  bundle: false  // 仅转换，不打包依赖
}
```

**使用场景**:
- `true`: 构建单页应用、库文件
- `false`: 构建 Node.js 项目、多文件输出

### 🌳 splitting - 代码分割

```javascript
{
  format: 'esm',     // 仅在 ESM 格式下可用
  splitting: true,   // 启用代码分割
  chunkNames: 'chunks/[name]-[hash]'  // 分块文件命名
}
```

**vs Webpack**:
```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
```

**差异**:
- ESBuild: 自动分割，配置简单
- Webpack: 提供精细的分割控制

### 🌲 treeShaking - 树摇优化

```javascript
{
  treeShaking: true,  // 默认开启
  // ESBuild 自动检测副作用
}
```

**vs Webpack**:
```javascript
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false
  }
}
```

---

## 代码转换和优化

### 🗜️ minify - 代码压缩

```javascript
{
  minify: true,  // 开启所有压缩
  
  // 或分别控制
  minifyWhitespace: true,    // 压缩空白
  minifyIdentifiers: true,   // 压缩标识符
  minifySyntax: true        // 压缩语法
}
```

**vs Webpack**:
```javascript
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {},
          mangle: {}
        }
      })
    ]
  }
}
```

### 🔄 语法转换

```javascript
{
  target: ['es2020', 'chrome80', 'firefox80'],  // 目标环境
  
  // JSX 配置
  jsx: 'automatic',          // React 17+ 新语法
  jsxImportSource: 'react',  // JSX 导入源
  
  // TypeScript
  tsconfigRaw: {             // 内联 TS 配置
    compilerOptions: {
      useDefineForClassFields: false
    }
  }
}
```

**vs Babel (Webpack)**:
```javascript
module.exports = {
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    }]
  }
}
```

**优势**:
- ESBuild: 内置 TS/JSX 支持，无需额外配置
- Babel: 插件生态丰富，转换能力更强

---

## 平台和目标环境

### 🖥️ platform - 目标平台

```javascript
{
  platform: 'browser',  // 浏览器环境
  // platform: 'node',   // Node.js 环境
  // platform: 'neutral' // 平台无关
}
```

**影响**:
- `browser`: 适用于浏览器，支持 ES 模块
- `node`: 适用于 Node.js，处理 CommonJS
- `neutral`: 不做平台特定优化

### 📋 format - 输出格式

```javascript
{
  format: 'iife',  // 立即执行函数 (浏览器)
  // format: 'cjs',   // CommonJS (Node.js)
  // format: 'esm'    // ES 模块 (现代环境)
}
```

**vs Webpack**:
```javascript
module.exports = {
  output: {
    library: {
      type: 'umd'  // UMD 格式
    }
  }
}
```

### 🎯 target - 目标版本

```javascript
{
  // 单个目标
  target: 'es2020',
  
  // 多个目标
  target: ['es2020', 'chrome80', 'firefox80', 'safari14', 'node14']
}
```

**vs Babel**:
```javascript
// .babelrc
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["last 2 versions", "> 1%"]
      }
    }]
  ]
}
```

---

## 文件处理

### 📎 loader - 文件加载器

```javascript
{
  loader: {
    '.png': 'file',        // 文件路径
    '.svg': 'text',        // 文本内容
    '.svg': 'dataurl',     // Data URL
    '.css': 'css',         // CSS 处理
    '.json': 'json'        // JSON 数据
  }
}
```

**vs Webpack**:
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource'
      },
      {
        test: /\.svg$/,
        type: 'asset/source'
      }
    ]
  }
}
```

**差异**:
- ESBuild: 内置常用加载器，配置简单
- Webpack: 生态丰富，支持复杂的文件处理

### 🔍 resolveExtensions - 文件扩展名解析

```javascript
{
  resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.json']
}
```

类似 Webpack 的 `resolve.extensions`。

---

## 插件系统

### 🔌 plugins - 插件配置

```javascript
import { customPlugin } from './plugins/custom-plugin.js';

{
  plugins: [
    customPlugin({
      option: 'value'
    })
  ]
}
```

**ESBuild 插件 vs Webpack 插件**:

**ESBuild 插件**:
```javascript
export function customPlugin(options) {
  return {
    name: 'custom',
    setup(build) {
      build.onLoad({ filter: /\.special$/ }, async (args) => {
        // 自定义加载逻辑
      });
    }
  };
}
```

**Webpack 插件**:
```javascript
class CustomPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('CustomPlugin', (compilation, callback) => {
      // 自定义逻辑
    });
  }
}
```

**差异**:
- ESBuild: API 更简洁，专注于构建性能
- Webpack: 生态更成熟，功能更丰富

---

## 开发和调试

### 🗺️ sourcemap - 源码映射

```javascript
{
  sourcemap: true,        // 生成 .map 文件
  // sourcemap: 'inline',  // 内联到文件中
  // sourcemap: 'external' // 外部文件
  // sourcemap: false     // 不生成
}
```

### 👀 watch - 监听模式

```javascript
{
  watch: {
    onRebuild(error, result) {
      if (error) console.error('构建失败:', error);
      else console.log('构建成功');
    }
  }
}
```

**vs Webpack**:
```javascript
module.exports = {
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300
  }
}
```

### 🌐 serve - 开发服务器

```javascript
{
  serve: {
    port: 8000,
    host: 'localhost',
    servedir: 'public'
  }
}
```

**vs Webpack Dev Server**:
```javascript
module.exports = {
  devServer: {
    static: './public',
    port: 8000,
    hot: true
  }
}
```

**差异**:
- ESBuild: 轻量级静态服务器
- Webpack: 功能丰富的开发服务器（HMR、代理等）

---

## 与 Webpack 的对比

### 📊 配置复杂度对比

**ESBuild (简单项目)**:
```javascript
import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true
});
```

**Webpack (相同功能)**:
```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production'
};
```

### ⚡ 性能对比

| 特性 | ESBuild | Webpack |
|------|---------|---------|
| 构建速度 | 🚀🚀🚀🚀🚀 | 🚀🚀 |
| 配置复杂度 | ✅ 简单 | ❗ 复杂 |
| 生态系统 | 🔧 较少 | 🛠️ 丰富 |
| TypeScript | ✅ 内置 | 🔧 需配置 |
| 热更新 | ⚠️ 基础 | ✅ 完善 |

### 🎯 适用场景

**选择 ESBuild 当**:
- 追求极致构建速度
- 项目相对简单
- 主要使用 TS/JSX
- 不需要复杂的资源处理

**选择 Webpack 当**:
- 需要复杂的构建流程
- 大量自定义 loader/plugin
- 需要完善的 HMR
- 遗留项目迁移

---

## 实用配置示例

### 🌐 现代 Web 应用

```javascript
export const modernWebConfig = {
  entryPoints: {
    'app': 'src/app.tsx',
    'vendor': 'src/vendor.ts'
  },
  outdir: 'dist',
  format: 'esm',
  splitting: true,
  chunkNames: 'chunks/[name]-[hash]',
  assetNames: 'assets/[name]-[hash]',
  
  bundle: true,
  minify: true,
  sourcemap: 'external',
  target: ['es2020', 'chrome90', 'firefox88', 'safari14'],
  
  jsx: 'automatic',
  jsxImportSource: 'react',
  
  loader: {
    '.png': 'file',
    '.svg': 'dataurl',
    '.css': 'css'
  },
  
  define: {
    'process.env.NODE_ENV': '"production"'
  }
};
```

### 📚 库开发配置

```javascript
export const libraryConfig = {
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  
  // 多格式输出
  format: 'esm',
  
  bundle: true,
  minify: true,
  sourcemap: true,
  
  // 外部化所有依赖
  external: ['react', 'react-dom'],
  
  // 保持导出名称
  keepNames: true,
  
  target: ['es2020', 'node14']
};
```

### 🖥️ Node.js 应用配置

```javascript
export const nodeConfig = {
  entryPoints: ['src/server.ts'],
  outfile: 'dist/server.js',
  platform: 'node',
  format: 'esm',
  target: 'node18',
  
  bundle: true,
  minify: false,
  sourcemap: true,
  
  // Node.js 内置模块
  external: [
    'fs', 'path', 'crypto', 'util',
    'events', 'stream', 'buffer'
  ],
  
  define: {
    'global': 'globalThis'
  }
};
```

### 🔧 开发环境配置

```javascript
export const devConfig = {
  entryPoints: ['src/index.tsx'],
  outdir: 'dist',
  format: 'esm',
  
  bundle: true,
  minify: false,
  sourcemap: 'inline',
  
  // 开发优化
  keepNames: true,
  treeShaking: false,
  
  jsx: 'automatic',
  
  define: {
    'process.env.NODE_ENV': '"development"',
    'DEBUG': 'true'
  },
  
  // 监听模式
  watch: {
    onRebuild(error, result) {
      if (error) {
        console.error('❌ 构建失败:', error);
      } else {
        console.log('✅ 构建成功');
      }
    }
  },
  
  // 开发服务器
  serve: {
    port: 3000,
    servedir: 'public'
  }
};
```

---

## 最佳实践建议

### 🎯 性能优化

1. **合理使用 external**:
```javascript
{
  external: ['react', 'react-dom'],  // 大型库外部化
}
```

2. **启用代码分割**:
```javascript
{
  format: 'esm',
  splitting: true,  // 仅在 ESM 下可用
}
```

3. **目标环境优化**:
```javascript
{
  target: ['es2020'],  // 避免过度转译
}
```

### 🔧 开发体验

1. **开发/生产环境分离**:
```javascript
const isDev = process.env.NODE_ENV === 'development';

const config = {
  minify: !isDev,
  sourcemap: isDev ? 'inline' : 'external',
  watch: isDev
};
```

2. **使用 metafile 分析**:
```javascript
{
  metafile: true,  // 生成构建分析文件
}
```

---

这个配置指南涵盖了 ESBuild 的核心功能和与 Webpack 的主要差异。ESBuild 的设计哲学是"约定优于配置"，提供开箱即用的体验，同时保持极高的构建性能。
