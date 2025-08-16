// ESBuild 配置文件示例
// 这个文件展示了 ESBuild 的各种配置选项

import { build } from 'esbuild';

// 基础配置
const baseConfig = {
  entryPoints: ['src/index.js'],
  bundle: true,
  outdir: 'dist',
  platform: 'browser', // 'browser' | 'node' | 'neutral'
  format: 'iife',      // 'iife' | 'cjs' | 'esm'
  target: 'es2020',    // 目标环境
  sourcemap: true,     // 生成 source map
  splitting: false,    // 代码分割 (仅在 format: 'esm' 时有效)
  
  // 文件处理
  loader: {
    '.png': 'file',    // 图片文件处理
    '.svg': 'text',    // SVG 作为文本导入
    '.css': 'css',     // CSS 文件处理
  },
  
  // 代码转换选项
  minify: false,       // 代码压缩
  keepNames: true,     // 保持函数和类名
  treeShaking: true,   // 树摇（默认开启）
  
  // 路径解析
  resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.json'],
  
  // 外部依赖（不打包的模块）
  external: [],
  
  // 替换变量
  define: {
    'process.env.NODE_ENV': '"development"',
    'VERSION': '"1.0.0"'
  },
  
  // 输出选项
  outExtension: {
    '.js': '.js'
  },
  
  // 监听选项
  watch: false,
  
  // 元信息
  metafile: true,      // 生成构建元信息
  write: true,         // 写入文件系统
  
  // 日志级别
  logLevel: 'info',    // 'silent' | 'error' | 'warning' | 'info' | 'debug' | 'verbose'
};

// 不同环境的配置
export const configs = {
  // 开发环境
  development: {
    ...baseConfig,
    sourcemap: true,
    minify: false,
    define: {
      ...baseConfig.define,
      'process.env.NODE_ENV': '"development"'
    }
  },
  
  // 生产环境
  production: {
    ...baseConfig,
    sourcemap: false,
    minify: true,
    treeShaking: true,
    define: {
      ...baseConfig.define,
      'process.env.NODE_ENV': '"production"'
    }
  },
  
  // Node.js 环境
  node: {
    ...baseConfig,
    platform: 'node',
    format: 'cjs',
    target: 'node14',
    external: ['fs', 'path', 'crypto'], // Node.js 内置模块
  },
  
  // 现代 ESM 格式
  esm: {
    ...baseConfig,
    format: 'esm',
    splitting: true,
    outdir: 'dist/esm',
    target: 'es2020'
  }
};

// 构建函数
export async function buildProject(env = 'development') {
  const config = configs[env];
  
  if (!config) {
    throw new Error(`未知环境: ${env}`);
  }
  
  try {
    console.log(`🚀 开始构建 (${env} 环境)...`);
    
    const result = await build(config);
    
    if (config.metafile) {
      // 输出构建信息
      console.log('📊 构建统计:');
      console.log(`- 输入文件: ${Object.keys(result.metafile.inputs).length} 个`);
      console.log(`- 输出文件: ${Object.keys(result.metafile.outputs).length} 个`);
      
      // 计算总大小
      const totalSize = Object.values(result.metafile.outputs)
        .reduce((sum, output) => sum + output.bytes, 0);
      console.log(`- 总大小: ${(totalSize / 1024).toFixed(2)} KB`);
    }
    
    console.log('✅ 构建完成!');
    return result;
    
  } catch (error) {
    console.error('❌ 构建失败:', error);
    throw error;
  }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  const env = process.argv[2] || 'development';
  buildProject(env);
}
