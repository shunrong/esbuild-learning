// Tree Shaking 演示
// 这个文件展示了 ESBuild 如何自动移除未使用的代码

// 创建一个包含多个函数的模块
export function usedFunction() {
  return "这个函数被使用了";
}

export function unusedFunction() {
  return "这个函数没有被使用，会被 tree shaking 移除";
}

export function anotherUnusedFunction() {
  console.log("另一个未使用的函数");
  return {
    data: "复杂数据",
    method: () => "复杂方法"
  };
}

export const USED_CONSTANT = "被使用的常量";
export const UNUSED_CONSTANT = "未使用的常量";

// 默认导出
export default function defaultFunction() {
  return "默认导出函数";
}
