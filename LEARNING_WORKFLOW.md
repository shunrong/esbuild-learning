# ESBuild 学习工作流指南

## 🎯 如何有效使用演示进行学习

这份指南将告诉你如何系统地使用项目中的演示和文档来学习 ESBuild。

---

## 📖 学习步骤

### 第一步：理解演示的结构

每个演示都包含三个部分：
1. **配置展示** - 显示 ESBuild 配置
2. **对比说明** - 与 Webpack 的等价配置对比
3. **实际构建** - 运行构建并显示结果

### 第二步：学习方法

```bash
# 1. 运行演示
npm run config:basic

# 2. 查看生成的文件
ls -la dist/config-demo/

# 3. 检查文件内容
cat dist/config-demo/basic-bundle.js

# 4. 对比配置差异
# 查看 config-demo.js 中的配置定义
```

---

## 🔍 逐个演示学习指南

### 演示1: 基础配置 (`npm run config:basic`)

**学习重点**: ESBuild 最简配置 vs Webpack 配置复杂度

```bash
# 运行演示
npm run config:basic
```

**观察要点**:
1. 配置的简洁性对比
2. 构建速度差异
3. 生成文件大小

**深入学习**:
```bash
# 查看生成的文件
cat dist/config-demo/basic-bundle.js

# 查看源码映射
cat dist/config-demo/basic-bundle.js.map
```

**思考问题**:
- 为什么 ESBuild 配置这么简单？
- `format: 'iife'` 和 `globalName` 的作用是什么？
- 压缩效果如何？

### 演示2: 入口和输出 (`npm run config:entry`)

**学习重点**: 多入口配置和代码分割

```bash
# 运行演示
npm run config:entry

# 查看生成的多个文件
ls -la dist/config-demo/multi-entry/

# 查看代码分割效果
cat dist/config-demo/multi-entry/main.mjs
cat dist/config-demo/multi-entry/chunks/*.mjs
```

**观察要点**:
1. 多入口如何配置
2. 代码分割的效果
3. chunk 文件的命名规则

### 演示3: 平台配置 (`npm run config:platform`)

**学习重点**: 不同平台的构建差异

```bash
# 运行演示
npm run config:platform

# 对比不同平台的输出
cat dist/config-demo/platform-demo/browser-modern.js
cat dist/config-demo/platform-demo/node.js
cat dist/config-demo/platform-demo/library.js
```

**观察要点**:
1. 浏览器 vs Node.js 输出差异
2. ES5 转译的限制
3. 库模式的特点

### 演示4: 文件加载器 (`npm run config:loaders`)

**学习重点**: 不同加载器的处理方式

```bash
# 运行演示
npm run config:loaders

# 对比不同加载器的效果
cat dist/config-demo/loaders/file-loader.js
cat dist/config-demo/loaders/text-loader.js
cat dist/config-demo/loaders/json-loader.js
```

**观察要点**:
1. 文件如何被转换
2. 不同加载器的输出差异
3. 静态资源的处理方式

### 演示5: 环境配置 (`npm run config:env`)

**学习重点**: 开发 vs 生产环境的配置差异

```bash
# 运行演示
npm run config:env

# 对比不同环境的输出
cat dist/config-demo/environments/dev.js
cat dist/config-demo/environments/prod.js
cat dist/config-demo/environments/test.js
```

**观察要点**:
1. 开发环境保留了什么信息？
2. 生产环境如何优化？
3. 文件大小的差异

### 演示6: 代码转换 (`npm run config:transform`)

**学习重点**: transform API 的使用

```bash
# 运行演示
npm run config:transform
```

**观察要点**:
1. TypeScript 如何转换为 JavaScript
2. JSX 的两种转换模式差异
3. ES6+ 语法的降级限制

---

## 🔧 深度学习方法

### 方法1: 修改配置实验

1. **打开配置文件**:
```bash
# 编辑演示配置
code config-demo.js
```

2. **修改参数测试**:
```javascript
// 在 demoBasicConfig 函数中尝试修改
const esbuildConfig = {
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/config-demo/basic-bundle.js',
  format: 'esm',        // 改为 esm 试试
  // globalName: 'MyApp', // 注释掉这行
  minify: false,        // 关闭压缩
  sourcemap: false      // 关闭 sourcemap
};
```

3. **重新运行观察差异**:
```bash
npm run config:basic
cat dist/config-demo/basic-bundle.js
```

### 方法2: 对比学习

```bash
# 先运行一个配置
npm run config:basic

# 记录结果，然后运行另一个
npm run config:env

# 对比两者的差异
diff dist/config-demo/basic-bundle.js dist/config-demo/environments/dev.js
```

### 方法3: 源码追踪

```bash
# 查看演示的源码实现
code config-demo.js

# 找到对应的配置定义
# 理解每个参数的作用
```

---

## 📊 学习检查点

### 基础配置掌握度检查

完成以下任务来验证你的理解：

1. **配置转换练习**:
```javascript
// 将这个 Webpack 配置转换为 ESBuild
module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  mode: 'production'
};

// 你的 ESBuild 配置:
const config = {
  // 在这里写出等价配置
};
```

2. **多入口练习**:
```javascript
// 配置一个多入口的 React 应用
const config = {
  entryPoints: {
    // 主应用
    // 管理后台
    // 移动端页面
  },
  // 其他配置...
};
```

3. **平台适配练习**:
```javascript
// 为 Node.js CLI 工具配置构建
const nodeConfig = {
  // 在这里配置
};

// 为现代浏览器配置构建
const browserConfig = {
  // 在这里配置
};
```

---

## 🛠️ 实战练习项目

### 练习1: 创建自己的配置

1. **创建新的配置文件**:
```bash
# 创建你自己的配置文件
touch my-esbuild-config.js
```

2. **实现一个完整的 React 应用构建**:
```javascript
// my-esbuild-config.js
import { build } from 'esbuild';

const reactConfig = {
  entryPoints: ['src/react-app.jsx'],
  bundle: true,
  outfile: 'dist/my-react-app.js',
  // 添加你认为需要的配置
};

await build(reactConfig);
```

3. **测试你的配置**:
```bash
node my-esbuild-config.js
```

### 练习2: 性能对比测试

1. **创建性能测试脚本**:
```javascript
// 测量构建时间
const startTime = Date.now();
await build(yourConfig);
const buildTime = Date.now() - startTime;
console.log(`构建时间: ${buildTime}ms`);
```

2. **对比不同配置的性能**:
```bash
# 测试压缩 vs 不压缩
# 测试 sourcemap vs 无 sourcemap
# 测试不同 target 的影响
```

### 练习3: 插件开发

1. **创建一个简单的插件**:
```javascript
function myPlugin(options) {
  return {
    name: 'my-plugin',
    setup(build) {
      build.onStart(() => {
        console.log('开始构建...');
      });
      
      build.onEnd((result) => {
        console.log('构建完成!');
      });
    }
  };
}
```

2. **在配置中使用插件**:
```javascript
const config = {
  // ...其他配置
  plugins: [myPlugin({ /* 选项 */ })]
};
```

---

## 🎓 学习进度追踪

### 初级阶段 ✅
- [ ] 能运行基础演示并理解输出
- [ ] 理解 entry/output 配置
- [ ] 知道 bundle/minify/sourcemap 的作用
- [ ] 能对比 ESBuild 和 Webpack 的配置差异

### 中级阶段 🚀
- [ ] 能为不同平台配置构建
- [ ] 理解文件加载器的工作方式
- [ ] 能配置开发/生产环境
- [ ] 会使用 transform API

### 高级阶段 💪
- [ ] 能编写自定义插件
- [ ] 理解性能优化策略
- [ ] 能处理复杂的构建需求
- [ ] 能进行 Webpack 到 ESBuild 的迁移

---

## 💡 学习技巧

### 技巧1: 边运行边思考
不要只是运行命令，要思考：
- 为什么这样配置？
- 如果改变参数会怎样？
- 这个配置解决了什么问题？

### 技巧2: 对比实验
- 运行相同功能的不同配置
- 对比输出文件的差异
- 记录性能数据

### 技巧3: 查看生成文件
```bash
# 不要只看终端输出，要查看实际生成的文件
cat dist/config-demo/xxx.js
ls -la dist/config-demo/
```

### 技巧4: 修改和重试
- 修改配置参数
- 重新运行观察变化
- 理解每个参数的实际效果

---

## 📞 遇到问题时

1. **查看错误信息**: ESBuild 的错误信息通常很清晰
2. **检查文件路径**: 确保入口文件存在
3. **简化配置**: 从最简配置开始，逐步添加选项
4. **查看生成文件**: 确认输出是否符合预期

记住：学习构建工具最好的方法就是多实践、多对比、多思考！🚀
