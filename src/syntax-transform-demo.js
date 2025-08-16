// 语法转换演示主文件
import { demonstrateFeatures } from './es6-features.js';

// 创建页面展示转换效果
async function createDemo() {
  const container = document.createElement('div');
  container.style.cssText = `
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    color: white;
    border-radius: 12px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  `;
  
  container.innerHTML = `
    <h1 style="text-align: center; margin-bottom: 30px;">
      📦 ESBuild 语法转换演示
    </h1>
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2>🎯 演示内容</h2>
      <ul style="line-height: 1.8;">
        <li>ES6+ 类和继承语法</li>
        <li>解构赋值和展开运算符</li>
        <li>模板字符串和标签模板</li>
        <li>Promise 和 async/await</li>
        <li>生成器函数</li>
        <li>Map、Set 数据结构</li>
        <li>默认参数和剩余参数</li>
        <li>对象属性简写</li>
        <li>可选链和空值合并</li>
        <li>私有字段语法</li>
      </ul>
    </div>
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
      <h2>🔧 构建对比</h2>
      <p>使用以下命令查看不同目标环境的构建结果：</p>
      <pre style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; overflow-x: auto;">
# 现代浏览器 (ES2020)
npx esbuild src/syntax-transform-demo.js --bundle --target=es2020 --outfile=dist/modern.js

# 兼容浏览器 (ES5)
npx esbuild src/syntax-transform-demo.js --bundle --target=es5 --outfile=dist/legacy.js

# Node.js 环境
npx esbuild src/syntax-transform-demo.js --bundle --target=node14 --outfile=dist/node.js
      </pre>
    </div>
    <div id="output" style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-top: 20px;">
      <h2>📊 执行结果</h2>
      <p>正在执行 ES6+ 特性演示...</p>
    </div>
  `;
  
  document.body.appendChild(container);
  
  // 执行特性演示
  try {
    const result = await demonstrateFeatures();
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = `
      <h2>📊 执行结果</h2>
      <p style="color: #00ff88; font-weight: bold;">✅ ${result}</p>
      <p>请打开浏览器控制台查看详细输出</p>
      <p style="margin-top: 15px; font-style: italic;">
        💡 提示: 查看 dist/ 目录下的不同构建版本，比较语法转换效果
      </p>
    `;
  } catch (error) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = `
      <h2>📊 执行结果</h2>
      <p style="color: #ff6b6b; font-weight: bold;">❌ 执行出错: ${error.message}</p>
    `;
  }
}

// 页面加载完成后启动演示
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createDemo);
} else {
  createDemo();
}
