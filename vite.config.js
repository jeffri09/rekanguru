import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/qwen': {
        target: 'https://dashscope-intl.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/qwen/, '/compatible-mode/v1'),
      },
    },
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
  },
});
