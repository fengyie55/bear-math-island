import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
    // 启用热更新
    hmr: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia'],
          chart: ['chart.js'],
          antd: ['ant-design-vue']
        }
      }
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 启用压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // 生成sourcemap，便于调试
    sourcemap: false,
    // 提高构建速度
    cache: true,
    // 限制并发数，避免内存溢出
    concurrency: 4
  },
  // 配置别名，方便导入
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'pinia', 'chart.js', 'ant-design-vue'],
    exclude: []
  }
})
