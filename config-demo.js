// ESBuild 配置演示脚本
// 运行: node config-demo.js [demo-name]

import * as esbuild from 'esbuild';
const { build, serve, transform } = esbuild;
import fs from 'fs';
import path from 'path';

// 确保输出目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// =============================================================================
// 演示 1: 基础配置对比
// =============================================================================

async function demoBasicConfig() {
  console.log('🎯 演示 1: 基础配置');
  console.log('展示最简单的 ESBuild 配置 vs Webpack 等价配置\n');
  
  ensureDir('dist/config-demo');
  
  // ESBuild 基础配置
  const esbuildConfig = {
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: 'dist/config-demo/basic-bundle.js',
    format: 'iife',
    globalName: 'MyApp',
    minify: true,
    sourcemap: true
  };
  
  console.log('📋 ESBuild 配置:');
  console.log(JSON.stringify(esbuildConfig, null, 2));
  
  console.log('\n📋 等价的 Webpack 配置:');
  console.log(`
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'basic-bundle.js',
    path: path.resolve(__dirname, 'dist/config-demo'),
    library: {
      name: 'MyApp',
      type: 'var'
    }
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};`);
  
  try {
    const startTime = Date.now();
    const result = await build(esbuildConfig);
    const buildTime = Date.now() - startTime;
    
    console.log(`\n✅ ESBuild 构建完成 (${buildTime}ms)`);
    
    // 显示输出文件信息
    const outputFile = esbuildConfig.outfile;
    if (fs.existsSync(outputFile)) {
      const stats = fs.statSync(outputFile);
      console.log(`📄 输出文件大小: ${formatBytes(stats.size)}`);
    }
    
  } catch (error) {
    console.error('❌ 构建失败:', error.message);
  }
}

// =============================================================================
// 演示 2: 入口和输出配置
// =============================================================================

async function demoEntryOutput() {
  console.log('\n🎯 演示 2: 入口和输出配置');
  console.log('展示不同的入口和输出配置方式\n');
  
  ensureDir('dist/config-demo/multi-entry');
  
  // 多入口配置
  const multiEntryConfig = {
    entryPoints: {
      'main': 'src/index.js',
      'utils': 'src/utils/math.js',
      'dom': 'src/utils/dom.js'
    },
    bundle: true,
    outdir: 'dist/config-demo/multi-entry',
    format: 'esm',
    splitting: true,  // 代码分割
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    outExtension: {
      '.js': '.mjs'   // 自定义扩展名
    },
    metafile: true
  };
  
  console.log('📋 多入口配置:');
  console.log(JSON.stringify(multiEntryConfig, null, 2));
  
  try {
    const result = await build(multiEntryConfig);
    
    console.log('\n✅ 多入口构建完成');
    console.log('📄 输出文件:');
    
    if (result.metafile) {
      Object.keys(result.metafile.outputs).forEach(file => {
        const info = result.metafile.outputs[file];
        console.log(`  - ${file}: ${formatBytes(info.bytes)}`);
      });
    }
    
  } catch (error) {
    console.error('❌ 多入口构建失败:', error.message);
  }
}

// =============================================================================
// 演示 3: 平台和目标环境配置
// =============================================================================

async function demoPlatformTarget() {
  console.log('\n🎯 演示 3: 平台和目标环境配置');
  console.log('展示不同平台和目标环境的配置差异\n');
  
  ensureDir('dist/config-demo/platform-demo');
  
  const configs = [
    {
      name: '浏览器环境 (现代)',
      config: {
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/config-demo/platform-demo/browser-modern.js',
        platform: 'browser',
        format: 'esm',
        target: ['es2020', 'chrome90', 'firefox88', 'safari14'],
        minify: true
      }
    },
    {
      name: '浏览器环境 (兼容)',
      config: {
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/config-demo/platform-demo/browser-legacy.js',
        platform: 'browser',
        format: 'iife',
        target: ['es2017'], // 改为 es2017，ESBuild 支持的最低版本
        minify: true,
        globalName: 'MyLegacyApp'
      }
    },
    {
      name: 'Node.js 环境',
      config: {
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/config-demo/platform-demo/node.js',
        platform: 'node',
        format: 'cjs',
        target: 'node18',
        external: ['fs', 'path', 'crypto']
      }
    },
    {
      name: '中性环境 (库)',
      config: {
        entryPoints: ['src/utils/math.js'],
        bundle: true,
        outfile: 'dist/config-demo/platform-demo/library.js',
        platform: 'neutral',
        format: 'esm',
        external: ['*'],  // 外部化所有依赖
        keepNames: true
      }
    }
  ];
  
  for (const { name, config } of configs) {
    console.log(`📦 构建: ${name}`);
    console.log(`   平台: ${config.platform}, 格式: ${config.format}, 目标: ${config.target || 'default'}`);
    
    try {
      const startTime = Date.now();
      await build(config);
      const buildTime = Date.now() - startTime;
      
      const stats = fs.statSync(config.outfile);
      console.log(`   ✅ 完成 (${buildTime}ms), 大小: ${formatBytes(stats.size)}\n`);
      
    } catch (error) {
      console.log(`   ❌ 失败: ${error.message}`);
      if (error.message.includes('not supported yet')) {
        console.log(`   💡 ESBuild 提示: 无法转换某些现代语法到目标环境`);
      }
      console.log('');
    }
  }
  
  // 添加 ESBuild 限制说明
  console.log('📚 学习要点:');
  console.log('   • ESBuild 无法将所有现代语法转换到 ES5');
  console.log('   • ESBuild 支持的最低目标版本通常是 ES2017');
  console.log('   • 如需 ES5 兼容，建议使用 Babel + ESBuild 组合');
  console.log('   • ESBuild 的优势在于现代浏览器的极速构建');
  
  // 演示 ES5 兼容的构建
  console.log('\n🔧 ES5 兼容性演示:');
  
  const es5CompatibleConfig = {
    name: 'ES5 兼容代码',
    config: {
      entryPoints: ['src/es5-compatible.js'],
      bundle: true,
      outfile: 'dist/config-demo/platform-demo/es5-compatible.js',
      platform: 'browser',
      format: 'iife',
      target: ['es5'],
      globalName: 'ES5App',
      minify: true
    }
  };
  
  console.log(`📦 构建: ${es5CompatibleConfig.name}`);
  console.log(`   使用 ES5 兼容的语法 (var, function, 传统 for 循环)`);
  
  try {
    const startTime = Date.now();
    await build(es5CompatibleConfig.config);
    const buildTime = Date.now() - startTime;
    
    const stats = fs.statSync(es5CompatibleConfig.config.outfile);
    console.log(`   ✅ 完成 (${buildTime}ms), 大小: ${formatBytes(stats.size)}`);
    console.log(`   💡 成功！ESBuild 可以处理 ES5 兼容的代码`);
    
  } catch (error) {
    console.log(`   ❌ 失败: ${error.message}`);
  }
}

// =============================================================================
// 演示 4: 文件处理和加载器
// =============================================================================

async function demoLoaders() {
  console.log('\n🎯 演示 4: 文件处理和加载器');
  console.log('展示不同文件类型的处理方式\n');
  
  ensureDir('dist/config-demo/loaders');
  
  // 创建测试文件（如果不存在）
  const testFiles = {
    'test-data.json': '{"message": "Hello from JSON", "version": "1.0.0"}',
    'test-style.css': 'body { background: #f0f0f0; color: #333; }',
    'test-text.txt': 'This is a text file content for testing.'
  };
  
  ensureDir('src/test-assets');
  Object.entries(testFiles).forEach(([filename, content]) => {
    const filepath = `src/test-assets/${filename}`;
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, content);
    }
  });
  
  // 创建导入这些资源的测试文件
  const testImportFile = `src/test-imports.js`;
  const testImportContent = `
// 测试不同加载器
import jsonData from './test-assets/test-data.json';
import cssContent from './test-assets/test-style.css';
import textContent from './test-assets/test-text.txt';

console.log('JSON data:', jsonData);
console.log('CSS content:', cssContent);
console.log('Text content:', textContent);

export { jsonData, cssContent, textContent };
`;
  
  if (!fs.existsSync(testImportFile)) {
    fs.writeFileSync(testImportFile, testImportContent);
  }
  
  const loaderConfigs = [
    {
      name: '文件加载器 (file)',
      config: {
        entryPoints: ['src/test-imports.js'],
        bundle: true,
        outfile: 'dist/config-demo/loaders/file-loader.js',
        loader: {
          '.json': 'file',
          '.css': 'file',
          '.txt': 'file'
        },
        assetNames: 'assets/[name]-[hash]'
      }
    },
    {
      name: '文本加载器 (text)',
      config: {
        entryPoints: ['src/test-imports.js'],
        bundle: true,
        outfile: 'dist/config-demo/loaders/text-loader.js',
        loader: {
          '.json': 'text',
          '.css': 'text',
          '.txt': 'text'
        }
      }
    },
    {
      name: 'JSON 加载器 (json)',
      config: {
        entryPoints: ['src/test-imports.js'],
        bundle: true,
        outfile: 'dist/config-demo/loaders/json-loader.js',
        loader: {
          '.json': 'json',
          '.css': 'css',
          '.txt': 'text'
        }
      }
    },
    {
      name: 'Data URL 加载器 (dataurl)',
      config: {
        entryPoints: ['src/test-imports.js'],
        bundle: true,
        outfile: 'dist/config-demo/loaders/dataurl-loader.js',
        loader: {
          '.json': 'dataurl',
          '.css': 'dataurl',
          '.txt': 'dataurl'
        }
      }
    }
  ];
  
  for (const { name, config } of loaderConfigs) {
    console.log(`📎 测试: ${name}`);
    
    try {
      await build(config);
      const stats = fs.statSync(config.outfile);
      console.log(`   ✅ 完成, 输出大小: ${formatBytes(stats.size)}`);
      
      // 显示加载器配置
      console.log(`   🔧 加载器:`, JSON.stringify(config.loader, null, 6));
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ 失败: ${error.message}\n`);
    }
  }
}

// =============================================================================
// 演示 5: 开发vs生产环境配置
// =============================================================================

async function demoEnvironments() {
  console.log('\n🎯 演示 5: 开发 vs 生产环境配置');
  console.log('展示不同环境下的最佳配置实践\n');
  
  ensureDir('dist/config-demo/environments');
  
  const environments = {
    development: {
      name: '开发环境',
      config: {
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/config-demo/environments/dev.js',
        format: 'iife',
        globalName: 'DevApp',
        
        // 开发优化
        minify: false,
        sourcemap: 'inline',
        keepNames: true,
        treeShaking: false,
        
        // 环境变量
        define: {
          'process.env.NODE_ENV': '"development"',
          'process.env.API_URL': '"http://localhost:3000/api"',
          'DEBUG': 'true'
        },
        
        // 日志详细
        logLevel: 'debug'
      }
    },
    
    production: {
      name: '生产环境',
      config: {
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/config-demo/environments/prod.js',
        format: 'iife',
        globalName: 'ProdApp',
        
        // 生产优化
        minify: true,
        sourcemap: false,
        treeShaking: true,
        
        // 高级压缩选项
        minifyWhitespace: true,
        minifyIdentifiers: true,
        minifySyntax: true,
        
        // 环境变量
        define: {
          'process.env.NODE_ENV': '"production"',
          'process.env.API_URL': '"https://api.myapp.com"',
          'DEBUG': 'false'
        },
        
        // 目标优化
        target: ['es2020', 'chrome90', 'firefox88', 'safari14'],
        
        // 构建分析
        metafile: true
      }
    },
    
    testing: {
      name: '测试环境',
      config: {
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/config-demo/environments/test.js',
        format: 'cjs',
        platform: 'node',
        
        // 测试优化
        minify: false,
        sourcemap: true,
        keepNames: true,
        
        // 外部化测试依赖
        external: ['jest', 'mocha', 'chai'],
        
        // 测试环境变量
        define: {
          'process.env.NODE_ENV': '"test"',
          'process.env.TEST_ENV': '"true"'
        }
      }
    }
  };
  
  console.log('📊 环境配置对比:');
  console.log('=' .repeat(80));
  console.log(`${'环境'.padEnd(12)} ${'压缩'.padEnd(8)} ${'SourceMap'.padEnd(12)} ${'TreeShaking'.padEnd(12)} ${'格式'.padEnd(8)}`);
  console.log('-'.repeat(80));
  
  for (const [env, { name, config }] of Object.entries(environments)) {
    console.log(
      `${name.padEnd(12)} ` +
      `${(config.minify ? '✅' : '❌').padEnd(8)} ` +
      `${(config.sourcemap || '❌').toString().padEnd(12)} ` +
      `${(config.treeShaking ? '✅' : '❌').padEnd(12)} ` +
      `${config.format.padEnd(8)}`
    );
    
    try {
      const startTime = Date.now();
      const result = await build(config);
      const buildTime = Date.now() - startTime;
      
      const stats = fs.statSync(config.outfile);
      console.log(`         构建时间: ${buildTime}ms, 文件大小: ${formatBytes(stats.size)}`);
      
    } catch (error) {
      console.log(`         ❌ 构建失败: ${error.message}`);
    }
  }
  
  console.log('=' .repeat(80));
}

// =============================================================================
// 演示 6: 代码转换 API
// =============================================================================

async function demoTransform() {
  console.log('\n🎯 演示 6: 代码转换 API');
  console.log('展示 transform API 的使用场景\n');
  
  const transformExamples = [
    {
      name: 'TypeScript 转换',
      code: `
interface User {
  name: string;
  age?: number;
}

const user: User = {
  name: 'Alice',
  age: 30
};

export default user;
      `,
      options: {
        loader: 'ts',
        target: 'es2020'
      }
    },
    {
      name: 'JSX 转换 (自动)',
      code: `
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}
      `,
      options: {
        loader: 'jsx',
        jsx: 'automatic',
        jsxImportSource: 'react'
      }
    },
    {
      name: 'JSX 转换 (传统)',
      code: `
export function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
      `,
      options: {
        loader: 'jsx',
        jsx: 'transform',
        jsxFactory: 'React.createElement'
      }
    },
    {
      name: 'ES6+ 降级',
      code: `
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = doubled.reduce((a, b) => a + b, 0);

class Calculator {
  #value = 0;
  
  add(num) {
    this.#value += num;
    return this;
  }
  
  get result() {
    return this.#value;
  }
}

export { Calculator, sum };
      `,
      options: {
        loader: 'js',
        target: 'es5'
      }
    }
  ];
  
  for (const { name, code, options } of transformExamples) {
    console.log(`🔄 ${name}:`);
    console.log(`   配置: ${JSON.stringify(options)}`);
    
    try {
      const result = await transform(code, options);
      
      console.log('   ✅ 转换成功');
      console.log('   📄 转换结果:');
      console.log('   ' + result.code.split('\n').join('\n   '));
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ 转换失败: ${error.message}\n`);
    }
  }
}

// =============================================================================
// 演示 7: 监听和开发服务器
// =============================================================================

async function demoWatchAndServe() {
  console.log('\n🎯 演示 7: 监听和开发服务器');
  console.log('展示开发环境的实时构建和服务器功能\n');
  
  console.log('📝 文件监听模式:');
  console.log('   - 监听源文件变化');
  console.log('   - 自动重新构建');
  console.log('   - 提供构建反馈');
  
  console.log('\n🌐 开发服务器:');
  console.log('   - 提供静态文件服务');
  console.log('   - 结合文件监听');
  console.log('   - 实时重新构建');
  
  console.log('\n💡 使用示例:');
  console.log(`
// 文件监听
const ctx = await build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  watch: {
    onRebuild(error, result) {
      if (error) console.error('构建失败:', error);
      else console.log('重新构建完成');
    }
  }
});

// 开发服务器
const server = await serve({
  port: 8000,
  servedir: 'dist'
}, {
  entryPoints: ['src/index.js'],
  bundle: true,
  outdir: 'dist'
});
  `);
  
  console.log('\n⚠️ 注意: 监听和服务器功能会持续运行，需要手动停止 (Ctrl+C)');
}

// =============================================================================
// 工具函数
// =============================================================================

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// =============================================================================
// 主执行函数
// =============================================================================

async function runDemo(demoName = 'all') {
  console.log('🚀 ESBuild 配置演示');
  console.log('==================\n');
  
  const demos = {
    'basic': demoBasicConfig,
    'entry': demoEntryOutput,
    'platform': demoPlatformTarget,
    'loaders': demoLoaders,
    'env': demoEnvironments,
    'transform': demoTransform,
    'watch': demoWatchAndServe
  };
  
  if (demoName === 'all') {
    // 运行所有演示
    for (const [name, demoFunc] of Object.entries(demos)) {
      await demoFunc();
    }
  } else if (demos[demoName]) {
    // 运行特定演示
    await demos[demoName]();
  } else {
    console.log('❌ 未知的演示名称:', demoName);
    console.log('\n可用的演示:');
    Object.keys(demos).forEach(name => {
      console.log(`  - ${name}`);
    });
    console.log('  - all (运行所有演示)');
    return;
  }
  
  console.log('\n🎉 演示完成！');
  console.log('\n📚 相关文档:');
  console.log('  - ESBUILD_CONFIG_GUIDE.md - 完整配置指南');
  console.log('  - WEBPACK_VS_ESBUILD.md - 与 Webpack 对比');
  console.log('  - API_EXAMPLES.js - API 调用示例');
}

// 命令行执行
if (import.meta.url === `file://${process.argv[1]}`) {
  const demoName = process.argv[2] || 'all';
  runDemo(demoName).catch(console.error);
}

export {
  demoBasicConfig,
  demoEntryOutput,
  demoPlatformTarget,
  demoLoaders,
  demoEnvironments,
  demoTransform,
  demoWatchAndServe,
  runDemo
};
