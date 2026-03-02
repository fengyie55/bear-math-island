import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,js,vue}'],
      exclude: ['src/**/*.d.ts', 'src/main.ts']
    }
  }
})
