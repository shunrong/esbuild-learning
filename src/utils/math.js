// 数学工具函数
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export function calculate(operation, a, b) {
  switch (operation) {
    case 'add':
      return add(a, b);
    case 'multiply':
      return multiply(a, b);
    default:
      throw new Error(`未知操作: ${operation}`);
  }
}

// 这个函数不会被使用，esbuild 会通过 tree shaking 移除它
export function unusedFunction() {
  console.log('这个函数不会出现在最终打包结果中');
}
