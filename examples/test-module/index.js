
// 测试模块
export const moduleVar = 'Hello from module';
export function moduleFunction() {
  const localVar = 'local variable';
  console.log('Module function called:', localVar);
  return localVar;
}

const privateVar = 'This should not leak to global scope';
console.log('Module loaded:', moduleVar);
