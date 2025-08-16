// ESBuild 开发服务器演示
// 展示热重载和开发时的实时构建

import { context } from 'esbuild';
import { bannerPlugin } from './plugins/banner-plugin.js';
import { envPlugin } from './plugins/env-plugin.js';

async function startDevServer() {
  try {
    // 创建构建上下文
    const ctx = await context({
      entryPoints: ['src/index.js'],
      bundle: true,
      outdir: 'dist',
      format: 'iife',
      platform: 'browser',
      target: 'es2020',
      sourcemap: true,
      
      // 开发环境优化
      minify: false,
      keepNames: true,
      
      // 插件
      plugins: [
        bannerPlugin({
          banner: '// 🔥 ESBuild 开发服务器',
          includeTimestamp: true
        }),
        envPlugin({
          customVars: {
            'DEV_MODE': true,
            'HOT_RELOAD': true
          }
        })
      ],
      
      // 定义开发环境变量
      define: {
        'process.env.NODE_ENV': '"development"',
        'DEBUG': 'true'
      }
    });
    
    console.log('🚀 启动 ESBuild 开发服务器...');
    
    // 启动开发服务器
    const { host, port } = await ctx.serve({
      servedir: '.', // 服务根目录
      port: 3000,    // 端口
      host: 'localhost'
    });
    
    console.log(`\n✅ 开发服务器已启动！`);
    console.log(`🌐 本地访问: http://${host}:${port}`);
    console.log(`📁 服务目录: ${process.cwd()}`);
    console.log('\n📋 可用页面:');
    console.log(`   • 基础示例: http://${host}:${port}/index.html`);
    console.log(`   • React 示例: http://${host}:${port}/react.html`);
    console.log(`   • CSS 示例: http://${host}:${port}/css-demo.html`);
    console.log('\n💡 提示: 修改源文件会自动重新构建');
    console.log('按 Ctrl+C 停止服务器\n');
    
    // 启用监听模式进行自动重构建
    await ctx.watch();
    
    // 处理退出信号
    process.on('SIGINT', async () => {
      console.log('\n🛑 正在停止开发服务器...');
      await ctx.dispose();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('\n🛑 正在停止开发服务器...');
      await ctx.dispose();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ 启动开发服务器失败:', error);
    process.exit(1);
  }
}

// 创建更高级的开发服务器配置
export async function createAdvancedDevServer(options = {}) {
  const {
    port = 3000,
    host = 'localhost',
    open = false,
    proxy = {},
    cors = true
  } = options;
  
  try {
    const ctx = await context({
      entryPoints: {
        'main': 'src/index.js',
        'react': 'src/react-app.jsx',
        'css-demo': 'src/css-demo.js',
        'syntax': 'src/syntax-transform-demo.js'
      },
      bundle: true,
      outdir: 'dist',
      format: 'iife',
      platform: 'browser',
      target: 'es2020',
      sourcemap: true,
      splitting: false, // IIFE 格式不支持代码分割
      
      // 开发优化
      minify: false,
      treeShaking: false, // 开发时禁用以加快构建
      
      // 插件
      plugins: [
        bannerPlugin({
          banner: '// 🔥 高级开发服务器',
          includeTimestamp: true
        }),
        envPlugin({
          customVars: {
            'DEV_SERVER': true,
            'SERVER_PORT': port,
            'SERVER_HOST': host
          }
        }),
        
        // 自定义开发插件
        {
          name: 'dev-notifications',
          setup(build) {
            build.onStart(() => {
              console.log('🔄 开始重新构建...');
            });
            
            build.onEnd((result) => {
              if (result.errors.length > 0) {
                console.log('❌ 构建失败:', result.errors.length, '个错误');
              } else {
                console.log('✅ 构建成功!', new Date().toLocaleTimeString());
              }
            });
          }
        }
      ]
    });
    
    // 启动服务器
    const server = await ctx.serve({
      servedir: '.',
      port,
      host
    });
    
    // 启动监听
    await ctx.watch();
    
    console.log(`\n🚀 高级开发服务器已启动！`);
    console.log(`🌐 地址: http://${server.host}:${server.port}`);
    
    // 如果需要，打开浏览器
    if (open) {
      const { exec } = await import('child_process');
      exec(`open http://${server.host}:${server.port}`);
    }
    
    return {
      ctx,
      server,
      stop: async () => {
        await ctx.dispose();
      }
    };
    
  } catch (error) {
    console.error('❌ 创建高级开发服务器失败:', error);
    throw error;
  }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  startDevServer();
}
