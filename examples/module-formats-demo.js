// ESBuild 输出格式演示
// 展示不同输出格式的区别和用途

import { build } from 'esbuild';
import fs from 'fs';

// 创建一个简单的测试模块
const testModuleContent = `
// 测试模块
export const moduleVar = 'Hello from module';
export function moduleFunction() {
  const localVar = 'local variable';
  console.log('Module function called:', localVar);
  return localVar;
}

const privateVar = 'This should not leak to global scope';
console.log('Module loaded:', moduleVar);
`;

// 确保测试目录存在
if (!fs.existsSync('examples/test-module')) {
  fs.mkdirSync('examples/test-module', { recursive: true });
}

fs.writeFileSync('examples/test-module/index.js', testModuleContent);

// 不同的输出格式配置
const formatConfigs = {
  // 1. IIFE (立即执行函数) - 浏览器环境，避免全局污染
  iife: {
    name: 'IIFE (立即执行函数)',
    config: {
      entryPoints: ['examples/test-module/index.js'],
      bundle: true,
      format: 'iife',
      outfile: 'examples/output-iife.js',
      globalName: 'MyModule' // 可选：如果需要全局访问
    }
  },
  
  // 2. CommonJS - Node.js 环境
  cjs: {
    name: 'CommonJS',
    config: {
      entryPoints: ['examples/test-module/index.js'],
      bundle: true,
      format: 'cjs',
      outfile: 'examples/output-cjs.js',
      platform: 'node'
    }
  },
  
  // 3. ESM (ES Modules) - 现代 JavaScript 模块
  esm: {
    name: 'ES Modules',
    config: {
      entryPoints: ['examples/test-module/index.js'],
      bundle: true,
      format: 'esm',
      outfile: 'examples/output-esm.js'
    }
  }
};

// 构建所有格式
export async function demonstrateFormats() {
  console.log('🔍 ESBuild 输出格式演示\n');
  
  for (const [key, { name, config }] of Object.entries(formatConfigs)) {
    try {
      console.log(`📦 构建 ${name}...`);
      await build(config);
      
      // 读取并显示输出文件的开头
      const content = fs.readFileSync(config.outfile, 'utf8');
      const lines = content.split('\n').slice(0, 15);
      
      console.log(`✅ ${name} 输出 (前15行):`);
      console.log('─'.repeat(50));
      lines.forEach((line, i) => {
        console.log(`${String(i + 1).padStart(2)}: ${line}`);
      });
      console.log('─'.repeat(50));
      console.log('');
      
    } catch (error) {
      console.error(`❌ 构建 ${name} 失败:`, error.message);
    }
  }
  
  // 详细解释
  explainFormats();
}

function explainFormats() {
  console.log('📚 输出格式详解:\n');
  
  console.log('🎯 IIFE (立即执行函数表达式):');
  console.log('   特点: (() => { ... })()');
  console.log('   优势:');
  console.log('   • 创建独立的作用域，避免全局变量污染');
  console.log('   • 所有模块变量被封装在函数内部');
  console.log('   • 可以选择性地暴露全局变量 (globalName)');
  console.log('   • 适合浏览器环境的单文件部署');
  console.log('   • 兼容性极好，支持所有浏览器');
  console.log('');
  
  console.log('📦 CommonJS (CJS):');
  console.log('   特点: module.exports = ..., require(...)');
  console.log('   优势:');
  console.log('   • Node.js 的传统模块系统');
  console.log('   • 同步加载，简单直接');
  console.log('   • 广泛的生态系统支持');
  console.log('   • 适合服务端应用');
  console.log('');
  
  console.log('🌟 ES Modules (ESM):');
  console.log('   特点: export ..., import ...');
  console.log('   优势:');
  console.log('   • 现代 JavaScript 标准');
  console.log('   • 静态分析，支持 Tree Shaking');
  console.log('   • 异步加载，性能更好');
  console.log('   • 代码分割和动态导入支持');
  console.log('   • 浏览器和 Node.js 都支持');
  console.log('');
}

// 作用域隔离演示
export function demonstrateScopeIsolation() {
  console.log('🔒 作用域隔离演示:\n');
  
  const withoutIIFE = `
// 没有 IIFE 包裹的代码 (危险)
var userName = 'Alice';
var userAge = 25;

function greetUser() {
  console.log('Hello, ' + userName);
}

// 这些变量都会污染全局作用域!
console.log('Global userName:', window.userName); // 'Alice'
`;

  const withIIFE = `
// 使用 IIFE 包裹的代码 (安全)
(() => {
  var userName = 'Alice';  // 局部变量，不会泄露
  var userAge = 25;        // 局部变量，不会泄露
  
  function greetUser() {   // 局部函数，不会泄露
    console.log('Hello, ' + userName);
  }
  
  greetUser(); // 可以正常调用
})();

// 外部无法访问内部变量
console.log('Global userName:', window.userName); // undefined
`;

  console.log('❌ 没有作用域隔离的问题:');
  console.log(withoutIIFE);
  console.log('\n✅ 使用 IIFE 进行作用域隔离:');
  console.log(withIIFE);
  
  console.log('💡 核心原理:');
  console.log('   • JavaScript 函数创建独立的执行上下文');
  console.log('   • 函数内部的变量和函数不会泄露到外部');
  console.log('   • 立即执行确保代码在加载时就运行');
  console.log('   • 闭包机制保护内部状态');
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await demonstrateFormats();
    demonstrateScopeIsolation();
  })();
}
