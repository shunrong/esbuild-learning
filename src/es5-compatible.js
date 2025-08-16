// ES5 兼容的代码示例
// 这个文件演示了 ESBuild 可以处理的 ES5 兼容语法

// 使用 var 而不是 const/let
var numbers = [1, 2, 3, 4, 5];

// 使用普通函数而不是箭头函数
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// 使用普通函数而不是箭头函数
function processNumbers(nums) {
  var sum = 0;
  var product = 1;
  var doubled = [];
  
  // 使用传统的 for 循环
  for (var i = 0; i < nums.length; i++) {
    sum = add(sum, nums[i]);
    product = multiply(product, nums[i]);
    doubled.push(nums[i] * 2);
  }
  
  return {
    sum: sum,
    product: product,
    average: sum / nums.length,
    doubled: doubled
  };
}

// 使用普通函数而不是 async/await
function displayResults() {
  try {
    var results = processNumbers(numbers);
    
    console.log('🚀 ESBuild ES5 兼容示例启动！');
    console.log('原始数组:', numbers);
    console.log('计算结果:', results);
    
    // 创建 DOM 元素（如果在浏览器环境中）
    if (typeof document !== 'undefined') {
      var container = document.createElement('div');
      container.id = 'app';
      container.style.cssText = 'padding: 20px; font-family: Arial, sans-serif;';
      
      var title = document.createElement('h1');
      title.textContent = 'ESBuild ES5 兼容示例';
      
      var subtitle = document.createElement('h2');
      subtitle.textContent = 'ES5 语法演示';
      
      var resultsList = document.createElement('ul');
      
      // 手动创建列表项
      var listItems = [
        '原始数组: [' + numbers.join(', ') + ']',
        '求和结果: ' + results.sum,
        '乘积结果: ' + results.product,
        '平均值: ' + results.average.toFixed(2),
        '翻倍数组: [' + results.doubled.join(', ') + ']'
      ];
      
      for (var j = 0; j < listItems.length; j++) {
        var li = document.createElement('li');
        li.textContent = listItems[j];
        li.style.cssText = 'margin: 10px 0; padding: 5px;';
        resultsList.appendChild(li);
      }
      
      // 添加样式
      var style = document.createElement('style');
      style.textContent = [
        '#app {',
        '  max-width: 600px;',
        '  margin: 0 auto;',
        '  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
        '  color: white;',
        '  border-radius: 10px;',
        '  box-shadow: 0 10px 30px rgba(0,0,0,0.3);',
        '}',
        'h1, h2 { text-align: center; }',
        'ul { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 5px; }'
      ].join('\n');
      
      container.appendChild(title);
      container.appendChild(subtitle);
      container.appendChild(resultsList);
      
      document.head.appendChild(style);
      document.body.appendChild(container);
    }
    
  } catch (error) {
    console.error('执行出错:', error);
  }
}

// 检查 DOM 是否加载完成
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayResults);
  } else {
    displayResults();
  }
} else {
  // Node.js 环境
  displayResults();
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    add: add,
    multiply: multiply,
    processNumbers: processNumbers,
    displayResults: displayResults
  };
}
