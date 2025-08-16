// Tree Shaking 测试文件
// 只导入部分函数，看看 ESBuild 是否会移除未使用的代码

import { usedFunction, USED_CONSTANT } from '../examples/tree-shaking-demo.js';
// 注意：我们没有导入 unusedFunction, anotherUnusedFunction, UNUSED_CONSTANT

console.log('Tree Shaking 演示：');
console.log(usedFunction());
console.log('使用的常量：', USED_CONSTANT);

// 创建一个简单的页面来展示结果
document.body.innerHTML = `
  <div style="padding: 20px; font-family: Arial; background: #f0f0f0;">
    <h2>Tree Shaking 演示</h2>
    <p>打开浏览器控制台查看输出</p>
    <p>检查打包后的代码，你会发现未使用的函数被移除了</p>
    <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
      <strong>使用的函数输出：</strong> ${usedFunction()}<br>
      <strong>使用的常量：</strong> ${USED_CONSTANT}
    </div>
  </div>
`;
