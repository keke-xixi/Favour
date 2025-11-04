import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'),  // 设置 `@` 指向 `src` 目录
    },
    extensions: ['.js', '.vue', '.json','.ts','.css']
  },
  server: {
    host: '127.0.0.1', // 推荐使用这个配置
    port: 8080,
    strictPort: false,
    open: true, // 可选：自动在浏览器打开
    cors: true, // 可选：启用 CORS
  }
});