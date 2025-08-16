// TypeScript 类型定义文件
// 展示 ESBuild 如何处理 TypeScript 类型

// 基础类型别名
export type ID = string | number;
export type Status = 'pending' | 'completed' | 'failed';

// 接口定义
export interface User {
  readonly id: ID;
  name: string;
  email: string;
  age?: number; // 可选属性
  preferences: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms?: boolean;
  };
}

// 泛型接口
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 函数类型
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncHandler<T, R> = (input: T) => Promise<R>;
export type Validator<T> = (value: T) => boolean | string;

// 工具类型示例
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type UserUpdate = Partial<Pick<User, 'name' | 'email' | 'preferences'>>;

// 联合类型和交叉类型
export type Theme = 'light' | 'dark';
export type Size = 'small' | 'medium' | 'large';

export interface ButtonProps {
  children: string;
  onClick: EventHandler<MouseEvent>;
  disabled?: boolean;
}

export interface StyleProps {
  theme: Theme;
  size: Size;
}

export type StyledButtonProps = ButtonProps & StyleProps;

// 条件类型
export type NonNullable<T> = T extends null | undefined ? never : T;
export type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;

// 映射类型
export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// 字符串字面量类型
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type ContentType = 'application/json' | 'application/xml' | 'text/plain';

// 数字字面量类型
export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500;

// 模板字面量类型 (TS 4.1+)
export type EventName<T extends string> = `on${Capitalize<T>}`;
export type CSSProperty = `--${string}`;

// 递归类型
export interface TreeNode<T> {
  value: T;
  children?: TreeNode<T>[];
  parent?: TreeNode<T>;
}

// 函数重载类型
export interface Storage {
  getItem(key: string): string | null;
  getItem<T>(key: string, parser: (value: string) => T): T | null;
  setItem(key: string, value: string): void;
  setItem<T>(key: string, value: T, serializer: (value: T) => string): void;
}
