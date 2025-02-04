import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createHtmlPlugin } from 'vite-plugin-html'
import glsl from 'vite-plugin-glsl'; // 支持 shader 的插件

// https://vite.dev/config/
export default defineConfig({
  base: '/s-three/',
  plugins: [
    glsl({
      include: [                   // Glob pattern, or array of glob patterns to import
        '**/*.glsl', '**/*.wgsl',
        '**/*.vert', '**/*.frag',
        '**/*.vs', '**/*.fs'
      ],
      exclude: undefined,          // Glob pattern, or array of glob patterns to ignore
      warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
      defaultExtension: 'glsl',    // Shader suffix when no extension is specified
      compress: false,             // Compress output shader code
      watch: true,                 // Recompile shader on change
      root: '/'                    // Directory for root imports
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Magic-Canvas'
        }
      }
    }),
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 5177,
  },
  build: {
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 关闭文件计算
    // reportCompressedSize: true,
    // 关闭生成map文件 可以达到缩小打包体积
    // sourcemap: true, // 这个生产环境一定要关闭，不然打包的产物会很大
  }
})
