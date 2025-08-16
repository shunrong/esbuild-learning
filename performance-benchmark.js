// ESBuild 性能基准测试
// 对比 ESBuild 与其他构建工具的性能

import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import os from 'os';

// 基准测试配置
const benchmarkConfigs = {
  esbuild_basic: {
    name: 'ESBuild (基础配置)',
    tool: 'esbuild',
    config: {
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: 'dist/benchmark/esbuild-basic.js',
      platform: 'browser',
      format: 'iife'
    }
  },
  
  esbuild_optimized: {
    name: 'ESBuild (优化配置)',
    tool: 'esbuild',
    config: {
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: 'dist/benchmark/esbuild-optimized.js',
      platform: 'browser',
      format: 'iife',
      minify: true,
      treeShaking: true,
      sourcemap: true,
      target: 'es2020'
    }
  },
  
  esbuild_react: {
    name: 'ESBuild (React)',
    tool: 'esbuild',
    config: {
      entryPoints: ['src/react-app.jsx'],
      bundle: true,
      outfile: 'dist/benchmark/esbuild-react.js',
      platform: 'browser',
      format: 'iife',
      minify: true,
      jsx: 'automatic'
    }
  },
  
  esbuild_typescript: {
    name: 'ESBuild (TypeScript)',
    tool: 'esbuild',
    config: {
      entryPoints: ['src/app.ts'],
      bundle: true,
      outfile: 'dist/benchmark/esbuild-typescript.js',
      platform: 'browser',
      format: 'iife',
      minify: true,
      sourcemap: true
    }
  }
};

// 性能测试结果
const results = [];

// 执行单个基准测试
async function runBenchmark(name, config) {
  console.log(`⏱️ 运行基准测试: ${config.name}`);
  
  const iterations = 5; // 运行5次取平均值
  const times = [];
  const sizes = [];
  
  for (let i = 0; i < iterations; i++) {
    const startTime = process.hrtime.bigint();
    
    try {
      const result = await build(config.config);
      
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // 转换为毫秒
      
      times.push(duration);
      
      // 计算输出文件大小
      if (result.metafile) {
        const totalSize = Object.values(result.metafile.outputs)
          .reduce((sum, output) => sum + output.bytes, 0);
        sizes.push(totalSize);
      } else {
        // 如果没有 metafile，直接读取文件大小
        const outputFile = config.config.outfile;
        if (fs.existsSync(outputFile)) {
          const stats = fs.statSync(outputFile);
          sizes.push(stats.size);
        }
      }
      
    } catch (error) {
      console.error(`❌ 基准测试失败 ${config.name}:`, error.message);
      return null;
    }
  }
  
  // 计算统计数据
  const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const avgSize = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
  
  const result = {
    name: config.name,
    tool: config.tool,
    iterations,
    avgTime: Math.round(avgTime),
    minTime: Math.round(minTime),
    maxTime: Math.round(maxTime),
    avgSize: Math.round(avgSize),
    avgSizeFormatted: formatBytes(avgSize),
    times,
    sizes
  };
  
  console.log(`   ✅ 平均时间: ${result.avgTime}ms, 平均大小: ${result.avgSizeFormatted}`);
  
  return result;
}

// 运行所有基准测试
export async function runAllBenchmarks() {
  console.log('🚀 开始 ESBuild 性能基准测试\n');
  
  // 确保输出目录存在
  const benchmarkDir = 'dist/benchmark';
  if (!fs.existsSync(benchmarkDir)) {
    fs.mkdirSync(benchmarkDir, { recursive: true });
  }
  
  // 运行所有测试
  for (const [key, config] of Object.entries(benchmarkConfigs)) {
    const result = await runBenchmark(key, config);
    if (result) {
      results.push(result);
    }
    console.log(''); // 空行分隔
  }
  
  // 显示结果汇总
  displayResults();
  
  // 生成报告
  generateReport();
  
  console.log('\n✅ 基准测试完成！');
}

// 显示测试结果
function displayResults() {
  console.log('📊 基准测试结果汇总');
  console.log('=' .repeat(80));
  console.log(`${'配置'.padEnd(25)} ${'平均时间'.padEnd(12)} ${'最小时间'.padEnd(12)} ${'最大时间'.padEnd(12)} ${'文件大小'.padEnd(12)}`);
  console.log('-'.repeat(80));
  
  // 按平均时间排序
  const sortedResults = [...results].sort((a, b) => a.avgTime - b.avgTime);
  
  sortedResults.forEach(result => {
    console.log(
      `${result.name.padEnd(25)} ` +
      `${(result.avgTime + 'ms').padEnd(12)} ` +
      `${(result.minTime + 'ms').padEnd(12)} ` +
      `${(result.maxTime + 'ms').padEnd(12)} ` +
      `${result.avgSizeFormatted.padEnd(12)}`
    );
  });
  
  console.log('=' .repeat(80));
  
  // 显示性能对比
  if (results.length > 1) {
    const fastest = sortedResults[0];
    console.log(`\n🏆 最快配置: ${fastest.name} (${fastest.avgTime}ms)`);
    
    console.log('\n📈 性能对比 (相对于最快配置):');
    sortedResults.forEach(result => {
      const ratio = (result.avgTime / fastest.avgTime).toFixed(2);
      const indicator = ratio > 2 ? '🐌' : ratio > 1.5 ? '⚠️' : '⚡';
      console.log(`   ${indicator} ${result.name}: ${ratio}x`);
    });
  }
}

// 生成详细报告
function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cpus: os.cpus().length
    },
    results,
    summary: {
      totalTests: results.length,
      fastestConfig: results.length > 0 ? results.reduce((fastest, current) => 
        current.avgTime < fastest.avgTime ? current : fastest
      ) : null,
      averageTime: results.length > 0 ? 
        Math.round(results.reduce((sum, r) => sum + r.avgTime, 0) / results.length) : 0
    }
  };
  
  const reportPath = 'dist/benchmark/performance-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📋 详细报告已生成: ${reportPath}`);
}

// 创建性能对比图表数据
function generateChartData() {
  const chartData = {
    labels: results.map(r => r.name),
    datasets: [
      {
        label: '构建时间 (ms)',
        data: results.map(r => r.avgTime),
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1
      },
      {
        label: '文件大小 (KB)',
        data: results.map(r => Math.round(r.avgSize / 1024)),
        backgroundColor: 'rgba(46, 204, 113, 0.7)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 1
      }
    ]
  };
  
  const chartPath = 'dist/benchmark/chart-data.json';
  fs.writeFileSync(chartPath, JSON.stringify(chartData, null, 2));
  console.log(`📈 图表数据已生成: ${chartPath}`);
}

// 模拟与其他工具的对比
export function compareWithOtherTools() {
  console.log('\n🔍 与其他构建工具的性能对比');
  console.log('(基于社区基准测试数据)');
  console.log('=' .repeat(60));
  
  const toolComparison = [
    { name: 'ESBuild', time: '~50ms', speed: '⚡⚡⚡⚡⚡' },
    { name: 'SWC', time: '~200ms', speed: '⚡⚡⚡⚡' },
    { name: 'Rollup', time: '~1000ms', speed: '⚡⚡⚡' },
    { name: 'Webpack', time: '~5000ms', speed: '⚡⚡' },
    { name: 'Parcel', time: '~8000ms', speed: '⚡' }
  ];
  
  console.log(`${'工具'.padEnd(15)} ${'构建时间'.padEnd(15)} ${'速度'.padEnd(15)}`);
  console.log('-'.repeat(60));
  
  toolComparison.forEach(tool => {
    console.log(`${tool.name.padEnd(15)} ${tool.time.padEnd(15)} ${tool.speed}`);
  });
  
  console.log('\n💡 说明:');
  console.log('   • 数据基于中等复杂度项目的平均构建时间');
  console.log('   • ESBuild 通常比 Webpack 快 10-100 倍');
  console.log('   • 实际性能取决于项目复杂度和配置');
  console.log('   • ESBuild 的速度优势在大型项目中更明显');
}

// 工具函数
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await runAllBenchmarks();
    generateChartData();
    compareWithOtherTools();
  })();
}
