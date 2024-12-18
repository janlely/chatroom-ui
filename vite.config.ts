import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true, // 可选：压缩 HTML
      inject: {
        // 在 <head> 中注入 manifest.json 的 <link> 标签
        tags: [
          {
            tag: 'link',
            attrs: {
              rel: 'manifest',
              href: '/manifest.json',
            },
          },
        ],
      },
    }),
  ],
})
