// ESBuild 基础示例 - 主入口文件
import { add, multiply } from './utils/math.js';
import { createElement, appendToBody } from './utils/dom.js';

// 使用 ES6+ 语法
const numbers = [1, 2, 3, 4, 5];

// 箭头函数和模板字符串
const processNumbers = (nums) => {
  const sum = nums.reduce((acc, num) => add(acc, num), 0);
  const product = nums.reduce((acc, num) => multiply(acc, num), 1);
  
  return {
    sum,
    product,
    average: sum / nums.length,
    // 使用展开运算符
    doubled: [...nums.map(n => n * 2)]
  };
};

// 异步函数示例
async function displayResults() {
  try {
    const results = processNumbers(numbers);
    
    console.log('🚀 ESBuild 基础示例启动！');
    console.log('原始数组:', numbers);
    console.log('计算结果:', results);
    
    // 创建 UI 元素
    const container = createElement('div', { 
      id: 'app', 
      style: 'padding: 20px; font-family: Arial, sans-serif;' 
    });
    
    const title = createElement('h1', {}, ['ESBuild 学习示例']);
    const subtitle = createElement('h2', {}, ['基础打包功能演示']);
    
    const resultsList = createElement('ul', {});
    
    // 使用对象解构
    const { sum, product, average, doubled } = results;
    
    const listItems = [
      `原始数组: [${numbers.join(', ')}]`,
      `求和结果: ${sum}`,
      `乘积结果: ${product}`,
      `平均值: ${average.toFixed(2)}`,
      `翻倍数组: [${doubled.join(', ')}]`
    ].map(text => createElement('li', {}, [text]));
    
    listItems.forEach(item => resultsList.appendChild(item));
    
    // 添加样式
    const style = createElement('style', {}, [`
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
    
    // 组装页面
    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(resultsList);
    
    document.head.appendChild(style);
    appendToBody(container);
    
  } catch (error) {
    console.error('执行出错:', error);
  }
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', displayResults);
} else {
  displayResults();
}
