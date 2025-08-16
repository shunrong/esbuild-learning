// 🔥 ESBuild 开发服务器
// Author: ESBuild Learning Project
// License: MIT
// Build Time: 2025-08-16T03:04:00.339Z
// ESBuild Version: 1.0.0
//
"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // src/utils/math.js
  function add(a, b) {
    return a + b;
  }
  __name(add, "add");
  function multiply(a, b) {
    return a * b;
  }
  __name(multiply, "multiply");

  // src/utils/dom.js
  function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  }
  __name(createElement, "createElement");
  function appendToBody(element) {
    document.body.appendChild(element);
  }
  __name(appendToBody, "appendToBody");

  // src/index.js
  var numbers = [1, 2, 3, 4, 5];
  var processNumbers = /* @__PURE__ */ __name((nums) => {
    const sum = nums.reduce((acc, num) => add(acc, num), 0);
    const product = nums.reduce((acc, num) => multiply(acc, num), 1);
    return {
      sum,
      product,
      average: sum / nums.length,
      // 使用展开运算符
      doubled: [...nums.map((n) => n * 2)]
    };
  }, "processNumbers");
  async function displayResults() {
    try {
      const results = processNumbers(numbers);
      console.log("\u{1F680} ESBuild \u57FA\u7840\u793A\u4F8B\u542F\u52A8\uFF01");
      console.log("\u539F\u59CB\u6570\u7EC4:", numbers);
      console.log("\u8BA1\u7B97\u7ED3\u679C:", results);
      const container = createElement("div", {
        id: "app",
        style: "padding: 20px; font-family: Arial, sans-serif;"
      });
      const title = createElement("h1", {}, ["ESBuild \u5B66\u4E60\u793A\u4F8B"]);
      const subtitle = createElement("h2", {}, ["\u57FA\u7840\u6253\u5305\u529F\u80FD\u6F14\u793A"]);
      const resultsList = createElement("ul", {});
      const { sum, product, average, doubled } = results;
      const listItems = [
        `\u539F\u59CB\u6570\u7EC4: [${numbers.join(", ")}]`,
        `\u6C42\u548C\u7ED3\u679C: ${sum}`,
        `\u4E58\u79EF\u7ED3\u679C: ${product}`,
        `\u5E73\u5747\u503C: ${average.toFixed(2)}`,
        `\u7FFB\u500D\u6570\u7EC4: [${doubled.join(", ")}]`
      ].map((text) => createElement("li", {}, [text]));
      listItems.forEach((item) => resultsList.appendChild(item));
      const style = createElement("style", {}, [`
      #app {
        max-width: 600px;
        margin: 0 auto;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      }
      h1, h2 { text-align: center; }
      ul { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 5px; }
      li { margin: 10px 0; padding: 5px; }
    `]);
      container.appendChild(title);
      container.appendChild(subtitle);
      container.appendChild(resultsList);
      document.head.appendChild(style);
      appendToBody(container);
    } catch (error) {
      console.error("\u6267\u884C\u51FA\u9519:", error);
    }
  }
  __name(displayResults, "displayResults");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", displayResults);
  } else {
    displayResults();
  }
})();
//# sourceMappingURL=index.js.map
