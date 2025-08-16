// ESBuild 环境变量插件
// 自动注入环境变量和构建信息

export function envPlugin(options = {}) {
  return {
    name: 'env-plugin',
    setup(build) {
      const {
        prefix = 'VITE_', // 只处理特定前缀的环境变量
        includeNodeEnv = true,
        includeTimestamp = true,
        customVars = {}
      } = options;
      
      // 收集环境变量
      const envVars = {};
      
      // 添加 NODE_ENV
      if (includeNodeEnv) {
        envVars['process.env.NODE_ENV'] = JSON.stringify(process.env.NODE_ENV || 'development');
      }
      
      // 添加构建时间戳
      if (includeTimestamp) {
        envVars['process.env.BUILD_TIME'] = JSON.stringify(new Date().toISOString());
        envVars['process.env.BUILD_TIMESTAMP'] = JSON.stringify(Date.now());
      }
      
      // 添加以指定前缀开头的环境变量
      Object.keys(process.env).forEach(key => {
        if (key.startsWith(prefix)) {
          envVars[`process.env.${key}`] = JSON.stringify(process.env[key]);
        }
      });
      
      // 添加自定义变量
      Object.entries(customVars).forEach(([key, value]) => {
        envVars[key] = JSON.stringify(value);
      });
      
      // 合并到 define 选项
      build.initialOptions.define = {
        ...build.initialOptions.define,
        ...envVars
      };
      
      console.log('🌍 环境变量插件：已注入', Object.keys(envVars).length, '个变量');
    }
  };
}
