// CSS 处理演示
// 展示 ESBuild 如何处理和打包 CSS 文件

// 导入 CSS 文件
import './styles/main.css';
import './styles/components.css';

// 创建演示页面
function createCSSDemo() {
  const app = document.createElement('div');
  app.className = 'container';
  
  app.innerHTML = `
    <!-- 导航栏 -->
    <nav class="nav">
      <div class="nav-container">
        <a href="#" class="nav-brand">🎨 CSS 演示</a>
        <ul class="nav-menu">
          <li><a href="#components" class="nav-link">组件</a></li>
          <li><a href="#utilities" class="nav-link">工具类</a></li>
          <li><a href="#animations" class="nav-link">动画</a></li>
        </ul>
      </div>
    </nav>

    <!-- 主内容 -->
    <main>
      <!-- 标题部分 -->
      <div class="card animate-fade-in">
        <div class="card-header text-center">
          <h1 class="card-title">📦 ESBuild CSS 处理演示</h1>
          <p class="card-subtitle">展示 CSS 文件的导入、处理和优化</p>
        </div>
      </div>

      <!-- 按钮组件演示 -->
      <section id="components" class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">🔘 按钮组件</h2>
        </div>
        <div class="flex flex-wrap" style="gap: 10px;">
          <button class="btn btn-primary">主要按钮</button>
          <button class="btn btn-secondary">次要按钮</button>
          <button class="btn btn-danger">危险按钮</button>
          <button class="btn btn-outline">边框按钮</button>
          <button class="btn btn-primary btn-sm">小按钮</button>
          <button class="btn btn-secondary btn-lg">大按钮</button>
        </div>
      </section>

      <!-- 表单组件演示 -->
      <section class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">📝 表单组件</h2>
        </div>
        <form class="grid grid-2">
          <div class="form-group">
            <label class="form-label">姓名</label>
            <input type="text" class="form-input" placeholder="请输入您的姓名">
          </div>
          <div class="form-group">
            <label class="form-label">邮箱</label>
            <input type="email" class="form-input" placeholder="请输入您的邮箱">
          </div>
          <div class="form-group">
            <label class="form-label">密码</label>
            <input type="password" class="form-input" placeholder="请输入密码">
          </div>
          <div class="form-group">
            <label class="form-label">确认密码</label>
            <input type="password" class="form-input" placeholder="请确认密码">
          </div>
        </form>
      </section>

      <!-- 提示框演示 -->
      <section class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">💬 提示框组件</h2>
        </div>
        <div class="alert alert-info">
          <strong>信息提示：</strong> 这是一个信息提示框，用于显示一般信息。
        </div>
        <div class="alert alert-success">
          <strong>成功提示：</strong> 操作已成功完成！
        </div>
        <div class="alert alert-warning">
          <strong>警告提示：</strong> 请注意这个重要信息。
        </div>
        <div class="alert alert-danger">
          <strong>错误提示：</strong> 发生了一个错误，请检查您的输入。
        </div>
      </section>

      <!-- 标签和进度条演示 -->
      <section class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">🏷️ 标签和进度条</h2>
        </div>
        <div class="mb-md">
          <h3 style="margin-bottom: 10px;">标签组件：</h3>
          <span class="badge badge-primary">主要</span>
          <span class="badge badge-secondary">次要</span>
          <span class="badge badge-warning">警告</span>
          <span class="badge badge-danger">危险</span>
        </div>
        <div>
          <h3 style="margin-bottom: 10px;">进度条组件：</h3>
          <div class="progress mb-sm">
            <div class="progress-bar" style="width: 75%"></div>
          </div>
          <div class="progress">
            <div class="progress-bar" style="width: 45%"></div>
          </div>
        </div>
      </section>

      <!-- 标签页演示 -->
      <section class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">📑 标签页组件</h2>
        </div>
        <div class="tabs">
          <ul class="tab-list">
            <li class="tab-item">
              <a href="#tab1" class="tab-link active" onclick="switchTab(event, 'tab1')">标签页 1</a>
            </li>
            <li class="tab-item">
              <a href="#tab2" class="tab-link" onclick="switchTab(event, 'tab2')">标签页 2</a>
            </li>
            <li class="tab-item">
              <a href="#tab3" class="tab-link" onclick="switchTab(event, 'tab3')">标签页 3</a>
            </li>
          </ul>
        </div>
        <div class="tab-content">
          <div id="tab1" class="tab-pane active">
            <h3>标签页 1 内容</h3>
            <p>这是第一个标签页的内容。ESBuild 可以很好地处理 CSS 文件，包括导入、优化和打包。</p>
          </div>
          <div id="tab2" class="tab-pane">
            <h3>标签页 2 内容</h3>
            <p>这是第二个标签页的内容。CSS 变量、Flexbox 和 Grid 布局都得到了很好的支持。</p>
          </div>
          <div id="tab3" class="tab-pane">
            <h3>标签页 3 内容</h3>
            <p>这是第三个标签页的内容。现代 CSS 特性如动画、过渡和媒体查询都能正常工作。</p>
          </div>
        </div>
      </section>

      <!-- 动画演示 -->
      <section id="animations" class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">✨ 动画演示</h2>
        </div>
        <div class="flex flex-wrap" style="gap: 20px; align-items: center;">
          <div class="loader"></div>
          <button class="btn btn-primary animate-pulse">脉冲动画</button>
          <div class="badge badge-secondary animate-slide-in">滑入动画</div>
          <div class="tooltip">
            <span class="btn btn-outline">悬停查看提示</span>
            <span class="tooltip-text">这是一个工具提示！</span>
          </div>
        </div>
      </section>

      <!-- 手风琴演示 -->
      <section class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">🪗 手风琴组件</h2>
        </div>
        <div class="accordion">
          <div class="accordion-item">
            <div class="accordion-header" onclick="toggleAccordion(this)">
              <span>ESBuild 的优势</span>
              <span class="accordion-toggle">▼</span>
            </div>
            <div class="accordion-content">
              <div class="accordion-body">
                <p>ESBuild 是一个极快的 JavaScript 打包器和压缩器，主要优势包括：</p>
                <ul>
                  <li>构建速度极快（比 Webpack 快 10-100 倍）</li>
                  <li>零配置，开箱即用</li>
                  <li>内置支持 TypeScript、JSX、CSS 等</li>
                  <li>Tree Shaking 和代码分割</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <div class="accordion-header" onclick="toggleAccordion(this)">
              <span>CSS 处理特性</span>
              <span class="accordion-toggle">▼</span>
            </div>
            <div class="accordion-content">
              <div class="accordion-body">
                <p>ESBuild 对 CSS 的处理包括：</p>
                <ul>
                  <li>CSS 文件导入和打包</li>
                  <li>CSS 压缩和优化</li>
                  <li>自动添加厂商前缀（需要插件）</li>
                  <li>CSS 模块支持（需要配置）</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 分页演示 -->
      <section class="card mt-lg mb-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">📄 分页组件</h2>
        </div>
        <div class="pagination">
          <a href="#" class="pagination-item disabled">‹</a>
          <a href="#" class="pagination-item active">1</a>
          <a href="#" class="pagination-item">2</a>
          <a href="#" class="pagination-item">3</a>
          <a href="#" class="pagination-item">4</a>
          <a href="#" class="pagination-item">5</a>
          <a href="#" class="pagination-item">›</a>
        </div>
      </section>
    </main>
  `;
  
  document.body.appendChild(app);
}

// 标签页切换功能
window.switchTab = function(event, tabId) {
  event.preventDefault();
  
  // 移除所有活动状态
  document.querySelectorAll('.tab-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  
  // 激活当前标签
  event.target.classList.add('active');
  document.getElementById(tabId).classList.add('active');
};

// 手风琴切换功能
window.toggleAccordion = function(header) {
  const item = header.parentElement;
  const isActive = item.classList.contains('active');
  
  // 关闭所有手风琴项
  document.querySelectorAll('.accordion-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // 如果不是当前活动项，则激活它
  if (!isActive) {
    item.classList.add('active');
  }
};

// 初始化演示
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createCSSDemo);
} else {
  createCSSDemo();
}

console.log('🎨 CSS 演示已启动！');
console.log('📦 ESBuild 成功处理了 CSS 文件导入');
console.log('⚡ 所有样式都被正确应用和优化');
