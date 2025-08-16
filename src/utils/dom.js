// DOM 操作工具函数
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  // 设置属性
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  // 添加子元素
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  
  return element;
}

export function appendToBody(element) {
  document.body.appendChild(element);
}
