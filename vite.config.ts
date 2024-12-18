import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 注册更新模式方式  默认是autoUpdate，将会自动更新，其他还有prompt和skipWaiting
      injectRegister: 'auto', // 控制如何在应用程序中注册ServiceWorker 默认值是 'auto' ，其他如：'inline' 则是注入一个简单的注册脚本，内联在应用程序入口点中
      manifest: { // manifest.json 文件配置
        name: 'Simple Private Group Chat',
        short_name: 'Whisper',
        description: 'Simple Private Group Chat',
        theme_color: '#ffffff',
        start_url: "/login",
        icons: [
          {
            src: 'favicon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    // createHtmlPlugin({
    //   minify: true, // 可选：压缩 HTML
    //   inject: {
    //     // 在 <head> 中注入 manifest.json 的 <link> 标签
    //     tags: [
    //       {
    //         tag: 'link',
    //         attrs: {
    //           rel: 'manifest',
    //           href: '/manifest.json',
    //         },
    //       },
    //     ],
    //   },
    // }),
  ],
})
