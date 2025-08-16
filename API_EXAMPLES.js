// ESBuild API 调用详解与示例
// 展示 ESBuild 的各种 API 使用方式

import * as esbuild from 'esbuild';
const { 
  build,           // 构建 API
  buildSync,       // 同步构建
  serve,           // 开发服务器
  transform,       // 代码转换
  transformSync,   // 同步转换
  analyzeMetafile, // 分析构建结果
  formatMessages   // 格式化错误信息
} = esbuild;
import fs from 'fs';

// =============================================================================
// 1. 基础构建 API (build)
// =============================================================================

console.log('🚀 ESBuild API 调用示例');

// 1.1 异步构建 (推荐)
async function basicBuild() {
  console.log('\n📦 1. 基础异步构建');
  
  try {
    const result = await build({
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: 'dist/api-examples/basic.js',
      format: 'iife',
      globalName: 'MyApp',
      
      // 获取构建信息
      metafile: true,
      write: true,
      
      // 日志控制
      logLevel: 'info'
    });
    
    console.log('✅ 构建成功');
    console.log('- 输出文件:', Object.keys(result.metafile.outputs));
    console.log('- 输入文件:', Object.keys(result.metafile.inputs));
    
    return result;
    
  } catch (error) {
    console.error('❌ 构建失败:', error);
    throw error;
  }
}

// 1.2 同步构建 (谨慎使用)
function syncBuild() {
  console.log('\n📦 2. 同步构建 (阻塞)');
  
  try {
    const result = buildSync({
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: 'dist/api-examples/sync.js',
      format: 'cjs',
      platform: 'node'
    });
    
    console.log('✅ 同步构建完成');
    return result;
    
  } catch (error) {
    console.error('❌ 同步构建失败:', error);
    throw error;
  }
}

// =============================================================================
// 2. 代码转换 API (transform)
// =============================================================================

// 2.1 异步转换
async function transformCode() {
  console.log('\n🔄 3. 代码转换 API');
  
  const sourceCode = `
    // TypeScript + JSX 代码
    interface Props {
      name: string;
      age?: number;
    }
    
    const Component: React.FC<Props> = ({ name, age = 18 }) => {
      return <div>Hello {name}, age: {age}</div>;
    };
    
    export default Component;
  `;
  
  try {
    const result = await transform(sourceCode, {
      loader: 'tsx',           // 指定文件类型
      target: 'es2020',        // 目标版本
      jsx: 'automatic',        // JSX 处理方式
      jsxImportSource: 'react',
      format: 'esm',           // 输出格式
      sourcemap: true,         // 生成 sourcemap
      minify: false            // 不压缩，便于查看
    });
    
    console.log('✅ 转换成功');
    console.log('转换后的代码:');
    console.log(result.code);
    
    if (result.map) {
      console.log('📍 Source Map 已生成');
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ 转换失败:', error);
    throw error;
  }
}

// 2.2 同步转换
function transformSync() {
  console.log('\n🔄 4. 同步代码转换');
  
  const jsxCode = `
    const App = () => {
      const [count, setCount] = useState(0);
      return (
        <div>
          <h1>Count: {count}</h1>
          <button onClick={() => setCount(count + 1)}>+1</button>
        </div>
      );
    };
  `;
  
  try {
    const result = transformSync(jsxCode, {
      loader: 'jsx',
      jsx: 'transform',        // 传统 JSX 转换
      jsxFactory: 'React.createElement',
      target: 'es5'           // 兼容老浏览器
    });
    
    console.log('✅ 同步转换完成');
    console.log('转换结果:', result.code);
    
    return result;
    
  } catch (error) {
    console.error('❌ 同步转换失败:', error);
    throw error;
  }
}

// =============================================================================
// 3. 开发服务器 API (serve)
// =============================================================================

async function startDevServer() {
  console.log('\n🌐 5. 开发服务器');
  
  try {
    // 启动开发服务器
    const serverResult = await serve({
      port: 8080,
      host: 'localhost',
      servedir: 'dist/api-examples',  // 静态文件目录
      
      // 可选的 fallback
      fallback: 'index.html'
    }, {
      // 构建配置
      entryPoints: ['src/index.js'],
      bundle: true,
      outdir: 'dist/api-examples',
      format: 'esm',
      splitting: true,
      
      // 开发模式设置
      sourcemap: 'inline',
      minify: false,
      keepNames: true,
      
      // 监听文件变化
      watch: {
        onRebuild(error, result) {
          if (error) {
            console.error('💥 重建失败:', error);
          } else {
            console.log('🔄 文件已重建');
          }
        }
      }
    });
    
    console.log('✅ 开发服务器启动成功');
    console.log(`🌐 服务地址: http://${serverResult.host}:${serverResult.port}`);
    
    // 返回服务器控制对象
    return serverResult;
    
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    throw error;
  }
}

// =============================================================================
// 4. 监听模式 (Watch Mode)
// =============================================================================

async function watchMode() {
  console.log('\n👀 6. 监听模式');
  
  try {
    const ctx = await build({
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: 'dist/api-examples/watch.js',
      sourcemap: true,
      
      // 监听配置
      watch: {
        onRebuild(error, result) {
          console.log('📝 文件变化检测到');
          
          if (error) {
            console.error('❌ 重建失败:', error);
          } else {
            console.log('✅ 重建成功');
            
            if (result.metafile) {
              const outputFiles = Object.keys(result.metafile.outputs);
              console.log('📄 输出文件:', outputFiles);
            }
          }
        }
      }
    });
    
    console.log('✅ 监听模式已启动');
    console.log('📁 正在监听文件变化...');
    
    // 返回上下文对象，可用于停止监听
    return ctx;
    
  } catch (error) {
    console.error('❌ 监听模式启动失败:', error);
    throw error;
  }
}

// =============================================================================
// 5. 构建上下文 API (Context)
// =============================================================================

async function contextAPI() {
  console.log('\n🎯 7. 构建上下文 API');
  
  try {
    // 创建构建上下文
    const ctx = await build({
      entryPoints: ['src/index.js'],
      bundle: true,
      outdir: 'dist/api-examples/context',
      format: 'esm',
      metafile: true,
      write: false,  // 不写入文件，仅获取结果
    });
    
    console.log('✅ 上下文创建成功');
    
    // 手动触发构建
    const result = await ctx.rebuild();
    console.log('🔄 手动构建完成');
    
    // 分析构建结果
    if (result.metafile) {
      const analysis = await analyzeMetafile(result.metafile, {
        verbose: true
      });
      console.log('📊 构建分析:');
      console.log(analysis);
    }
    
    // 清理上下文
    ctx.dispose();
    console.log('🧹 上下文已清理');
    
    return result;
    
  } catch (error) {
    console.error('❌ 上下文操作失败:', error);
    throw error;
  }
}

// =============================================================================
// 6. 高级配置示例
// =============================================================================

async function advancedBuild() {
  console.log('\n🚀 8. 高级构建配置');
  
  try {
    const result = await build({
      // 多入口点
      entryPoints: {
        'main': 'src/index.js',
        'worker': 'src/worker.js',
        'admin': 'src/admin.js'
      },
      
      // 输出配置
      outdir: 'dist/api-examples/advanced',
      format: 'esm',
      splitting: true,
      chunkNames: 'chunks/[name]-[hash]',
      assetNames: 'assets/[name]-[hash]',
      
      // 优化配置
      bundle: true,
      minify: true,
      treeShaking: true,
      sourcemap: 'external',
      
      // 目标环境
      target: ['es2020', 'chrome90', 'firefox88'],
      platform: 'browser',
      
      // 文件处理
      loader: {
        '.png': 'file',
        '.svg': 'dataurl',
        '.css': 'css',
        '.txt': 'text'
      },
      
      // 路径解析
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.css'],
      
      // 外部依赖
      external: ['react', 'react-dom'],
      
      // 环境变量替换
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.API_URL': '"https://api.example.com"',
        'VERSION': '"1.0.0"',
        'DEBUG': 'false'
      },
      
      // 插件 (如果有)
      plugins: [
        // 自定义插件示例
        {
          name: 'example-plugin',
          setup(build) {
            build.onStart(() => {
              console.log('🔌 插件: 构建开始');
            });
            
            build.onEnd((result) => {
              console.log('🔌 插件: 构建结束');
              if (result.errors.length > 0) {
                console.error('🔌 插件: 发现错误', result.errors);
              }
            });
          }
        }
      ],
      
      // 其他选项
      charset: 'utf8',
      keepNames: false,
      metafile: true,
      write: true,
      logLevel: 'info',
      color: true
    });
    
    console.log('✅ 高级构建完成');
    
    // 分析构建结果
    if (result.metafile) {
      const totalSize = Object.values(result.metafile.outputs)
        .reduce((sum, output) => sum + output.bytes, 0);
      
      console.log('📊 构建统计:');
      console.log(`- 总大小: ${formatBytes(totalSize)}`);
      console.log(`- 文件数量: ${Object.keys(result.metafile.outputs).length}`);
      
      // 生成详细分析
      const analysis = await analyzeMetafile(result.metafile);
      fs.writeFileSync('dist/api-examples/build-analysis.txt', analysis);
      console.log('📋 详细分析已保存到 build-analysis.txt');
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ 高级构建失败:', error);
    
    // 格式化错误信息
    if (error.errors) {
      const formatted = await formatMessages(error.errors, {
        kind: 'error',
        color: true,
        terminalWidth: 80
      });
      console.log('格式化错误信息:');
      console.log(formatted.join('\n'));
    }
    
    throw error;
  }
}

// =============================================================================
// 7. 批量构建与并行处理
// =============================================================================

async function batchBuild() {
  console.log('\n⚡ 9. 批量构建');
  
  const configs = [
    {
      name: '开发版本',
      config: {
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/api-examples/batch-dev.js',
        sourcemap: true,
        minify: false
      }
    },
    {
      name: '生产版本',
      config: {
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/api-examples/batch-prod.js',
        sourcemap: false,
        minify: true
      }
    },
    {
      name: 'Node.js 版本',
      config: {
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist/api-examples/batch-node.js',
        platform: 'node',
        format: 'cjs'
      }
    }
  ];
  
  try {
    console.log('🚀 开始批量构建...');
    
    // 并行构建
    const results = await Promise.all(
      configs.map(async ({ name, config }) => {
        console.log(`📦 构建 ${name}...`);
        const result = await build(config);
        console.log(`✅ ${name} 构建完成`);
        return { name, result };
      })
    );
    
    console.log('\n📊 批量构建结果:');
    results.forEach(({ name, result }) => {
      console.log(`- ${name}: 成功`);
    });
    
    return results;
    
  } catch (error) {
    console.error('❌ 批量构建失败:', error);
    throw error;
  }
}

// =============================================================================
// 8. 错误处理与调试
// =============================================================================

async function errorHandling() {
  console.log('\n🐛 10. 错误处理示例');
  
  try {
    // 故意使用错误的配置
    const result = await build({
      entryPoints: ['non-existent-file.js'],  // 不存在的文件
      bundle: true,
      outfile: 'dist/api-examples/error-test.js'
    });
    
  } catch (error) {
    console.log('✅ 成功捕获构建错误');
    
    // 检查错误类型
    if (error.errors && error.errors.length > 0) {
      console.log('📋 构建错误列表:');
      
      // 格式化错误信息
      const formattedErrors = await formatMessages(error.errors, {
        kind: 'error',
        color: true,
        terminalWidth: 100
      });
      
      formattedErrors.forEach((msg, index) => {
        console.log(`错误 ${index + 1}:`);
        console.log(msg);
      });
    }
    
    // 检查警告
    if (error.warnings && error.warnings.length > 0) {
      console.log('⚠️ 构建警告列表:');
      
      const formattedWarnings = await formatMessages(error.warnings, {
        kind: 'warning',
        color: true,
        terminalWidth: 100
      });
      
      formattedWarnings.forEach((msg, index) => {
        console.log(`警告 ${index + 1}:`);
        console.log(msg);
      });
    }
  }
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

// 确保输出目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// =============================================================================
// 主执行函数
// =============================================================================

async function runAllExamples() {
  console.log('🎯 ESBuild API 完整示例演示\n');
  
  // 确保输出目录存在
  ensureDir('dist/api-examples');
  
  try {
    // 1. 基础构建
    await basicBuild();
    
    // 2. 同步构建
    syncBuild();
    
    // 3. 代码转换
    await transformCode();
    
    // 4. 同步转换
    transformSync();
    
    // 5. 上下文 API
    await contextAPI();
    
    // 6. 高级构建
    await advancedBuild();
    
    // 7. 批量构建
    await batchBuild();
    
    // 8. 错误处理
    await errorHandling();
    
    console.log('\n🎉 所有 API 示例演示完成！');
    
    // 注意: 开发服务器和监听模式会持续运行
    // 在实际使用中需要适当的生命周期管理
    
  } catch (error) {
    console.error('💥 示例执行失败:', error);
  }
}

// =============================================================================
// 独立功能演示
// =============================================================================

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'basic':
      basicBuild();
      break;
    case 'transform':
      transformCode();
      break;
    case 'serve':
      startDevServer()
        .then(server => {
          console.log('按 Ctrl+C 停止服务器');
        });
      break;
    case 'watch':
      watchMode()
        .then(ctx => {
          console.log('按 Ctrl+C 停止监听');
          
          // 优雅退出
          process.on('SIGINT', () => {
            console.log('\n🛑 停止监听...');
            ctx.dispose();
            process.exit(0);
          });
        });
      break;
    case 'advanced':
      advancedBuild();
      break;
    case 'batch':
      batchBuild();
      break;
    case 'error':
      errorHandling();
      break;
    case 'all':
    default:
      runAllExamples();
      break;
  }
}

// 导出所有示例函数
export {
  basicBuild,
  syncBuild,
  transformCode,
  transformSync,
  startDevServer,
  watchMode,
  contextAPI,
  advancedBuild,
  batchBuild,
  errorHandling,
  runAllExamples
};
