"use strict";
(() => {
  // src/app.ts
  var BaseEntity = class {
    constructor(id) {
      this.id = id;
      this.createdAt = /* @__PURE__ */ new Date();
    }
    getId() {
      return this.id;
    }
    getAge() {
      return Date.now() - this.createdAt.getTime();
    }
  };
  var UserEntity = class _UserEntity extends BaseEntity {
    constructor(id, name, email, preferences, age) {
      super(id);
      this.id = id;
      this.name = name;
      this.email = email;
      this.age = age;
      this.preferences = preferences;
      this.createdAt = /* @__PURE__ */ new Date();
    }
    validate() {
      return this.name.length > 0 && this.email.includes("@") && (this.age === void 0 || this.age > 0);
    }
    updatePreferences(updates) {
      this.preferences = { ...this.preferences, ...updates };
    }
    // 静态方法
    static createUser(data) {
      const id = Math.random().toString(36).substr(2, 9);
      return new _UserEntity(id, data.name, data.email, data.preferences, data.age);
    }
  };
  var Repository = class {
    constructor() {
      this.items = /* @__PURE__ */ new Map();
    }
    save(entity) {
      this.items.set(entity.getId(), entity);
    }
    findById(id) {
      return this.items.get(id);
    }
    findAll() {
      return Array.from(this.items.values());
    }
    delete(id) {
      return this.items.delete(id);
    }
    count() {
      return this.items.size;
    }
    // 泛型方法
    findWhere(property, value) {
      return this.findAll().filter((item) => item[property] === value);
    }
  };
  var ApiService = class {
    constructor(baseUrl = "/api") {
      this.baseUrl = baseUrl;
    }
    // 泛型异步方法
    async request(method, endpoint, data) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json"
          },
          ...data && { body: JSON.stringify(data) }
        });
        const result = await response.json();
        return {
          success: response.ok,
          data: result,
          message: response.ok ? "Success" : "Request failed",
          timestamp: Date.now()
        };
      } catch (error) {
        return {
          success: false,
          data: null,
          message: error instanceof Error ? error.message : "Unknown error",
          timestamp: Date.now()
        };
      }
    }
    // 具体的 API 方法
    async getUsers() {
      const response = await this.request("GET", "/users");
      return {
        ...response,
        pagination: {
          page: 1,
          limit: 10,
          total: Array.isArray(response.data) ? response.data.length : 0,
          hasNext: false,
          hasPrev: false
        }
      };
    }
    async getUserById(id) {
      return this.request("GET", `/users/${id}`);
    }
    async updateUser(id, updates) {
      return this.request("PUT", `/users/${id}`, updates);
    }
  };
  var EventEmitter = class {
    constructor() {
      this.listeners = /* @__PURE__ */ new Map();
    }
    on(event, listener) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(listener);
    }
    emit(event, ...args) {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.forEach((listener) => listener(...args));
      }
    }
    off(event, listener) {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(listener);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    }
  };
  function createDefaultPreferences() {
    return {
      theme: "light",
      language: "zh-CN",
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    };
  }
  function isUser(obj) {
    return obj && typeof obj.id === "string" && typeof obj.name === "string" && typeof obj.email === "string" && obj.preferences && obj.createdAt instanceof Date;
  }
  var App = class {
    constructor() {
      this.userRepository = new Repository();
      this.apiService = new ApiService();
      this.eventEmitter = new EventEmitter();
      this.setupEventListeners();
    }
    setupEventListeners() {
      this.eventEmitter.on("userCreated", (user) => {
        console.log("\u2705 \u7528\u6237\u521B\u5EFA:", user.name);
      });
      this.eventEmitter.on("userUpdated", (user, updates) => {
        console.log("\u{1F4DD} \u7528\u6237\u66F4\u65B0:", user.name, updates);
      });
      this.eventEmitter.on("error", (error) => {
        console.error("\u274C \u9519\u8BEF:", error.message);
      });
    }
    // @log // 暂时注释装饰器，避免 isolatedModules 错误
    createUser(userData) {
      try {
        const user = UserEntity.createUser(userData);
        if (!user.validate()) {
          throw new Error("\u7528\u6237\u6570\u636E\u9A8C\u8BC1\u5931\u8D25");
        }
        this.userRepository.save(user);
        this.eventEmitter.emit("userCreated", user);
        return user;
      } catch (error) {
        this.eventEmitter.emit("error", error);
        throw error;
      }
    }
    // @log // 暂时注释装饰器，避免 isolatedModules 错误
    updateUser(id, updates) {
      try {
        const user = this.userRepository.findById(id);
        if (!user) {
          throw new Error(`\u7528\u6237\u4E0D\u5B58\u5728: ${id}`);
        }
        Object.assign(user, updates);
        if (!user.validate()) {
          throw new Error("\u66F4\u65B0\u540E\u7684\u7528\u6237\u6570\u636E\u9A8C\u8BC1\u5931\u8D25");
        }
        this.userRepository.save(user);
        this.eventEmitter.emit("userUpdated", user, updates);
        return user;
      } catch (error) {
        this.eventEmitter.emit("error", error);
        return null;
      }
    }
    getUsers() {
      return this.userRepository.findAll();
    }
    getUserById(id) {
      return this.userRepository.findById(id);
    }
    // 异步操作示例
    async syncWithServer() {
      try {
        console.log("\u{1F504} \u5F00\u59CB\u4E0E\u670D\u52A1\u5668\u540C\u6B65...");
        const response = await this.apiService.getUsers();
        if (response.success && Array.isArray(response.data)) {
          response.data.forEach((userData) => {
            if (isUser(userData)) {
              const user = new UserEntity(
                String(userData.id),
                userData.name,
                userData.email,
                userData.preferences,
                userData.age
              );
              this.userRepository.save(user);
            }
          });
          console.log(`\u2705 \u540C\u6B65\u5B8C\u6210: ${response.data.length} \u4E2A\u7528\u6237`);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        this.eventEmitter.emit("error", error);
      }
    }
  };
  async function demonstrateTypeScript() {
    console.log("\u{1F680} TypeScript \u7279\u6027\u6F14\u793A\u5F00\u59CB");
    const app = new App();
    const user1 = app.createUser({
      name: "\u5F20\u4E09",
      email: "zhangsan@example.com",
      age: 30,
      preferences: createDefaultPreferences()
    });
    const user2 = app.createUser({
      name: "\u674E\u56DB",
      email: "lisi@example.com",
      preferences: {
        theme: "dark",
        language: "en-US",
        notifications: {
          email: false,
          push: true
        }
      }
    });
    console.log("\u{1F465} \u521B\u5EFA\u7684\u7528\u6237:", app.getUsers().map((u) => u.name));
    app.updateUser(user1.getId(), {
      name: "\u5F20\u4E09\u4E30",
      preferences: {
        theme: "dark",
        language: "zh-CN",
        notifications: {
          email: true,
          push: true,
          sms: true
        }
      }
    });
    console.log("\u{1F4DD} \u66F4\u65B0\u540E\u7684\u7528\u6237:", app.getUserById(user1.getId())?.name);
    console.log("\u{1F4CA} TypeScript \u7F16\u8BD1\u4FE1\u606F:");
    console.log("- \u6240\u6709\u7C7B\u578B\u68C0\u67E5\u90FD\u5728\u7F16\u8BD1\u65F6\u5B8C\u6210");
    console.log("- ESBuild \u79FB\u9664\u4E86\u6240\u6709\u7C7B\u578B\u6CE8\u89E3");
    console.log("- \u4FDD\u7559\u4E86\u8FD0\u884C\u65F6\u7684 JavaScript \u903B\u8F91");
    console.log("- \u652F\u6301\u6700\u65B0\u7684 TypeScript \u7279\u6027");
    return Promise.resolve();
  }
  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", async () => {
      const container = document.createElement("div");
      container.style.cssText = `
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    `;
      container.innerHTML = `
      <h1 style="text-align: center; margin-bottom: 30px;">
        \u{1F537} ESBuild TypeScript \u652F\u6301\u6F14\u793A
      </h1>
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2>\u{1F3AF} TypeScript \u7279\u6027</h2>
        <ul style="line-height: 1.8;">
          <li>\u2705 \u7C7B\u548C\u63A5\u53E3\u5B9A\u4E49</li>
          <li>\u2705 \u6CDB\u578B\u7F16\u7A0B</li>
          <li>\u2705 \u7C7B\u578B\u63A8\u65AD\u548C\u68C0\u67E5</li>
          <li>\u2705 \u88C5\u9970\u5668\u652F\u6301</li>
          <li>\u2705 \u679A\u4E3E\u548C\u8054\u5408\u7C7B\u578B</li>
          <li>\u2705 \u6A21\u5757\u5BFC\u5165\u5BFC\u51FA</li>
          <li>\u2705 \u5F02\u6B65/\u7B49\u5F85\u8BED\u6CD5</li>
          <li>\u2705 \u7C7B\u578B\u5B88\u536B\u548C\u65AD\u8A00</li>
        </ul>
      </div>
      <div id="output" style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
        <h2>\u{1F4CA} \u6267\u884C\u7ED3\u679C</h2>
        <p>\u6B63\u5728\u6267\u884C TypeScript \u6F14\u793A...</p>
      </div>
    `;
      document.body.appendChild(container);
      try {
        await demonstrateTypeScript();
        const outputDiv = document.getElementById("output");
        outputDiv.innerHTML = `
        <h2>\u{1F4CA} \u6267\u884C\u7ED3\u679C</h2>
        <p style="color: #00ff88; font-weight: bold;">\u2705 TypeScript \u6F14\u793A\u5B8C\u6210\uFF01</p>
        <p>\u8BF7\u6253\u5F00\u6D4F\u89C8\u5668\u63A7\u5236\u53F0\u67E5\u770B\u8BE6\u7EC6\u8F93\u51FA</p>
        <div style="margin-top: 15px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 5px;">
          <h3>\u{1F527} \u6784\u5EFA\u547D\u4EE4</h3>
          <pre style="margin: 10px 0; color: #ffd700;">npm run build:ts</pre>
          <p style="font-size: 0.9em;">ESBuild \u81EA\u52A8\u5904\u7406 TypeScript \u7F16\u8BD1\uFF0C\u65E0\u9700\u989D\u5916\u914D\u7F6E\uFF01</p>
        </div>
      `;
      } catch (error) {
        const outputDiv = document.getElementById("output");
        outputDiv.innerHTML = `
        <h2>\u{1F4CA} \u6267\u884C\u7ED3\u679C</h2>
        <p style="color: #ff6b6b; font-weight: bold;">\u274C \u6267\u884C\u51FA\u9519: ${error.message}</p>
      `;
      }
    });
  }
})();
