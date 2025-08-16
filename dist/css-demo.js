"use strict";
(() => {
  // src/css-demo.js
  function createCSSDemo() {
    const app = document.createElement("div");
    app.className = "container";
    app.innerHTML = `
    <!-- \u5BFC\u822A\u680F -->
    <nav class="nav">
      <div class="nav-container">
        <a href="#" class="nav-brand">\u{1F3A8} CSS \u6F14\u793A</a>
        <ul class="nav-menu">
          <li><a href="#components" class="nav-link">\u7EC4\u4EF6</a></li>
          <li><a href="#utilities" class="nav-link">\u5DE5\u5177\u7C7B</a></li>
          <li><a href="#animations" class="nav-link">\u52A8\u753B</a></li>
        </ul>
      </div>
    </nav>

    <!-- \u4E3B\u5185\u5BB9 -->
    <main>
      <!-- \u6807\u9898\u90E8\u5206 -->
      <div class="card animate-fade-in">
        <div class="card-header text-center">
          <h1 class="card-title">\u{1F4E6} ESBuild CSS \u5904\u7406\u6F14\u793A</h1>
          <p class="card-subtitle">\u5C55\u793A CSS \u6587\u4EF6\u7684\u5BFC\u5165\u3001\u5904\u7406\u548C\u4F18\u5316</p>
        </div>
      </div>

      <!-- \u6309\u94AE\u7EC4\u4EF6\u6F14\u793A -->
      <section id="components" class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">\u{1F518} \u6309\u94AE\u7EC4\u4EF6</h2>
        </div>
        <div class="flex flex-wrap" style="gap: 10px;">
          <button class="btn btn-primary">\u4E3B\u8981\u6309\u94AE</button>
          <button class="btn btn-secondary">\u6B21\u8981\u6309\u94AE</button>
          <button class="btn btn-danger">\u5371\u9669\u6309\u94AE</button>
          <button class="btn btn-outline">\u8FB9\u6846\u6309\u94AE</button>
          <button class="btn btn-primary btn-sm">\u5C0F\u6309\u94AE</button>
          <button class="btn btn-secondary btn-lg">\u5927\u6309\u94AE</button>
        </div>
      </section>

      <!-- \u8868\u5355\u7EC4\u4EF6\u6F14\u793A -->
      <section class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">\u{1F4DD} \u8868\u5355\u7EC4\u4EF6</h2>
        </div>
        <form class="grid grid-2">
          <div class="form-group">
            <label class="form-label">\u59D3\u540D</label>
            <input type="text" class="form-input" placeholder="\u8BF7\u8F93\u5165\u60A8\u7684\u59D3\u540D">
          </div>
          <div class="form-group">
            <label class="form-label">\u90AE\u7BB1</label>
            <input type="email" class="form-input" placeholder="\u8BF7\u8F93\u5165\u60A8\u7684\u90AE\u7BB1">
          </div>
          <div class="form-group">
            <label class="form-label">\u5BC6\u7801</label>
            <input type="password" class="form-input" placeholder="\u8BF7\u8F93\u5165\u5BC6\u7801">
          </div>
          <div class="form-group">
            <label class="form-label">\u786E\u8BA4\u5BC6\u7801</label>
            <input type="password" class="form-input" placeholder="\u8BF7\u786E\u8BA4\u5BC6\u7801">
          </div>
        </form>
      </section>

      <!-- \u63D0\u793A\u6846\u6F14\u793A -->
      <section class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">\u{1F4AC} \u63D0\u793A\u6846\u7EC4\u4EF6</h2>
        </div>
        <div class="alert alert-info">
          <strong>\u4FE1\u606F\u63D0\u793A\uFF1A</strong> \u8FD9\u662F\u4E00\u4E2A\u4FE1\u606F\u63D0\u793A\u6846\uFF0C\u7528\u4E8E\u663E\u793A\u4E00\u822C\u4FE1\u606F\u3002
        </div>
        <div class="alert alert-success">
          <strong>\u6210\u529F\u63D0\u793A\uFF1A</strong> \u64CD\u4F5C\u5DF2\u6210\u529F\u5B8C\u6210\uFF01
        </div>
        <div class="alert alert-warning">
          <strong>\u8B66\u544A\u63D0\u793A\uFF1A</strong> \u8BF7\u6CE8\u610F\u8FD9\u4E2A\u91CD\u8981\u4FE1\u606F\u3002
        </div>
        <div class="alert alert-danger">
          <strong>\u9519\u8BEF\u63D0\u793A\uFF1A</strong> \u53D1\u751F\u4E86\u4E00\u4E2A\u9519\u8BEF\uFF0C\u8BF7\u68C0\u67E5\u60A8\u7684\u8F93\u5165\u3002
        </div>
      </section>

      <!-- \u6807\u7B7E\u548C\u8FDB\u5EA6\u6761\u6F14\u793A -->
      <section class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">\u{1F3F7}\uFE0F \u6807\u7B7E\u548C\u8FDB\u5EA6\u6761</h2>
        </div>
        <div class="mb-md">
          <h3 style="margin-bottom: 10px;">\u6807\u7B7E\u7EC4\u4EF6\uFF1A</h3>
          <span class="badge badge-primary">\u4E3B\u8981</span>
          <span class="badge badge-secondary">\u6B21\u8981</span>
          <span class="badge badge-warning">\u8B66\u544A</span>
          <span class="badge badge-danger">\u5371\u9669</span>
        </div>
        <div>
          <h3 style="margin-bottom: 10px;">\u8FDB\u5EA6\u6761\u7EC4\u4EF6\uFF1A</h3>
          <div class="progress mb-sm">
            <div class="progress-bar" style="width: 75%"></div>
          </div>
          <div class="progress">
            <div class="progress-bar" style="width: 45%"></div>
          </div>
        </div>
      </section>

      <!-- \u6807\u7B7E\u9875\u6F14\u793A -->
      <section class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">\u{1F4D1} \u6807\u7B7E\u9875\u7EC4\u4EF6</h2>
        </div>
        <div class="tabs">
          <ul class="tab-list">
            <li class="tab-item">
              <a href="#tab1" class="tab-link active" onclick="switchTab(event, 'tab1')">\u6807\u7B7E\u9875 1</a>
            </li>
            <li class="tab-item">
              <a href="#tab2" class="tab-link" onclick="switchTab(event, 'tab2')">\u6807\u7B7E\u9875 2</a>
            </li>
            <li class="tab-item">
              <a href="#tab3" class="tab-link" onclick="switchTab(event, 'tab3')">\u6807\u7B7E\u9875 3</a>
            </li>
          </ul>
        </div>
        <div class="tab-content">
          <div id="tab1" class="tab-pane active">
            <h3>\u6807\u7B7E\u9875 1 \u5185\u5BB9</h3>
            <p>\u8FD9\u662F\u7B2C\u4E00\u4E2A\u6807\u7B7E\u9875\u7684\u5185\u5BB9\u3002ESBuild \u53EF\u4EE5\u5F88\u597D\u5730\u5904\u7406 CSS \u6587\u4EF6\uFF0C\u5305\u62EC\u5BFC\u5165\u3001\u4F18\u5316\u548C\u6253\u5305\u3002</p>
          </div>
          <div id="tab2" class="tab-pane">
            <h3>\u6807\u7B7E\u9875 2 \u5185\u5BB9</h3>
            <p>\u8FD9\u662F\u7B2C\u4E8C\u4E2A\u6807\u7B7E\u9875\u7684\u5185\u5BB9\u3002CSS \u53D8\u91CF\u3001Flexbox \u548C Grid \u5E03\u5C40\u90FD\u5F97\u5230\u4E86\u5F88\u597D\u7684\u652F\u6301\u3002</p>
          </div>
          <div id="tab3" class="tab-pane">
            <h3>\u6807\u7B7E\u9875 3 \u5185\u5BB9</h3>
            <p>\u8FD9\u662F\u7B2C\u4E09\u4E2A\u6807\u7B7E\u9875\u7684\u5185\u5BB9\u3002\u73B0\u4EE3 CSS \u7279\u6027\u5982\u52A8\u753B\u3001\u8FC7\u6E21\u548C\u5A92\u4F53\u67E5\u8BE2\u90FD\u80FD\u6B63\u5E38\u5DE5\u4F5C\u3002</p>
          </div>
        </div>
      </section>

      <!-- \u52A8\u753B\u6F14\u793A -->
      <section id="animations" class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">\u2728 \u52A8\u753B\u6F14\u793A</h2>
        </div>
        <div class="flex flex-wrap" style="gap: 20px; align-items: center;">
          <div class="loader"></div>
          <button class="btn btn-primary animate-pulse">\u8109\u51B2\u52A8\u753B</button>
          <div class="badge badge-secondary animate-slide-in">\u6ED1\u5165\u52A8\u753B</div>
          <div class="tooltip">
            <span class="btn btn-outline">\u60AC\u505C\u67E5\u770B\u63D0\u793A</span>
            <span class="tooltip-text">\u8FD9\u662F\u4E00\u4E2A\u5DE5\u5177\u63D0\u793A\uFF01</span>
          </div>
        </div>
      </section>

      <!-- \u624B\u98CE\u7434\u6F14\u793A -->
      <section class="card mt-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">\u{1FA97} \u624B\u98CE\u7434\u7EC4\u4EF6</h2>
        </div>
        <div class="accordion">
          <div class="accordion-item">
            <div class="accordion-header" onclick="toggleAccordion(this)">
              <span>ESBuild \u7684\u4F18\u52BF</span>
              <span class="accordion-toggle">\u25BC</span>
            </div>
            <div class="accordion-content">
              <div class="accordion-body">
                <p>ESBuild \u662F\u4E00\u4E2A\u6781\u5FEB\u7684 JavaScript \u6253\u5305\u5668\u548C\u538B\u7F29\u5668\uFF0C\u4E3B\u8981\u4F18\u52BF\u5305\u62EC\uFF1A</p>
                <ul>
                  <li>\u6784\u5EFA\u901F\u5EA6\u6781\u5FEB\uFF08\u6BD4 Webpack \u5FEB 10-100 \u500D\uFF09</li>
                  <li>\u96F6\u914D\u7F6E\uFF0C\u5F00\u7BB1\u5373\u7528</li>
                  <li>\u5185\u7F6E\u652F\u6301 TypeScript\u3001JSX\u3001CSS \u7B49</li>
                  <li>Tree Shaking \u548C\u4EE3\u7801\u5206\u5272</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <div class="accordion-header" onclick="toggleAccordion(this)">
              <span>CSS \u5904\u7406\u7279\u6027</span>
              <span class="accordion-toggle">\u25BC</span>
            </div>
            <div class="accordion-content">
              <div class="accordion-body">
                <p>ESBuild \u5BF9 CSS \u7684\u5904\u7406\u5305\u62EC\uFF1A</p>
                <ul>
                  <li>CSS \u6587\u4EF6\u5BFC\u5165\u548C\u6253\u5305</li>
                  <li>CSS \u538B\u7F29\u548C\u4F18\u5316</li>
                  <li>\u81EA\u52A8\u6DFB\u52A0\u5382\u5546\u524D\u7F00\uFF08\u9700\u8981\u63D2\u4EF6\uFF09</li>
                  <li>CSS \u6A21\u5757\u652F\u6301\uFF08\u9700\u8981\u914D\u7F6E\uFF09</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- \u5206\u9875\u6F14\u793A -->
      <section class="card mt-lg mb-lg animate-fade-in">
        <div class="card-header">
          <h2 class="card-title">\u{1F4C4} \u5206\u9875\u7EC4\u4EF6</h2>
        </div>
        <div class="pagination">
          <a href="#" class="pagination-item disabled">\u2039</a>
          <a href="#" class="pagination-item active">1</a>
          <a href="#" class="pagination-item">2</a>
          <a href="#" class="pagination-item">3</a>
          <a href="#" class="pagination-item">4</a>
          <a href="#" class="pagination-item">5</a>
          <a href="#" class="pagination-item">\u203A</a>
        </div>
      </section>
    </main>
  `;
    document.body.appendChild(app);
  }
  window.switchTab = function(event, tabId) {
    event.preventDefault();
    document.querySelectorAll(".tab-link").forEach((link) => {
      link.classList.remove("active");
    });
    document.querySelectorAll(".tab-pane").forEach((pane) => {
      pane.classList.remove("active");
    });
    event.target.classList.add("active");
    document.getElementById(tabId).classList.add("active");
  };
  window.toggleAccordion = function(header) {
    const item = header.parentElement;
    const isActive = item.classList.contains("active");
    document.querySelectorAll(".accordion-item").forEach((item2) => {
      item2.classList.remove("active");
    });
    if (!isActive) {
      item.classList.add("active");
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createCSSDemo);
  } else {
    createCSSDemo();
  }
  console.log("\u{1F3A8} CSS \u6F14\u793A\u5DF2\u542F\u52A8\uFF01");
  console.log("\u{1F4E6} ESBuild \u6210\u529F\u5904\u7406\u4E86 CSS \u6587\u4EF6\u5BFC\u5165");
  console.log("\u26A1 \u6240\u6709\u6837\u5F0F\u90FD\u88AB\u6B63\u786E\u5E94\u7528\u548C\u4F18\u5316");
})();
