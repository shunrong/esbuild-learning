# ESBuild + Babel 集成方案详解

## 🎯 为什么需要集成 Babel？

ESBuild 虽然速度极快，但在语法转换方面有限制：

- ❌ **不支持 ES5 转换**: 无法将 `const`、箭头函数等转为 ES5
- ❌ **有限的 polyfill**: 不提供 API polyfill
- ❌ **实验性语法**: 对某些提案阶段的语法支持有限

Babel 则在语法转换方面非常强大：
- ✅ **完整的 ES5 支持**: 可以转换所有现代语法
- ✅ **丰富的插件**: 支持实验性语法
- ✅ **Polyfill 支持**: 可以添加 API polyfill

## 🔄 集成策略

### 策略1: Babel 预处理 + ESBuild 打包
```
源码 → Babel转换 → ESBuild打包 → 输出
```

### 策略2: ESBuild 插件方式
```
源码 → ESBuild(内置Babel插件) → 输出
```

### 策略3: 分离式构建
```
现代版本: 源码 → ESBuild → 现代浏览器
兼容版本: 源码 → Babel → ESBuild → 老浏览器
```

---

## 🛠️ 方案一：Babel 预处理 + ESBuild 打包

### 第一步：安装依赖

```bash
npm install --save-dev @babel/core @babel/preset-env @babel/cli
```

### 第二步：配置 Babel

```javascript
// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          ie: '11',           // 支持 IE11
          chrome: '58',       // Chrome 58+
          firefox: '55'       // Firefox 55+
        },
        modules: false,       // 保持 ES 模块，让 ESBuild 处理
        useBuiltIns: 'usage', // 自动添加需要的 polyfill
        corejs: 3
      }
    ]
  ]
};
```

### 第三步：两步构建流程

```javascript
// build-with-babel.js
import { execSync } from 'child_process';
import { build } from 'esbuild';
import fs from 'fs';

async function buildWithBabel() {
  console.log('🔄 步骤1: Babel 预处理...');
  
  // 使用 Babel 转换源码
  execSync('npx babel src --out-dir temp/babel-output --source-maps', {
    stdio: 'inherit'
  });
  
  console.log('📦 步骤2: ESBuild 打包...');
  
  // 使用 ESBuild 打包 Babel 转换后的代码
  await build({
    entryPoints: ['temp/babel-output/index.js'],
    bundle: true,
    outfile: 'dist/babel-esbuild/bundle.js',
    target: 'es5',  // 现在可以安全使用 es5
    format: 'iife',
    globalName: 'MyApp',
    minify: true,
    sourcemap: true
  });
  
  // 清理临时文件
  fs.rmSync('temp', { recursive: true, force: true });
  
  console.log('✅ 构建完成！');
}
```

---

## 🔌 方案二：ESBuild 插件方式

### 创建 Babel 插件

```javascript
// babel-plugin.js
import { transform } from '@babel/core';

export function babelPlugin(options = {}) {
  return {
    name: 'babel',
    setup(build) {
      // 处理 JavaScript 文件
      build.onLoad({ filter: /\.(js|jsx|ts|tsx)$/ }, async (args) => {
        const fs = await import('fs');
        const source = await fs.promises.readFile(args.path, 'utf8');
        
        try {
          // 使用 Babel 转换代码
          const result = await transform(source, {
            filename: args.path,
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: options.targets || { ie: '11' },
                  modules: false
                }
              ]
            ],
            sourceMaps: true
          });
          
          return {
            contents: result.code,
            loader: 'js'
          };
          
        } catch (error) {
          return {
            errors: [{
              text: error.message,
              location: { file: args.path }
            }]
          };
        }
      });
    }
  };
}
```

### 使用插件构建

```javascript
// build-with-plugin.js
import { build } from 'esbuild';
import { babelPlugin } from './babel-plugin.js';

await build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/plugin-babel/bundle.js',
  target: 'es5',
  format: 'iife',
  globalName: 'MyApp',
  plugins: [
    babelPlugin({
      targets: { ie: '11', chrome: '58' }
    })
  ],
  minify: true,
  sourcemap: true
});
```

---

## 🎭 方案三：分离式构建（推荐）

为现代浏览器和老浏览器分别构建：

```javascript
// dual-build.js
import { build } from 'esbuild';
import { transform } from '@babel/core';
import fs from 'fs';

async function dualBuild() {
  console.log('🚀 开始分离式构建...\n');
  
  // 现代浏览器版本（ESBuild 直接处理）
  console.log('📦 构建现代版本...');
  await build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: 'dist/dual/modern.js',
    target: ['es2020', 'chrome90', 'firefox88'],
    format: 'esm',
    minify: true,
    sourcemap: true
  });
  
  // 兼容版本（Babel + ESBuild）
  console.log('📦 构建兼容版本...');
  
  // 1. 读取源文件
  const sourceCode = fs.readFileSync('src/index.js', 'utf8');
  
  // 2. Babel 转换
  const babelResult = await transform(sourceCode, {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: { ie: '11' },
          modules: false,
          useBuiltIns: 'usage',
          corejs: 3
        }
      ]
    ]
  });
  
  // 3. 写入临时文件
  fs.mkdirSync('temp', { recursive: true });
  fs.writeFileSync('temp/legacy.js', babelResult.code);
  
  // 4. ESBuild 打包
  await build({
    entryPoints: ['temp/legacy.js'],
    bundle: true,
    outfile: 'dist/dual/legacy.js',
    target: 'es5',
    format: 'iife',
    globalName: 'MyApp',
    minify: true
  });
  
  // 5. 清理临时文件
  fs.rmSync('temp', { recursive: true, force: true });
  
  // 6. 生成 HTML 文件来测试
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Dual Build Demo</title>
</head>
<body>
  <h1>ESBuild + Babel 双版本构建演示</h1>
  
  <!-- 现代浏览器加载 ES 模块 -->
  <script type="module">
    if ('noModule' in HTMLScriptElement.prototype) {
      import('./modern.js');
    }
  </script>
  
  <!-- 老浏览器回退到 IIFE 版本 -->
  <script nomodule src="./legacy.js"></script>
  
  <div id="app"></div>
</body>
</html>`;
  
  fs.writeFileSync('dist/dual/index.html', html);
  
  console.log('\n✅ 分离式构建完成！');
  console.log('📁 现代版本: dist/dual/modern.js');
  console.log('📁 兼容版本: dist/dual/legacy.js');
  console.log('🌐 测试页面: dist/dual/index.html');
}
```

---

## ⚡ 性能对比

### 构建速度对比

```javascript
// performance-comparison.js
import { build } from 'esbuild';
import { transform } from '@babel/core';

async function performanceTest() {
  const iterations = 5;
  const results = {};
  
  // ESBuild 单独构建
  console.log('测试 ESBuild 单独构建...');
  const esbuildTimes = [];
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    await build({
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: 'temp/esbuild-only.js',
      target: 'es2020',
      write: false // 不写入文件，只测试速度
    });
    esbuildTimes.push(Date.now() - start);
  }
  
  // Babel + ESBuild 组合构建
  console.log('测试 Babel + ESBuild 组合构建...');
  const combinedTimes = [];
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    
    // Babel 转换
    const source = fs.readFileSync('src/index.js', 'utf8');
    await transform(source, {
      presets: [['@babel/preset-env', { targets: { ie: '11' } }]]
    });
    
    // ESBuild 打包
    await build({
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: 'temp/babel-esbuild.js',
      target: 'es5',
      write: false
    });
    
    combinedTimes.push(Date.now() - start);
  }
  
  // 计算平均时间
  const avgEsbuild = esbuildTimes.reduce((a, b) => a + b, 0) / iterations;
  const avgCombined = combinedTimes.reduce((a, b) => a + b, 0) / iterations;
  
  console.log('\n📊 性能对比结果:');
  console.log(`ESBuild 单独:      ${avgEsbuild.toFixed(1)}ms`);
  console.log(`Babel + ESBuild:   ${avgCombined.toFixed(1)}ms`);
  console.log(`性能损失:          ${((avgCombined / avgEsbuild - 1) * 100).toFixed(1)}%`);
}
```

---

## 🛠️ 实用工具脚本

### 智能构建脚本

```javascript
// smart-build.js
import { build } from 'esbuild';
import { transform } from '@babel/core';

export async function smartBuild(options = {}) {
  const {
    entry = 'src/index.js',
    outdir = 'dist/smart',
    targets = {
      modern: ['es2020', 'chrome90'],
      legacy: { ie: '11' }
    }
  } = options;
  
  console.log('🧠 智能构建开始...\n');
  
  // 检测是否需要 Babel 转换
  const needsBabel = targets.legacy && Object.keys(targets.legacy).length > 0;
  
  if (needsBabel) {
    console.log('🔄 检测到需要兼容性支持，启用双版本构建');
    
    // 现代版本
    await build({
      entryPoints: [entry],
      bundle: true,
      outfile: `${outdir}/modern.js`,
      target: targets.modern,
      format: 'esm',
      minify: true,
      sourcemap: true
    });
    
    // 兼容版本
    const source = fs.readFileSync(entry, 'utf8');
    const babelResult = await transform(source, {
      presets: [
        ['@babel/preset-env', {
          targets: targets.legacy,
          modules: false
        }]
      ]
    });
    
    fs.mkdirSync('temp', { recursive: true });
    fs.writeFileSync('temp/legacy.js', babelResult.code);
    
    await build({
      entryPoints: ['temp/legacy.js'],
      bundle: true,
      outfile: `${outdir}/legacy.js`,
      target: 'es5',
      format: 'iife',
      globalName: 'App',
      minify: true
    });
    
    fs.rmSync('temp', { recursive: true, force: true });
    
  } else {
    console.log('⚡ 无需兼容性支持，使用 ESBuild 快速构建');
    
    await build({
      entryPoints: [entry],
      bundle: true,
      outfile: `${outdir}/bundle.js`,
      target: targets.modern,
      format: 'esm',
      minify: true,
      sourcemap: true
    });
  }
  
  console.log('✅ 智能构建完成！');
}
```

---

## 📦 Package.json 脚本配置

```json
{
  "scripts": {
    "build:modern": "node scripts/esbuild-only.js",
    "build:legacy": "node scripts/babel-esbuild.js", 
    "build:dual": "node scripts/dual-build.js",
    "build:smart": "node scripts/smart-build.js",
    "build:all": "npm run build:modern && npm run build:legacy && npm run build:dual"
  },
  "devDependencies": {
    "esbuild": "^0.19.5",
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "@babel/cli": "^7.23.0",
    "core-js": "^3.33.0"
  }
}
```

---

## 🎯 最佳实践建议

### 1. 选择合适的集成方案

**仅现代浏览器**:
```javascript
// 直接使用 ESBuild
target: ['es2020', 'chrome90', 'firefox88']
```

**需要 IE 支持**:
```javascript
// 使用 Babel + ESBuild
// 方案二的插件方式最简洁
```

**大型项目**:
```javascript
// 使用分离式构建
// 方案三提供最好的性能平衡
```

### 2. 依赖管理

```javascript
// 现代版本：使用原生 ES 模块
{
  "type": "module",
  "exports": {
    "import": "./dist/modern.js",
    "require": "./dist/legacy.js"
  }
}
```

### 3. 开发环境优化

```javascript
// 开发环境跳过 Babel，使用 ESBuild
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  // 仅 ESBuild，快速开发
  await build({ target: 'es2020' });
} else {
  // 生产环境使用 Babel + ESBuild
  await smartBuild();
}
```

通过这些方案，你可以充分利用 ESBuild 的速度优势，同时获得 Babel 的强大转换能力！🚀
