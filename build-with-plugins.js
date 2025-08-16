// 使用自定义插件的构建脚本
// 演示 ESBuild 插件系统的使用

import { build } from 'esbuild';
import { bannerPlugin } from './plugins/banner-plugin.js';
import { envPlugin } from './plugins/env-plugin.js';
import { fileSizePlugin } from './plugins/file-size-plugin.js';

// 构建配置
const buildConfig = {
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/bundle-with-plugins.js',
  platform: 'browser',
  format: 'iife',
  target: 'es2020',
  sourcemap: true,
  metafile: true, // 启用元文件以支持文件大小插件
  
  // 使用自定义插件
  plugins: [
    // 横幅插件
    bannerPlugin({
      banner: '// 🚀 ESBuild Learning Project',
      author: 'ESBuild 学习者',
      license: 'MIT',
      includeTimestamp: true,
      includeVersion: true
    }),
    
    // 环境变量插件
    envPlugin({
      prefix: 'DEMO_',
      includeNodeEnv: true,
      includeTimestamp: true,
      customVars: {
        'APP_NAME': 'ESBuild Learning',
        'APP_VERSION': '1.0.0',
        'FEATURE_FLAGS.DARK_MODE': true,
        'FEATURE_FLAGS.ANALYTICS': false
      }
    }),
    
    // 文件大小分析插件
    fileSizePlugin({
      reportPath: 'dist/build-report.json',
      logToConsole: true,
      threshold: 50 * 1024 // 50KB 阈值
    })
  ],
  
  // 定义替换变量
  define: {
    'DEBUG': 'true',
    'VERSION': '"1.0.0"'
  }
};

// 执行构建
async function buildWithPlugins() {
  try {
    console.log('🔌 开始使用插件构建...\n');
    
    const startTime = Date.now();
    const result = await build(buildConfig);
    const buildTime = Date.now() - startTime;
    
    console.log(`✅ 构建完成！耗时: ${buildTime}ms`);
    
    // 如果有警告，显示它们
    if (result.warnings.length > 0) {
      console.log('\n⚠️ 构建警告:');
      result.warnings.forEach(warning => {
        console.log(`   ${warning.text}`);
      });
    }
    
    // 显示构建结果
    if (result.metafile) {
      console.log('\n📁 构建产物:');
      Object.entries(result.metafile.outputs).forEach(([file, info]) => {
        console.log(`   ${file}: ${(info.bytes / 1024).toFixed(2)} KB`);
      });
    }
    
  } catch (error) {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  buildWithPlugins();
}

export { buildWithPlugins, buildConfig };
