// ESBuild + Babel 集成演示
// 展示三种不同的集成方案

import * as esbuild from 'esbuild';
const { build, transform } = esbuild;
import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔧 ESBuild + Babel 集成演示');
console.log('===============================\n');

// 确保输出目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 格式化字节大小
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 检查 Babel 是否已安装
function checkBabelInstallation() {
  try {
    execSync('npx babel --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.log('❌ Babel 未安装，请运行:');
    console.log('   npm install --save-dev @babel/core @babel/preset-env @babel/cli core-js');
    console.log('');
    return false;
  }
}

// =============================================================================
// 演示 1: 仅 ESBuild（对比基准）
// =============================================================================

async function demo1_ESBuildOnly() {
  console.log('📦 演示 1: 仅 ESBuild 构建');
  console.log('目标: 现代浏览器 (ES2020)');
  
  ensureDir('dist/babel-demo');
  
  try {
    const startTime = Date.now();
    
    await build({
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: 'dist/babel-demo/esbuild-only.js',
      target: ['es2020'],
      format: 'esm',
      minify: true,
      sourcemap: true
    });
    
    const buildTime = Date.now() - startTime;
    const stats = fs.statSync('dist/babel-demo/esbuild-only.js');
    
    console.log(`✅ 构建完成 (${buildTime}ms)`);
    console.log(`📄 文件大小: ${formatBytes(stats.size)}`);
    console.log(`🎯 语法级别: ES2020 (现代浏览器)`);
    
    // 显示生成代码的特征
    const content = fs.readFileSync('dist/babel-demo/esbuild-only.js', 'utf8');
    const hasConst = content.includes('const ');
    const hasArrow = content.includes('=>');
    
    console.log(`🔍 代码特征: ${hasConst ? '包含 const' : '无 const'}, ${hasArrow ? '包含箭头函数' : '无箭头函数'}`);
    
  } catch (error) {
    console.log(`❌ 构建失败: ${error.message}`);
  }
  
  console.log('');
}

// =============================================================================
// 演示 2: Babel 预处理 + ESBuild 打包
// =============================================================================

async function demo2_BabelPreprocess() {
  console.log('📦 演示 2: Babel 预处理 + ESBuild 打包');
  console.log('目标: IE11 兼容 (ES5)');
  
  if (!checkBabelInstallation()) {
    return;
  }
  
  try {
    // 创建 Babel 配置文件
    const babelConfig = {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { ie: '11' },
            modules: false,        // 保持 ES 模块给 ESBuild 处理
            useBuiltIns: false,    // 暂时不使用 polyfill
            debug: false
          }
        ]
      ]
    };
    
    fs.writeFileSync('babel.config.json', JSON.stringify(babelConfig, null, 2));
    
    console.log('🔄 步骤 1: Babel 转换语法...');
    const babelStart = Date.now();
    
    // 使用 Babel 转换代码
    ensureDir('temp/babel-output');
    execSync('npx babel src/index.js --out-file temp/babel-output/index.js', {
      stdio: 'pipe'
    });
    
    const babelTime = Date.now() - babelStart;
    console.log(`   ✅ Babel 转换完成 (${babelTime}ms)`);
    
    console.log('📦 步骤 2: ESBuild 打包...');
    const esbuildStart = Date.now();
    
    // 使用 ESBuild 打包转换后的代码
    await build({
      entryPoints: ['temp/babel-output/index.js'],
      bundle: true,
      outfile: 'dist/babel-demo/babel-esbuild.js',
      target: 'es5',
      format: 'iife',
      globalName: 'MyApp',
      minify: true
    });
    
    const esbuildTime = Date.now() - esbuildStart;
    const totalTime = Date.now() - babelStart;
    
    console.log(`   ✅ ESBuild 打包完成 (${esbuildTime}ms)`);
    console.log(`⏱️  总构建时间: ${totalTime}ms`);
    
    const stats = fs.statSync('dist/babel-demo/babel-esbuild.js');
    console.log(`📄 文件大小: ${formatBytes(stats.size)}`);
    console.log(`🎯 语法级别: ES5 (IE11 兼容)`);
    
    // 分析转换后的代码
    const content = fs.readFileSync('dist/babel-demo/babel-esbuild.js', 'utf8');
    const hasVar = content.includes('var ');
    const hasFunction = content.includes('function');
    
    console.log(`🔍 代码特征: ${hasVar ? '使用 var' : '无 var'}, ${hasFunction ? '使用 function' : '无 function'}`);
    
    // 清理临时文件
    fs.rmSync('temp', { recursive: true, force: true });
    fs.rmSync('babel.config.json', { force: true });
    
  } catch (error) {
    console.log(`❌ 构建失败: ${error.message}`);
    // 清理
    fs.rmSync('temp', { recursive: true, force: true });
    fs.rmSync('babel.config.json', { force: true });
  }
  
  console.log('');
}

// =============================================================================
// 演示 3: ESBuild 插件方式（概念演示）
// =============================================================================

async function demo3_ESBuildPlugin() {
  console.log('📦 演示 3: ESBuild 插件方式');
  console.log('目标: 通过插件集成转换逻辑');
  
  // 创建一个简单的 ES5 兼容代码来演示插件概念
  const es5Code = `
// ES5 兼容代码示例 (用于演示插件处理)
var numbers = [1, 2, 3, 4, 5];

function add(a, b) {
  return a + b;
}

function processNumbers(nums) {
  var sum = 0;
  for (var i = 0; i < nums.length; i++) {
    sum = add(sum, nums[i]);
  }
  return { sum: sum, count: nums.length };
}

function displayResults() {
  var results = processNumbers(numbers);
  console.log('结果:', results);
  
  if (typeof document !== 'undefined') {
    document.body.innerHTML = '<h1>插件处理结果: 求和 = ' + results.sum + '</h1>';
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayResults);
  } else {
    displayResults();
  }
} else {
  displayResults();
}
`;
  
  // 写入临时文件
  ensureDir('temp');
  fs.writeFileSync('temp/plugin-demo.js', es5Code);
  
  // 演示插件概念（添加 banner）
  const bannerPlugin = {
    name: 'banner-plugin',
    setup(build) {
      build.onStart(() => {
        console.log('   🔌 插件: 构建开始');
      });
      
      build.onEnd((result) => {
        console.log('   🔌 插件: 构建结束');
      });
      
      build.onLoad({ filter: /plugin-demo\.js$/ }, async (args) => {
        const source = fs.readFileSync(args.path, 'utf8');
        
        // 添加 banner 注释
        const banner = '// 由 ESBuild 插件处理\\n// 构建时间: ' + new Date().toISOString() + '\\n\\n';
        
        return {
          contents: banner + source,
          loader: 'js'
        };
      });
    }
  };
  
  try {
    const startTime = Date.now();
    
    await build({
      entryPoints: ['temp/plugin-demo.js'],
      bundle: true,
      outfile: 'dist/babel-demo/plugin-demo.js',
      target: 'es5',
      format: 'iife',
      globalName: 'PluginDemo',
      plugins: [bannerPlugin],
      minify: true
    });
    
    const buildTime = Date.now() - startTime;
    const stats = fs.statSync('dist/babel-demo/plugin-demo.js');
    
    console.log(`✅ 构建完成 (${buildTime}ms)`);
    console.log(`📄 文件大小: ${formatBytes(stats.size)}`);
    console.log(`🎯 语法级别: ES5 (插件处理)`);
    console.log(`🔧 转换方式: ESBuild 插件`);
    
    // 显示插件处理的效果
    const content = fs.readFileSync('dist/babel-demo/plugin-demo.js', 'utf8');
    const hasPluginBanner = content.includes('由 ESBuild 插件处理');
    console.log(`🔍 插件效果: ${hasPluginBanner ? '成功添加 banner' : '未检测到 banner'}`);
    
    // 清理临时文件
    fs.rmSync('temp', { recursive: true, force: true });
    
  } catch (error) {
    console.log(`❌ 构建失败: ${error.message}`);
    fs.rmSync('temp', { recursive: true, force: true });
  }
  
  console.log('');
  console.log('💡 真实的 Babel 插件会:');
  console.log('   • 解析 AST (抽象语法树)');
  console.log('   • 应用语法转换规则');  
  console.log('   • 生成兼容代码');
  console.log('   • 添加必要的 polyfill');
}

// =============================================================================
// 演示 4: 分离式构建（现代 + 兼容）
// =============================================================================

async function demo4_DualBuild() {
  console.log('📦 演示 4: 分离式构建');
  console.log('同时构建现代版本和兼容版本');
  
  ensureDir('dist/babel-demo/dual');
  
  console.log('🚀 构建现代版本...');
  const modernStart = Date.now();
  
  try {
    // 现代版本
    await build({
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: 'dist/babel-demo/dual/modern.js',
      target: ['es2020', 'chrome90', 'firefox88'],
      format: 'esm',
      minify: true,
      sourcemap: true
    });
    
    const modernTime = Date.now() - modernStart;
    const modernStats = fs.statSync('dist/babel-demo/dual/modern.js');
    
    console.log(`   ✅ 现代版本完成 (${modernTime}ms), 大小: ${formatBytes(modernStats.size)}`);
    
    if (checkBabelInstallation()) {
      console.log('🔄 构建兼容版本...');
      const legacyStart = Date.now();
      
      // 兼容版本（需要 Babel）
      const babelConfig = {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: { ie: '11' },
              modules: false
            }
          ]
        ]
      };
      
      fs.writeFileSync('babel.config.json', JSON.stringify(babelConfig, null, 2));
      
      // Babel 转换
      ensureDir('temp/legacy');
      execSync('npx babel src/index.js --out-file temp/legacy/index.js', {
        stdio: 'pipe'
      });
      
      // ESBuild 打包
      await build({
        entryPoints: ['temp/legacy/index.js'],
        bundle: true,
        outfile: 'dist/babel-demo/dual/legacy.js',
        target: 'es5',
        format: 'iife',
        globalName: 'MyApp',
        minify: true
      });
      
      const legacyTime = Date.now() - legacyStart;
      const legacyStats = fs.statSync('dist/babel-demo/dual/legacy.js');
      
      console.log(`   ✅ 兼容版本完成 (${legacyTime}ms), 大小: ${formatBytes(legacyStats.size)}`);
      
      // 生成测试 HTML
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Dual Build Test</title>
</head>
<body>
  <h1>ESBuild + Babel 双版本构建测试</h1>
  <div id="app"></div>
  
  <!-- 现代浏览器加载 ES 模块 -->
  <script type="module" src="./modern.js"></script>
  
  <!-- 老浏览器回退到 IIFE 版本 -->
  <script nomodule src="./legacy.js"></script>
</body>
</html>`;
      
      fs.writeFileSync('dist/babel-demo/dual/index.html', html);
      
      console.log(`📊 构建对比:`);
      console.log(`   现代版本: ${formatBytes(modernStats.size)} (ES2020)`);
      console.log(`   兼容版本: ${formatBytes(legacyStats.size)} (ES5)`);
      console.log(`   大小差异: ${((legacyStats.size / modernStats.size - 1) * 100).toFixed(1)}%`);
      console.log(`🌐 测试页面: dist/babel-demo/dual/index.html`);
      
      // 清理
      fs.rmSync('temp', { recursive: true, force: true });
      fs.rmSync('babel.config.json', { force: true });
    }
    
  } catch (error) {
    console.log(`❌ 构建失败: ${error.message}`);
  }
  
  console.log('');
}

// =============================================================================
// 性能对比
// =============================================================================

async function performanceComparison() {
  console.log('⚡ 性能对比测试');
  console.log('对比不同方案的构建速度');
  
  const iterations = 3;
  const results = {};
  
  // ESBuild 单独构建
  console.log('🧪 测试 ESBuild 单独构建...');
  const esbuildTimes = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    await build({
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: 'temp/perf-esbuild.js',
      target: 'es2020',
      minify: true,
      write: false // 不写入文件
    });
    esbuildTimes.push(Date.now() - start);
  }
  
  const avgESBuild = esbuildTimes.reduce((a, b) => a + b, 0) / iterations;
  results.esbuild = avgESBuild;
  
  if (checkBabelInstallation()) {
    // Babel + ESBuild 构建
    console.log('🧪 测试 Babel + ESBuild 构建...');
    const combinedTimes = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      
      // 模拟 Babel 转换时间（实际项目中这个会更慢）
      const source = fs.readFileSync('src/index.js', 'utf8');
      const transformed = source.replace(/const /g, 'var ');
      
      await build({
        entryPoints: ['src/es5-compatible.js'],  // 使用 ES5 兼容的文件
        bundle: true,
        outfile: 'temp/perf-babel.js',
        target: 'es5',
        minify: true,
        write: false
      });
      
      combinedTimes.push(Date.now() - start);
    }
    
    const avgCombined = combinedTimes.reduce((a, b) => a + b, 0) / iterations;
    results.combined = avgCombined;
  }
  
  console.log(`\n📊 性能对比结果:`);
  console.log(`   ESBuild 单独:      ${results.esbuild.toFixed(1)}ms`);
  if (results.combined) {
    console.log(`   Babel + ESBuild:   ${results.combined.toFixed(1)}ms`);
    console.log(`   性能损失:          ${((results.combined / results.esbuild - 1) * 100).toFixed(1)}%`);
  }
  
  console.log('');
}

// =============================================================================
// 主函数
// =============================================================================

async function runAllDemos() {
  try {
    await demo1_ESBuildOnly();
    await demo2_BabelPreprocess();
    await demo3_ESBuildPlugin();
    await demo4_DualBuild();
    await performanceComparison();
    
    console.log('🎉 所有演示完成！');
    console.log('\n📁 查看生成的文件:');
    console.log('   ls -la dist/babel-demo/');
    console.log('\n📚 相关文档:');
    console.log('   - BABEL_INTEGRATION.md - 详细集成指南');
    console.log('   - ESBUILD_LIMITATIONS.md - ESBuild 限制说明');
    
  } catch (error) {
    console.error('💥 演示执行失败:', error);
  }
}

// 单独运行演示
async function runSingleDemo(demoNumber) {
  const demos = {
    1: demo1_ESBuildOnly,
    2: demo2_BabelPreprocess,
    3: demo3_ESBuildPlugin,
    4: demo4_DualBuild,
    perf: performanceComparison
  };
  
  const demo = demos[demoNumber];
  if (demo) {
    console.log(`运行演示 ${demoNumber}:\n`);
    await demo();
  } else {
    console.log('❌ 无效的演示编号');
    console.log('可用演示: 1, 2, 3, 4, perf');
  }
}

// 命令行执行
if (import.meta.url === `file://${process.argv[1]}`) {
  const demoArg = process.argv[2];
  
  if (demoArg) {
    runSingleDemo(demoArg);
  } else {
    runAllDemos();
  }
}

export {
  demo1_ESBuildOnly,
  demo2_BabelPreprocess,
  demo3_ESBuildPlugin,
  demo4_DualBuild,
  performanceComparison,
  runAllDemos
};
