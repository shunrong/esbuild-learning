(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateSet = (obj, member, value, setter) => {
    __accessCheck(obj, member, "write to private field");
    setter ? setter.call(obj, value) : member.set(obj, value);
    return value;
  };

  // src/es6-features.js
  var Animal = class {
    constructor(name2, type) {
      this.name = name2;
      this.type = type;
    }
    // 方法简写语法
    speak() {
      return `${this.name} \u53D1\u51FA\u58F0\u97F3`;
    }
    // 静态方法
    static getSpecies() {
      return "\u52A8\u7269";
    }
  };
  var Dog = class extends Animal {
    constructor(name2, breed) {
      super(name2, "\u72D7");
      // 箭头函数作为类方法
      __publicField(this, "getInfo", () => {
        return `\u54C1\u79CD: ${this.breed}, \u7C7B\u578B: ${this.type}`;
      });
      this.breed = breed;
    }
    speak() {
      return `${this.name} \u6C6A\u6C6A\u53EB`;
    }
  };
  var person = {
    name: "\u5F20\u4E09",
    age: 25,
    address: { city: "\u5317\u4EAC", district: "\u671D\u9633\u533A" }
  };
  var { name, age, address: { city } } = person;
  var numbers = [1, 2, 3, 4, 5];
  var [first, second, ...rest] = numbers;
  function highlight(strings, ...values) {
    return strings.reduce((result, string, i) => {
      const value = values[i] ? `<mark>${values[i]}</mark>` : "";
      return result + string + value;
    }, "");
  }
  var description = highlight`姓名: ${name}, 年龄: ${age}, 城市: ${city}`;
  async function fetchUserData(userId) {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: userId,
            name: "\u7528\u6237" + userId,
            posts: ["\u6587\u7AE01", "\u6587\u7AE02", "\u6587\u7AE03"]
          });
        }, 1e3);
      });
      return response;
    } catch (error) {
      console.error("\u83B7\u53D6\u7528\u6237\u6570\u636E\u5931\u8D25:", error);
      throw error;
    }
  }
  function* numberGenerator(max) {
    let current = 0;
    while (current < max) {
      yield current++;
    }
  }
  var userMap = /* @__PURE__ */ new Map([
    ["user1", { name: "\u7528\u62371", active: true }],
    ["user2", { name: "\u7528\u62372", active: false }]
  ]);
  var uniqueNumbers = /* @__PURE__ */ new Set([1, 2, 3, 3, 4, 4, 5]);
  function processData(data, options = { sort: true, filter: true }, ...extraArgs) {
    console.log("\u5904\u7406\u6570\u636E:", data);
    console.log("\u9009\u9879:", options);
    console.log("\u989D\u5916\u53C2\u6570:", extraArgs);
    let result = [...data];
    if (options.sort) {
      result = result.sort();
    }
    if (options.filter) {
      result = result.filter((item) => item !== null && item !== void 0);
    }
    return result;
  }
  var createUser = (id, name2, email) => {
    const timestamp = Date.now();
    return {
      id,
      // 属性简写
      name: name2,
      email,
      [`created_${timestamp}`]: /* @__PURE__ */ new Date(),
      // 计算属性名
      // 方法简写
      greet() {
        return `\u4F60\u597D\uFF0C\u6211\u662F ${this.name}`;
      }
    };
  };
  var getUserCity = (user) => {
    var _a, _b;
    return (_b = (_a = user == null ? void 0 : user.address) == null ? void 0 : _a.city) != null ? _b : "\u672A\u77E5\u57CE\u5E02";
  };
  var _balance;
  var BankAccount = class {
    // 私有字段
    constructor(initialBalance = 0) {
      __privateAdd(this, _balance, 0);
      __privateSet(this, _balance, initialBalance);
    }
    deposit(amount) {
      __privateSet(this, _balance, __privateGet(this, _balance) + amount);
      return __privateGet(this, _balance);
    }
    getBalance() {
      return __privateGet(this, _balance);
    }
  };
  _balance = new WeakMap();
  async function demonstrateFeatures() {
    console.log("\u{1F680} ES6+ \u7279\u6027\u6F14\u793A\u5F00\u59CB");
    const dog = new Dog("\u65FA\u8D22", "\u91D1\u6BDB");
    console.log("1. \u7C7B:", dog.speak(), dog.getInfo());
    console.log("2. \u89E3\u6784:", { name, age, city, first, second, rest });
    console.log("3. \u6A21\u677F\u5B57\u7B26\u4E32:", description);
    const gen = numberGenerator(5);
    const generated = [...gen];
    console.log("4. \u751F\u6210\u5668:", generated);
    console.log("5. Map:", Array.from(userMap.entries()));
    console.log("5. Set:", Array.from(uniqueNumbers));
    const processed = processData([3, 1, null, 2, void 0, 4], void 0, "extra1", "extra2");
    console.log("6. \u51FD\u6570\u7279\u6027:", processed);
    const user = createUser(1, "\u674E\u56DB", "lisi@example.com");
    console.log("7. \u5BF9\u8C61\u7279\u6027:", user, user.greet());
    const city1 = getUserCity({ address: { city: "\u4E0A\u6D77" } });
    const city2 = getUserCity({});
    console.log("8. \u53EF\u9009\u94FE:", city1, city2);
    const account = new BankAccount(1e3);
    account.deposit(500);
    console.log("9. \u79C1\u6709\u5B57\u6BB5:", account.getBalance());
    try {
      const userData = await fetchUserData(123);
      console.log("10. \u5F02\u6B65\u64CD\u4F5C:", userData);
    } catch (error) {
      console.error("\u5F02\u6B65\u64CD\u4F5C\u5931\u8D25:", error);
    }
    return "\u6240\u6709\u7279\u6027\u6F14\u793A\u5B8C\u6210\uFF01";
  }

  // src/syntax-transform-demo.js
  async function createDemo() {
    const container = document.createElement("div");
    container.style.cssText = `
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    color: white;
    border-radius: 12px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  `;
    container.innerHTML = `
    <h1 style="text-align: center; margin-bottom: 30px;">
      \u{1F4E6} ESBuild \u8BED\u6CD5\u8F6C\u6362\u6F14\u793A
    </h1>
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2>\u{1F3AF} \u6F14\u793A\u5185\u5BB9</h2>
      <ul style="line-height: 1.8;">
        <li>ES6+ \u7C7B\u548C\u7EE7\u627F\u8BED\u6CD5</li>
        <li>\u89E3\u6784\u8D4B\u503C\u548C\u5C55\u5F00\u8FD0\u7B97\u7B26</li>
        <li>\u6A21\u677F\u5B57\u7B26\u4E32\u548C\u6807\u7B7E\u6A21\u677F</li>
        <li>Promise \u548C async/await</li>
        <li>\u751F\u6210\u5668\u51FD\u6570</li>
        <li>Map\u3001Set \u6570\u636E\u7ED3\u6784</li>
        <li>\u9ED8\u8BA4\u53C2\u6570\u548C\u5269\u4F59\u53C2\u6570</li>
        <li>\u5BF9\u8C61\u5C5E\u6027\u7B80\u5199</li>
        <li>\u53EF\u9009\u94FE\u548C\u7A7A\u503C\u5408\u5E76</li>
        <li>\u79C1\u6709\u5B57\u6BB5\u8BED\u6CD5</li>
      </ul>
    </div>
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
      <h2>\u{1F527} \u6784\u5EFA\u5BF9\u6BD4</h2>
      <p>\u4F7F\u7528\u4EE5\u4E0B\u547D\u4EE4\u67E5\u770B\u4E0D\u540C\u76EE\u6807\u73AF\u5883\u7684\u6784\u5EFA\u7ED3\u679C\uFF1A</p>
      <pre style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; overflow-x: auto;">
# \u73B0\u4EE3\u6D4F\u89C8\u5668 (ES2020)
npx esbuild src/syntax-transform-demo.js --bundle --target=es2020 --outfile=dist/modern.js

# \u517C\u5BB9\u6D4F\u89C8\u5668 (ES5)
npx esbuild src/syntax-transform-demo.js --bundle --target=es5 --outfile=dist/legacy.js

# Node.js \u73AF\u5883
npx esbuild src/syntax-transform-demo.js --bundle --target=node14 --outfile=dist/node.js
      </pre>
    </div>
    <div id="output" style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-top: 20px;">
      <h2>\u{1F4CA} \u6267\u884C\u7ED3\u679C</h2>
      <p>\u6B63\u5728\u6267\u884C ES6+ \u7279\u6027\u6F14\u793A...</p>
    </div>
  `;
    document.body.appendChild(container);
    try {
      const result = await demonstrateFeatures();
      const outputDiv = document.getElementById("output");
      outputDiv.innerHTML = `
      <h2>\u{1F4CA} \u6267\u884C\u7ED3\u679C</h2>
      <p style="color: #00ff88; font-weight: bold;">\u2705 ${result}</p>
      <p>\u8BF7\u6253\u5F00\u6D4F\u89C8\u5668\u63A7\u5236\u53F0\u67E5\u770B\u8BE6\u7EC6\u8F93\u51FA</p>
      <p style="margin-top: 15px; font-style: italic;">
        \u{1F4A1} \u63D0\u793A: \u67E5\u770B dist/ \u76EE\u5F55\u4E0B\u7684\u4E0D\u540C\u6784\u5EFA\u7248\u672C\uFF0C\u6BD4\u8F83\u8BED\u6CD5\u8F6C\u6362\u6548\u679C
      </p>
    `;
    } catch (error) {
      const outputDiv = document.getElementById("output");
      outputDiv.innerHTML = `
      <h2>\u{1F4CA} \u6267\u884C\u7ED3\u679C</h2>
      <p style="color: #ff6b6b; font-weight: bold;">\u274C \u6267\u884C\u51FA\u9519: ${error.message}</p>
    `;
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createDemo);
  } else {
    createDemo();
  }
})();
