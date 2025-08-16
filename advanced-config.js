// ESBuild 高级配置示例
// 展示生产环境优化和高级特性

import { build } from 'esbuild';
import { fileSizePlugin } from './plugins/file-size-plugin.js';

// 生产环境配置
export const productionConfig = {
  entryPoints: {
    'main': 'src/index.js',
    'react': 'src/react-app.jsx',
    'app': 'src/app.ts'
  },
  
  // 输出配置
  outdir: 'dist/production',
  format: 'esm',
  platform: 'browser',
  target: ['es2020', 'chrome80', 'firefox80', 'safari14'],
  
  // 优化选项
  bundle: true,
  minify: true,
  treeShaking: true,
  splitting: true,      // 代码分割
  chunkNames: 'chunks/[name]-[hash]',
  assetNames: 'assets/[name]-[hash]',
  
  // Source map
  sourcemap: 'external',
  sourcesContent: false,
  
  // 代码转换
  jsx: 'automatic',
  jsxImportSource: 'react',
  
  // 路径解析
  resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.json'],
  conditions: ['import', 'module', 'browser', 'default'],
  mainFields: ['browser', 'module', 'main'],
  
  // 外部依赖（不打包的库）
  external: [],
  
  // 文件加载器
  loader: {
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.gif': 'file',
    '.svg': 'dataurl',
    '.woff': 'file',
    '.woff2': 'file',
    '.ttf': 'file',
    '.eot': 'file'
  },
  
  // 定义替换
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.BUILD_TYPE': '"production"',
    'DEBUG': 'false',
    'VERSION': '"1.0.0"'
  },
  
  // 压缩选项
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  
  // 其他选项
  charset: 'utf8',
  tsconfigRaw: {
    compilerOptions: {
      useDefineForClassFields: false,
    }
  },
  
  // 插件
  plugins: [
    fileSizePlugin({
      reportPath: 'dist/production/build-report.json',
      threshold: 200 * 1024 // 200KB
    })
  ],
  
  // 性能预算
  metafile: true,
  write: true,
  
  // 日志配置
  logLevel: 'info',
  color: true
};

// 开发环境配置
export const developmentConfig = {
  ...productionConfig,
  
  // 开发特定设置
  outdir: 'dist/development',
  minify: false,
  splitting: false,
  sourcemap: 'inline',
  sourcesContent: true,
  keepNames: true,
  
  // 开发优化
  treeShaking: false,
  
  define: {
    'process.env.NODE_ENV': '"development"',
    'process.env.BUILD_TYPE': '"development"',
    'DEBUG': 'true',
    'VERSION': '"1.0.0-dev"'
  },
  
  // 开发日志
  logLevel: 'debug'
};

// Node.js 环境配置
export const nodeConfig = {
  entryPoints: ['src/app.ts'],
  outfile: 'dist/node/app.js',
  platform: 'node',
  format: 'esm',
  target: 'node18',
  
  bundle: true,
  minify: false,
  sourcemap: true,
  
  // Node.js 外部模块
  external: [
    'fs',
    'path', 
    'crypto',
    'util',
    'events',
    'stream',
    'buffer',
    'url',
    'querystring'
  ],
  
  // Node.js 特定设置
  conditions: ['node', 'import'],
  mainFields: ['module', 'main'],
  
  define: {
    'process.env.NODE_ENV': '"production"',
    'global': 'globalThis'
  }
};

// 库打包配置
export const libraryConfig = {
  entryPoints: ['src/utils/math.js'],
  outdir: 'dist/lib',
  
  // 多格式输出
  format: 'esm',
  
  bundle: true,
  minify: true,
  sourcemap: true,
  
  // 库特定设置
  globalName: 'ESBuildUtils',
  
  // 外部化所有依赖
  external: ['*'],
  
  // 保持导出名称
  keepNames: true,
  
  target: ['es2020', 'node14']
};

// 构建函数
export async function buildProduction() {
  console.log('🏗️ 开始生产环境构建...');
  const startTime = Date.now();
  
  try {
    const result = await build(productionConfig);
    const buildTime = Date.now() - startTime;
    
    console.log(`✅ 生产构建完成！耗时: ${buildTime}ms`);
    
    if (result.metafile) {
      analyzeBundle(result.metafile, 'production');
    }
    
    return result;
  } catch (error) {
    console.error('❌ 生产构建失败:', error);
    throw error;
  }
}

export async function buildDevelopment() {
  console.log('🔧 开始开发环境构建...');
  const startTime = Date.now();
  
  try {
    const result = await build(developmentConfig);
    const buildTime = Date.now() - startTime;
    
    console.log(`✅ 开发构建完成！耗时: ${buildTime}ms`);
    
    return result;
  } catch (error) {
    console.error('❌ 开发构建失败:', error);
    throw error;
  }
}

export async function buildNode() {
  console.log('🟢 开始 Node.js 构建...');
  const startTime = Date.now();
  
  try {
    const result = await build(nodeConfig);
    const buildTime = Date.now() - startTime;
    
    console.log(`✅ Node.js 构建完成！耗时: ${buildTime}ms`);
    
    return result;
  } catch (error) {
    console.error('❌ Node.js 构建失败:', error);
    throw error;
  }
}

export async function buildLibrary() {
  console.log('📚 开始库构建...');
  const startTime = Date.now();
  
  try {
    const result = await build(libraryConfig);
    const buildTime = Date.now() - startTime;
    
    console.log(`✅ 库构建完成！耗时: ${buildTime}ms`);
    
    return result;
  } catch (error) {
    console.error('❌ 库构建失败:', error);
    throw error;
  }
}

// 批量构建
export async function buildAll() {
  console.log('🚀 开始批量构建...\n');
  
  const results = [];
  
  try {
    results.push({
      name: 'Production',
      result: await buildProduction()
    });
    
    results.push({
      name: 'Development', 
      result: await buildDevelopment()
    });
    
    results.push({
      name: 'Node.js',
      result: await buildNode()
    });
    
    results.push({
      name: 'Library',
      result: await buildLibrary()
    });
    
    console.log('\n📊 构建汇总:');
    results.forEach(({ name, result }) => {
      if (result.metafile) {
        const outputs = Object.keys(result.metafile.outputs);
        console.log(`   ${name}: ${outputs.length} 个文件`);
      }
    });
    
    console.log('\n✅ 所有构建完成！');
    
  } catch (error) {
    console.error('❌ 批量构建失败:', error);
    throw error;
  }
}

// 构建分析
function analyzeBundle(metafile, env) {
  const outputs = metafile.outputs;
  const totalSize = Object.values(outputs).reduce((sum, output) => sum + output.bytes, 0);
  
  console.log(`\n📈 ${env} 构建分析:`);
  console.log(`   总大小: ${formatBytes(totalSize)}`);
  console.log(`   文件数: ${Object.keys(outputs).length}`);
  
  // 显示最大的几个文件
  const sortedOutputs = Object.entries(outputs)
    .map(([file, info]) => ({ file, size: info.bytes }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 3);
  
  console.log('   最大文件:');
  sortedOutputs.forEach(({ file, size }) => {
    console.log(`     ${file.replace(/^dist\/[^/]+\//, '')}: ${formatBytes(size)}`);
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2] || 'all';
  
  switch (command) {
    case 'prod':
    case 'production':
      buildProduction();
      break;
    case 'dev':
    case 'development':
      buildDevelopment();
      break;
    case 'node':
      buildNode();
      break;
    case 'lib':
    case 'library':
      buildLibrary();
      break;
    case 'all':
    default:
      buildAll();
      break;
  }
}
