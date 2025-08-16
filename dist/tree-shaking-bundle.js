(() => {
  // examples/tree-shaking-demo.js
  function usedFunction() {
    return "\u8FD9\u4E2A\u51FD\u6570\u88AB\u4F7F\u7528\u4E86";
  }
  var USED_CONSTANT = "\u88AB\u4F7F\u7528\u7684\u5E38\u91CF";

  // src/tree-shaking-test.js
  console.log("Tree Shaking \u6F14\u793A\uFF1A");
  console.log(usedFunction());
  console.log("\u4F7F\u7528\u7684\u5E38\u91CF\uFF1A", USED_CONSTANT);
  document.body.innerHTML = `
  <div style="padding: 20px; font-family: Arial; background: #f0f0f0;">
    <h2>Tree Shaking \u6F14\u793A</h2>
    <p>\u6253\u5F00\u6D4F\u89C8\u5668\u63A7\u5236\u53F0\u67E5\u770B\u8F93\u51FA</p>
    <p>\u68C0\u67E5\u6253\u5305\u540E\u7684\u4EE3\u7801\uFF0C\u4F60\u4F1A\u53D1\u73B0\u672A\u4F7F\u7528\u7684\u51FD\u6570\u88AB\u79FB\u9664\u4E86</p>
    <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
      <strong>\u4F7F\u7528\u7684\u51FD\u6570\u8F93\u51FA\uFF1A</strong> ${usedFunction()}<br>
      <strong>\u4F7F\u7528\u7684\u5E38\u91CF\uFF1A</strong> ${USED_CONSTANT}
    </div>
  </div>
`;
})();
