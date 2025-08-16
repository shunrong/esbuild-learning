// TypeScript 应用演示
// 展示 ESBuild 如何处理 TypeScript 代码

import { 
  User, 
  UserPreferences, 
  ApiResponse, 
  PaginatedResponse,
  HTTPMethod,
  UserUpdate
} from './types.js';

// 类的定义和继承
abstract class BaseEntity {
  protected readonly id: string;
  protected createdAt: Date;
  
  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date();
  }
  
  abstract validate(): boolean;
  
  public getId(): string {
    return this.id;
  }
  
  public getAge(): number {
    return Date.now() - this.createdAt.getTime();
  }
}

// 实现抽象类
class UserEntity extends BaseEntity implements Omit<User, 'id' | 'createdAt'> {
  public readonly id: string;
  public name: string;
  public email: string;
  public age?: number;
  public preferences: UserPreferences;
  public createdAt: Date;
  
  constructor(
    id: string,
    name: string,
    email: string,
    preferences: UserPreferences,
    age?: number
  ) {
    super(id);
    this.id = id;
    this.name = name;
    this.email = email;
    this.age = age;
    this.preferences = preferences;
    this.createdAt = new Date();
  }
  
  public validate(): boolean {
    return this.name.length > 0 && 
           this.email.includes('@') && 
           (this.age === undefined || this.age > 0);
  }
  
  public updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
  }
  
  // 静态方法
  static createUser(data: Omit<User, 'id' | 'createdAt'>): UserEntity {
    const id = Math.random().toString(36).substr(2, 9);
    return new UserEntity(id, data.name, data.email, data.preferences, data.age);
  }
}

// 泛型类
class Repository<T extends BaseEntity> {
  private items: Map<string, T> = new Map();
  
  public save(entity: T): void {
    this.items.set(entity.getId(), entity);
  }
  
  public findById(id: string): T | undefined {
    return this.items.get(id);
  }
  
  public findAll(): T[] {
    return Array.from(this.items.values());
  }
  
  public delete(id: string): boolean {
    return this.items.delete(id);
  }
  
  public count(): number {
    return this.items.size;
  }
  
  // 泛型方法
  public findWhere<K extends keyof T>(
    property: K, 
    value: T[K]
  ): T[] {
    return this.findAll().filter(item => item[property] === value);
  }
}

// API 服务类
class ApiService {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }
  
  // 泛型异步方法
  public async request<T>(
    method: HTTPMethod,
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(data && { body: JSON.stringify(data) }),
      });
      
      const result = await response.json();
      
      return {
        success: response.ok,
        data: result,
        message: response.ok ? 'Success' : 'Request failed',
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        data: null as T,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }
  
  // 具体的 API 方法
  public async getUsers(): Promise<PaginatedResponse<User>> {
    const response = await this.request<User[]>('GET', '/users');
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
  
  public async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<User>('GET', `/users/${id}`);
  }
  
  public async updateUser(id: string, updates: UserUpdate): Promise<ApiResponse<User>> {
    return this.request<User>('PUT', `/users/${id}`, updates);
  }
}

// 事件处理器
class EventEmitter<T extends Record<string, any[]> = Record<string, any[]>> {
  private listeners: Map<keyof T, Function[]> = new Map();
  
  public on<K extends keyof T>(
    event: K, 
    listener: (...args: T[K]) => void
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }
  
  public emit<K extends keyof T>(event: K, ...args: T[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(...args));
    }
  }
  
  public off<K extends keyof T>(
    event: K, 
    listener: (...args: T[K]) => void
  ): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }
}

// 事件类型定义
interface AppEvents extends Record<string, any[]> {
  userCreated: [UserEntity];
  userUpdated: [UserEntity, UserUpdate];
  error: [Error];
}

// 工具函数
function createDefaultPreferences(): UserPreferences {
  return {
    theme: 'light',
    language: 'zh-CN',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  };
}

// 类型守卫
function isUser(obj: any): obj is User {
  return obj && 
         typeof obj.id === 'string' && 
         typeof obj.name === 'string' && 
         typeof obj.email === 'string' &&
         obj.preferences &&
         obj.createdAt instanceof Date;
}

// 装饰器示例 (需要 experimentalDecorators: true)
function log(target: any, propertyName: string, descriptor?: PropertyDescriptor) {
  if (descriptor) {
    const method = descriptor.value;
    descriptor.value = function(...args: any[]) {
      console.log(`调用方法: ${propertyName}`, args);
      const result = method.apply(this, args);
      console.log(`方法结果: ${propertyName}`, result);
      return result;
    };
  }
  return descriptor;
}

// 应用主类
class App {
  private userRepository: Repository<UserEntity>;
  private apiService: ApiService;
  private eventEmitter: EventEmitter<AppEvents>;
  
  constructor() {
    this.userRepository = new Repository<UserEntity>();
    this.apiService = new ApiService();
    this.eventEmitter = new EventEmitter<AppEvents>();
    
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    this.eventEmitter.on('userCreated', (user) => {
      console.log('✅ 用户创建:', user.name);
    });
    
    this.eventEmitter.on('userUpdated', (user, updates) => {
      console.log('📝 用户更新:', user.name, updates);
    });
    
    this.eventEmitter.on('error', (error) => {
      console.error('❌ 错误:', error.message);
    });
  }
  
  // @log // 暂时注释装饰器，避免 isolatedModules 错误
  public createUser(userData: Omit<User, 'id' | 'createdAt'>): UserEntity {
    try {
      const user = UserEntity.createUser(userData);
      
      if (!user.validate()) {
        throw new Error('用户数据验证失败');
      }
      
      this.userRepository.save(user);
      this.eventEmitter.emit('userCreated', user);
      
      return user;
    } catch (error) {
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }
  
  // @log // 暂时注释装饰器，避免 isolatedModules 错误
  public updateUser(id: string, updates: UserUpdate): UserEntity | null {
    try {
      const user = this.userRepository.findById(id);
      if (!user) {
        throw new Error(`用户不存在: ${id}`);
      }
      
      // 应用更新
      Object.assign(user, updates);
      
      if (!user.validate()) {
        throw new Error('更新后的用户数据验证失败');
      }
      
      this.userRepository.save(user);
      this.eventEmitter.emit('userUpdated', user, updates);
      
      return user;
    } catch (error) {
      this.eventEmitter.emit('error', error as Error);
      return null;
    }
  }
  
  public getUsers(): UserEntity[] {
    return this.userRepository.findAll();
  }
  
  public getUserById(id: string): UserEntity | undefined {
    return this.userRepository.findById(id);
  }
  
  // 异步操作示例
  public async syncWithServer(): Promise<void> {
    try {
      console.log('🔄 开始与服务器同步...');
      
      const response = await this.apiService.getUsers();
      
      if (response.success && Array.isArray(response.data)) {
        response.data.forEach(userData => {
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
        
        console.log(`✅ 同步完成: ${response.data.length} 个用户`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      this.eventEmitter.emit('error', error as Error);
    }
  }
}

// 演示函数
export async function demonstrateTypeScript(): Promise<void> {
  console.log('🚀 TypeScript 特性演示开始');
  
  const app = new App();
  
  // 创建用户
  const user1 = app.createUser({
    name: '张三',
    email: 'zhangsan@example.com',
    age: 30,
    preferences: createDefaultPreferences()
  });
  
  const user2 = app.createUser({
    name: '李四',
    email: 'lisi@example.com',
    preferences: {
      theme: 'dark',
      language: 'en-US',
      notifications: {
        email: false,
        push: true
      }
    }
  });
  
  console.log('👥 创建的用户:', app.getUsers().map(u => u.name));
  
  // 更新用户
  app.updateUser(user1.getId(), {
    name: '张三丰',
    preferences: {
      theme: 'dark',
      language: 'zh-CN',
      notifications: {
        email: true,
        push: true,
        sms: true
      }
    }
  });
  
  console.log('📝 更新后的用户:', app.getUserById(user1.getId())?.name);
  
  // 显示类型信息
  console.log('📊 TypeScript 编译信息:');
  console.log('- 所有类型检查都在编译时完成');
  console.log('- ESBuild 移除了所有类型注解');
  console.log('- 保留了运行时的 JavaScript 逻辑');
  console.log('- 支持最新的 TypeScript 特性');
  
  return Promise.resolve();
}

// 页面初始化
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    // 创建 UI
    const container = document.createElement('div');
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
        🔷 ESBuild TypeScript 支持演示
      </h1>
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2>🎯 TypeScript 特性</h2>
        <ul style="line-height: 1.8;">
          <li>✅ 类和接口定义</li>
          <li>✅ 泛型编程</li>
          <li>✅ 类型推断和检查</li>
          <li>✅ 装饰器支持</li>
          <li>✅ 枚举和联合类型</li>
          <li>✅ 模块导入导出</li>
          <li>✅ 异步/等待语法</li>
          <li>✅ 类型守卫和断言</li>
        </ul>
      </div>
      <div id="output" style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
        <h2>📊 执行结果</h2>
        <p>正在执行 TypeScript 演示...</p>
      </div>
    `;
    
    document.body.appendChild(container);
    
    try {
      await demonstrateTypeScript();
      const outputDiv = document.getElementById('output')!;
      outputDiv.innerHTML = `
        <h2>📊 执行结果</h2>
        <p style="color: #00ff88; font-weight: bold;">✅ TypeScript 演示完成！</p>
        <p>请打开浏览器控制台查看详细输出</p>
        <div style="margin-top: 15px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 5px;">
          <h3>🔧 构建命令</h3>
          <pre style="margin: 10px 0; color: #ffd700;">npm run build:ts</pre>
          <p style="font-size: 0.9em;">ESBuild 自动处理 TypeScript 编译，无需额外配置！</p>
        </div>
      `;
    } catch (error) {
      const outputDiv = document.getElementById('output')!;
      outputDiv.innerHTML = `
        <h2>📊 执行结果</h2>
        <p style="color: #ff6b6b; font-weight: bold;">❌ 执行出错: ${(error as Error).message}</p>
      `;
    }
  });
}