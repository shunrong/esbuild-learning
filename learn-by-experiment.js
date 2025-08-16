// ESBuild 学习实验脚本
// 这个脚本让你通过修改配置来学习 ESBuild 的各种特性

import * as esbuild from 'esbuild';
const { build } = esbuild;
import fs from 'fs';

console.log('🧪 ESBuild 学习实验工具');
console.log('============================\n');

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

// 实验1: 基础配置学习
async function experiment1() {
  console.log('🧪 实验1: 基础配置学习');
  console.log('尝试修改不同的配置选项，观察输出差异\n');
  
  ensureDir('dist/experiments');
  
  // 基础配置
  const baseConfig = {
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: 'dist/experiments/base.js',
    format: 'iife',
    globalName: 'MyApp'
  };
  
  console.log('📋 基础配置:');
  console.log(JSON.stringify(baseConfig, null, 2));
  
  try {
    const startTime = Date.now();
    const result = await build(baseConfig);
    const buildTime = Date.now() - startTime;
    
    const stats = fs.statSync(baseConfig.outfile);
    console.log(`✅ 构建成功 (${buildTime}ms), 文件大小: ${formatBytes(stats.size)}\n`);
    
    // 现在尝试不同的变化
    console.log('🔬 尝试以下变化:');
    console.log('1. 将 format 改为 "esm" 看看有什么变化');
    console.log('2. 添加 minify: true 观察压缩效果');
    console.log('3. 添加 sourcemap: true 生成源码映射');
    console.log('4. 修改 globalName 为其他名称');
    
    return baseConfig;
    
  } catch (error) {
    console.error('❌ 构建失败:', error.message);
    return null;
  }
}

// 实验2: 压缩效果对比
async function experiment2() {
  console.log('\n🧪 实验2: 压缩效果对比');
  console.log('对比压缩前后的文件大小差异\n');
  
  const configs = [
    {
      name: '未压缩',
      config: {
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/experiments/unminified.js',
        minify: false
      }
    },
    {
      name: '已压缩',
      config: {
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/experiments/minified.js',
        minify: true
      }
    }
  ];
  
  const results = [];
  
  for (const { name, config } of configs) {
    console.log(`📦 构建: ${name}`);
    
    try {
      const startTime = Date.now();
      await build(config);
      const buildTime = Date.now() - startTime;
      
      const stats = fs.statSync(config.outfile);
      const size = stats.size;
      
      results.push({ name, size, buildTime });
      console.log(`   ✅ 完成 (${buildTime}ms), 大小: ${formatBytes(size)}`);
      
    } catch (error) {
      console.log(`   ❌ 失败: ${error.message}`);
    }
  }
  
  if (results.length === 2) {
    const sizeReduction = ((results[0].size - results[1].size) / results[0].size * 100).toFixed(1);
    console.log(`\n📊 压缩效果: 减少了 ${sizeReduction}% 的文件大小`);
  }
}

// 实验3: 不同格式对比
async function experiment3() {
  console.log('\n🧪 实验3: 不同输出格式对比');
  console.log('对比 IIFE、ESM、CommonJS 格式的输出差异\n');
  
  const formats = [
    { name: 'IIFE (浏览器立即执行)', format: 'iife', ext: '.iife.js', globalName: 'MyApp' },
    { name: 'ESM (ES 模块)', format: 'esm', ext: '.esm.js' },
    { name: 'CommonJS (Node.js)', format: 'cjs', ext: '.cjs.js' }
  ];
  
  for (const { name, format, ext, globalName } of formats) {
    console.log(`📦 构建: ${name}`);
    
    const config = {
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: `dist/experiments/format${ext}`,
      format,
      ...(globalName && { globalName })
    };
    
    try {
      const startTime = Date.now();
      await build(config);
      const buildTime = Date.now() - startTime;
      
      const stats = fs.statSync(config.outfile);
      console.log(`   ✅ 完成 (${buildTime}ms), 大小: ${formatBytes(stats.size)}`);
      
      // 显示文件开头几行，看看格式差异
      const content = fs.readFileSync(config.outfile, 'utf8');
      const firstLine = content.split('\n')[0];
      console.log(`   🔍 文件开头: ${firstLine.substring(0, 60)}...`);
      
    } catch (error) {
      console.log(`   ❌ 失败: ${error.message}`);
    }
  }
  
  console.log('\n💡 学习提示:');
  console.log('- IIFE 格式适合直接在浏览器中使用');
  console.log('- ESM 格式是现代 JavaScript 标准');
  console.log('- CommonJS 格式主要用于 Node.js 环境');
}

// 实验4: Target 影响测试
async function experiment4() {
  console.log('\n🧪 实验4: Target 版本影响测试');
  console.log('测试不同 target 版本对代码转换的影响\n');
  
  const targets = [
    { name: '现代浏览器', target: 'es2020' },
    { name: '较老浏览器', target: 'es2015' },
    { name: 'Node.js 18', target: 'node18' }
  ];
  
  for (const { name, target } of targets) {
    console.log(`📦 构建: ${name} (${target})`);
    
    const config = {
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: `dist/experiments/target-${target}.js`,
      target,
      minify: false  // 不压缩，便于观察转换结果
    };
    
    try {
      const startTime = Date.now();
      await build(config);
      const buildTime = Date.now() - startTime;
      
      const stats = fs.statSync(config.outfile);
      console.log(`   ✅ 完成 (${buildTime}ms), 大小: ${formatBytes(stats.size)}`);
      
    } catch (error) {
      console.log(`   ❌ 失败: ${error.message}`);
      if (error.message.includes('not supported yet')) {
        console.log(`   💡 提示: ${target} 不支持某些现代语法特性`);
      }
    }
  }
}

// 实验5: SourceMap 测试
async function experiment5() {
  console.log('\n🧪 实验5: SourceMap 生成测试');
  console.log('测试不同 sourcemap 选项的效果\n');
  
  const sourcemapOptions = [
    { name: '无 SourceMap', sourcemap: false },
    { name: '外部 SourceMap', sourcemap: true },
    { name: '内联 SourceMap', sourcemap: 'inline' },
    { name: '仅外部 SourceMap', sourcemap: 'external' }
  ];
  
  for (const { name, sourcemap } of sourcemapOptions) {
    console.log(`📦 构建: ${name}`);
    
    const config = {
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: `dist/experiments/sourcemap-${name.replace(/\s+/g, '-').toLowerCase()}.js`,
      sourcemap,
      minify: true
    };
    
    try {
      const startTime = Date.now();
      await build(config);
      const buildTime = Date.now() - startTime;
      
      const stats = fs.statSync(config.outfile);
      console.log(`   ✅ 完成 (${buildTime}ms), 主文件: ${formatBytes(stats.size)}`);
      
      // 检查是否生成了 .map 文件
      const mapFile = config.outfile + '.map';
      if (fs.existsSync(mapFile)) {
        const mapStats = fs.statSync(mapFile);
        console.log(`   📍 SourceMap 文件: ${formatBytes(mapStats.size)}`);
      } else if (sourcemap === 'inline') {
        console.log(`   📍 SourceMap 已内联到主文件中`);
      } else {
        console.log(`   📍 无 SourceMap 文件`);
      }
      
    } catch (error) {
      console.log(`   ❌ 失败: ${error.message}`);
    }
  }
}

// 交互式学习功能
function showInteractiveTips() {
  console.log('\n🎓 交互式学习建议:');
  console.log('=====================================');
  console.log('1. 查看生成的文件:');
  console.log('   ls -la dist/experiments/');
  console.log('');
  console.log('2. 对比文件内容:');
  console.log('   head -10 dist/experiments/unminified.js');
  console.log('   head -10 dist/experiments/minified.js');
  console.log('');
  console.log('3. 查看不同格式的差异:');
  console.log('   cat dist/experiments/format.iife.js | head -5');
  console.log('   cat dist/experiments/format.esm.js | head -5');
  console.log('');
  console.log('4. 修改这个脚本进行更多实验:');
  console.log('   - 修改 target 版本');
  console.log('   - 尝试不同的 format');
  console.log('   - 测试 external 配置');
  console.log('   - 添加自定义 define 变量');
  console.log('');
  console.log('5. 下一步学习:');
  console.log('   npm run api:transform  # 学习代码转换 API');
  console.log('   npm run config:loaders # 学习文件加载器');
  console.log('=====================================');
}

// 主执行函数
async function runAllExperiments() {
  try {
    await experiment1();
    await experiment2();
    await experiment3();
    await experiment4();
    await experiment5();
    
    console.log('\n🎉 所有实验完成！');
    showInteractiveTips();
    
  } catch (error) {
    console.error('💥 实验执行失败:', error);
  }
}

// 单独运行某个实验
async function runSingleExperiment(expNumber) {
  const experiments = {
    1: experiment1,
    2: experiment2,
    3: experiment3,
    4: experiment4,
    5: experiment5
  };
  
  const experiment = experiments[expNumber];
  if (experiment) {
    console.log(`运行实验 ${expNumber}:\n`);
    await experiment();
    console.log('\n💡 运行 "node learn-by-experiment.js" 查看所有实验');
  } else {
    console.log('❌ 无效的实验编号，可用实验: 1-5');
  }
}

// 命令行执行
if (import.meta.url === `file://${process.argv[1]}`) {
  const expNumber = parseInt(process.argv[2]);
  
  if (expNumber) {
    runSingleExperiment(expNumber);
  } else {
    runAllExperiments();
  }
}

export {
  experiment1,
  experiment2,
  experiment3,
  experiment4,
  experiment5,
  runAllExperiments
};
