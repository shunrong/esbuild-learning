// React JSX 演示
// 展示 ESBuild 如何处理 React 和 JSX 语法

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// 函数组件示例
const WelcomeMessage = ({ name, age }) => {
  return (
    <div className="welcome-message">
      <h2>欢迎, {name}!</h2>
      {age && <p>年龄: {age} 岁</p>}
    </div>
  );
};

// 类组件示例
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.initialValue || 0,
      history: []
    };
  }
  
  componentDidMount() {
    console.log('Counter 组件已挂载');
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      console.log(`计数从 ${prevState.count} 变为 ${this.state.count}`);
    }
  }
  
  handleIncrement = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
      history: [...prevState.history, `+1 在 ${new Date().toLocaleTimeString()}`]
    }));
  }
  
  handleDecrement = () => {
    this.setState(prevState => ({
      count: prevState.count - 1,
      history: [...prevState.history, `-1 在 ${new Date().toLocaleTimeString()}`]
    }));
  }
  
  handleReset = () => {
    this.setState({
      count: 0,
      history: [...this.state.history, `重置 在 ${new Date().toLocaleTimeString()}`]
    });
  }
  
  render() {
    const { count, history } = this.state;
    const { title } = this.props;
    
    return (
      <div className="counter">
        <h3>{title}</h3>
        <div className="counter-display">
          <span className="count">{count}</span>
        </div>
        <div className="counter-controls">
          <button onClick={this.handleDecrement}>-</button>
          <button onClick={this.handleReset}>重置</button>
          <button onClick={this.handleIncrement}>+</button>
        </div>
        {history.length > 0 && (
          <div className="history">
            <h4>操作历史:</h4>
            <ul>
              {history.slice(-5).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

// Hooks 示例
const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
  
  // 使用 useCallback 优化性能
  const addTodo = useCallback(() => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputValue('');
    }
  }, [inputValue]);
  
  const toggleTodo = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);
  
  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);
  
  // 使用 useMemo 计算过滤后的待办事项
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'pending':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
  
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [todos]);
  
  // 处理键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };
  
  return (
    <div className="todo-app">
      <h3>📝 待办事项应用</h3>
      
      {/* 输入区域 */}
      <div className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入新的待办事项..."
        />
        <button onClick={addTodo}>添加</button>
      </div>
      
      {/* 过滤器 */}
      <div className="todo-filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          全部 ({stats.total})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          未完成 ({stats.pending})
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          已完成 ({stats.completed})
        </button>
      </div>
      
      {/* 待办事项列表 */}
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            {filter === 'all' ? '还没有待办事项' : `没有${filter === 'completed' ? '已完成' : '未完成'}的事项`}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

// 拆分的子组件
const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className="todo-text">{todo.text}</span>
      <span className="todo-date">
        {todo.createdAt.toLocaleDateString()}
      </span>
      <button 
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
      >
        删除
      </button>
    </div>
  );
});

// 自定义 Hook 示例
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`读取 localStorage 失败:`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`保存到 localStorage 失败:`, error);
    }
  }, [key]);
  
  return [storedValue, setValue];
};

// 使用自定义 Hook 的组件
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, [setTheme]);
  
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);
  
  return (
    <div className={`theme-provider theme-${theme}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          🌓 切换主题 ({theme === 'light' ? '浅色' : '深色'})
        </button>
      </div>
      {children}
    </div>
  );
};

// 主应用组件
const App = () => {
  const [user] = useState({
    name: 'ESBuild 学习者',
    age: 25
  });
  
  return (
    <ThemeProvider>
      <div className="app">
        <header className="app-header">
          <h1>🚀 ESBuild React/JSX 演示</h1>
          <WelcomeMessage name={user.name} age={user.age} />
        </header>
        
        <main className="app-main">
          <div className="demo-section">
            <Counter title="🔢 类组件计数器" initialValue={0} />
          </div>
          
          <div className="demo-section">
            <TodoApp />
          </div>
          
          <div className="demo-section">
            <div className="info-box">
              <h3>✨ React 特性演示</h3>
              <ul>
                <li>✅ 函数组件和类组件</li>
                <li>✅ useState, useEffect, useCallback, useMemo</li>
                <li>✅ 自定义 Hooks</li>
                <li>✅ React.memo 性能优化</li>
                <li>✅ 条件渲染和列表渲染</li>
                <li>✅ 事件处理和表单处理</li>
                <li>✅ 组件间通信</li>
                <li>✅ 本地存储集成</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

// 渲染应用
if (typeof document !== 'undefined') {
  const container = document.getElementById('root') || document.body;
  const root = createRoot(container);
  root.render(<App />);
  
  console.log('🎉 React 应用已启动！');
  console.log('📦 ESBuild 处理了所有 JSX 语法');
  console.log('⚡ 构建速度极快，开发体验流畅');
}

export default App;
