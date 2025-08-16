// ES6+ 特性演示文件
// 这个文件包含了各种现代 JavaScript 特性

// 1. 类和继承
class Animal {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
  
  // 方法简写语法
  speak() {
    return `${this.name} 发出声音`;
  }
  
  // 静态方法
  static getSpecies() {
    return '动物';
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name, '狗');
    this.breed = breed;
  }
  
  speak() {
    return `${this.name} 汪汪叫`;
  }
  
  // 箭头函数作为类方法
  getInfo = () => {
    return `品种: ${this.breed}, 类型: ${this.type}`;
  }
}

// 2. 解构赋值
const person = { 
  name: '张三', 
  age: 25, 
  address: { city: '北京', district: '朝阳区' } 
};

const { name, age, address: { city } } = person;
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;

// 3. 模板字符串和标签模板
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? `<mark>${values[i]}</mark>` : '';
    return result + string + value;
  }, '');
}

const description = highlight`姓名: ${name}, 年龄: ${age}, 城市: ${city}`;

// 4. Promise 和 async/await
async function fetchUserData(userId) {
  try {
    // 模拟 API 调用
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          name: '用户' + userId,
          posts: ['文章1', '文章2', '文章3']
        });
      }, 1000);
    });
    
    return response;
  } catch (error) {
    console.error('获取用户数据失败:', error);
    throw error;
  }
}

// 5. 生成器函数
function* numberGenerator(max) {
  let current = 0;
  while (current < max) {
    yield current++;
  }
}

// 6. Map 和 Set
const userMap = new Map([
  ['user1', { name: '用户1', active: true }],
  ['user2', { name: '用户2', active: false }]
]);

const uniqueNumbers = new Set([1, 2, 3, 3, 4, 4, 5]);

// 7. 默认参数、剩余参数、展开运算符
function processData(
  data, 
  options = { sort: true, filter: true }, 
  ...extraArgs
) {
  console.log('处理数据:', data);
  console.log('选项:', options);
  console.log('额外参数:', extraArgs);
  
  let result = [...data]; // 展开运算符复制数组
  
  if (options.sort) {
    result = result.sort();
  }
  
  if (options.filter) {
    result = result.filter(item => item !== null && item !== undefined);
  }
  
  return result;
}

// 8. 对象属性简写和计算属性名
const createUser = (id, name, email) => {
  const timestamp = Date.now();
  
  return {
    id,           // 属性简写
    name,
    email,
    [`created_${timestamp}`]: new Date(), // 计算属性名
    // 方法简写
    greet() {
      return `你好，我是 ${this.name}`;
    }
  };
};

// 9. 可选链和空值合并操作符 (ES2020)
const getUserCity = (user) => {
  // 可选链
  return user?.address?.city ?? '未知城市';
};

// 10. 私有字段 (ES2022)
class BankAccount {
  #balance = 0; // 私有字段
  
  constructor(initialBalance = 0) {
    this.#balance = initialBalance;
  }
  
  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }
  
  getBalance() {
    return this.#balance;
  }
}

// 主函数：演示所有特性
export async function demonstrateFeatures() {
  console.log('🚀 ES6+ 特性演示开始');
  
  // 类和继承
  const dog = new Dog('旺财', '金毛');
  console.log('1. 类:', dog.speak(), dog.getInfo());
  
  // 解构赋值
  console.log('2. 解构:', { name, age, city, first, second, rest });
  
  // 模板字符串
  console.log('3. 模板字符串:', description);
  
  // 生成器
  const gen = numberGenerator(5);
  const generated = [...gen];
  console.log('4. 生成器:', generated);
  
  // Map 和 Set
  console.log('5. Map:', Array.from(userMap.entries()));
  console.log('5. Set:', Array.from(uniqueNumbers));
  
  // 函数特性
  const processed = processData([3, 1, null, 2, undefined, 4], undefined, 'extra1', 'extra2');
  console.log('6. 函数特性:', processed);
  
  // 对象特性
  const user = createUser(1, '李四', 'lisi@example.com');
  console.log('7. 对象特性:', user, user.greet());
  
  // 可选链
  const city1 = getUserCity({ address: { city: '上海' } });
  const city2 = getUserCity({});
  console.log('8. 可选链:', city1, city2);
  
  // 私有字段
  const account = new BankAccount(1000);
  account.deposit(500);
  console.log('9. 私有字段:', account.getBalance());
  
  // 异步操作
  try {
    const userData = await fetchUserData(123);
    console.log('10. 异步操作:', userData);
  } catch (error) {
    console.error('异步操作失败:', error);
  }
  
  return '所有特性演示完成！';
}
