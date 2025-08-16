// ESBuild 文件大小分析插件
// 分析打包文件大小并生成报告

import fs from 'fs';
import path from 'path';

export function fileSizePlugin(options = {}) {
  return {
    name: 'file-size-plugin',
    setup(build) {
      const {
        reportPath = 'build-report.json',
        logToConsole = true,
        threshold = 100 * 1024, // 100KB 阈值
      } = options;
      
      build.onEnd((result) => {
        if (!result.metafile) {
          console.warn('⚠️ 文件大小插件：需要启用 metafile 选项');
          return;
        }
        
        const analysis = analyzeBundle(result.metafile);
        
        if (logToConsole) {
          logBundleAnalysis(analysis, threshold);
        }
        
        // 生成报告文件
        if (reportPath) {
          const report = {
            timestamp: new Date().toISOString(),
            analysis,
            metafile: result.metafile
          };
          
          fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
          console.log(`📊 文件大小报告已生成：${reportPath}`);
        }
      });
    }
  };
}

function analyzeBundle(metafile) {
  const outputs = metafile.outputs;
  const inputs = metafile.inputs;
  
  // 分析输出文件
  const outputAnalysis = Object.entries(outputs).map(([file, info]) => ({
    file: file.replace(/^dist\//, ''),
    size: info.bytes,
    sizeFormatted: formatBytes(info.bytes),
    type: getFileType(file)
  })).sort((a, b) => b.size - a.size);
  
  // 分析输入文件
  const inputAnalysis = Object.entries(inputs).map(([file, info]) => ({
    file,
    size: info.bytes,
    sizeFormatted: formatBytes(info.bytes),
    type: getFileType(file)
  })).sort((a, b) => b.size - a.size);
  
  // 统计信息
  const stats = {
    totalOutputSize: outputAnalysis.reduce((sum, file) => sum + file.size, 0),
    totalInputSize: inputAnalysis.reduce((sum, file) => sum + file.size, 0),
    outputCount: outputAnalysis.length,
    inputCount: inputAnalysis.length,
    compressionRatio: 0
  };
  
  stats.compressionRatio = stats.totalInputSize > 0 
    ? (1 - stats.totalOutputSize / stats.totalInputSize) * 100 
    : 0;
  
  return {
    outputs: outputAnalysis,
    inputs: inputAnalysis,
    stats
  };
}

function logBundleAnalysis(analysis, threshold) {
  console.log('\n📦 打包分析报告');
  console.log('================');
  
  // 输出统计
  console.log(`📊 总体统计:`);
  console.log(`   输入文件：${analysis.stats.inputCount} 个 (${formatBytes(analysis.stats.totalInputSize)})`);
  console.log(`   输出文件：${analysis.stats.outputCount} 个 (${formatBytes(analysis.stats.totalOutputSize)})`);
  console.log(`   压缩比例：${analysis.stats.compressionRatio.toFixed(1)}%`);
  
  // 输出文件详情
  console.log(`\n📁 输出文件详情:`);
  analysis.outputs.forEach(file => {
    const sizeIndicator = file.size > threshold ? '⚠️ ' : '✅ ';
    console.log(`   ${sizeIndicator}${file.file} (${file.sizeFormatted})`);
  });
  
  // 大文件警告
  const largeFiles = analysis.outputs.filter(file => file.size > threshold);
  if (largeFiles.length > 0) {
    console.log(`\n⚠️ 大文件警告 (>${formatBytes(threshold)}):`);
    largeFiles.forEach(file => {
      console.log(`   ${file.file}: ${file.sizeFormatted}`);
    });
  }
  
  console.log('================\n');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileType(file) {
  const ext = path.extname(file).toLowerCase();
  const typeMap = {
    '.js': 'JavaScript',
    '.css': 'CSS',
    '.html': 'HTML',
    '.ts': 'TypeScript',
    '.jsx': 'JSX',
    '.tsx': 'TSX',
    '.json': 'JSON',
    '.png': 'Image',
    '.jpg': 'Image',
    '.jpeg': 'Image',
    '.gif': 'Image',
    '.svg': 'SVG',
    '.woff': 'Font',
    '.woff2': 'Font',
    '.ttf': 'Font',
    '.eot': 'Font'
  };
  
  return typeMap[ext] || 'Other';
}
