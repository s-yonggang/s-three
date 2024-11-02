// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/demo/s-three/node_modules/.pnpm/vite@5.4.10_@types+node@20.17.1_terser@5.36.0/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/demo/s-three/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.10_@types+node@20.17.1_terser@5.36.0__vue@3.5.12_typescript@5.5.4_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/demo/s-three/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.0.1_vite@5.4.10_@types+node@20.17.1_terser@5.36.0__vue@3.5.12_typescript@5.5.4_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { createHtmlPlugin } from "file:///D:/demo/s-three/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.4.10_@types+node@20.17.1_terser@5.36.0_/node_modules/vite-plugin-html/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/demo/s-three/vite.config.ts";
var vite_config_default = defineConfig({
  base: "/s-three/",
  plugins: [
    vue(),
    vueJsx(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: "Magic-Canvas"
        }
      }
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    host: true,
    port: 5177
  },
  build: {
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true
      }
    },
    // 关闭文件计算
    reportCompressedSize: true,
    // 关闭生成map文件 可以达到缩小打包体积
    sourcemap: true
    // 这个生产环境一定要关闭，不然打包的产物会很大
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxkZW1vXFxcXHMtdGhyZWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGRlbW9cXFxccy10aHJlZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovZGVtby9zLXRocmVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1odG1sJ1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6ICcvcy10aHJlZS8nLFxuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgdnVlSnN4KCksXG4gICAgY3JlYXRlSHRtbFBsdWdpbih7XG4gICAgICBtaW5pZnk6IHRydWUsXG4gICAgICBpbmplY3Q6IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHRpdGxlOiAnTWFnaWMtQ2FudmFzJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxuICAgIH1cbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogdHJ1ZSxcbiAgICBwb3J0OiA1MTc3LFxuICB9LFxuICBidWlsZDoge1xuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIC8vXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU2NUY2XHU3OUZCXHU5NjY0Y29uc29sZVxuICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gXHU1MTczXHU5NUVEXHU2NTg3XHU0RUY2XHU4QkExXHU3Qjk3XG4gICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IHRydWUsXG4gICAgLy8gXHU1MTczXHU5NUVEXHU3NTFGXHU2MjEwbWFwXHU2NTg3XHU0RUY2IFx1NTNFRlx1NEVFNVx1OEZCRVx1NTIzMFx1N0YyOVx1NUMwRlx1NjI1M1x1NTMwNVx1NEY1M1x1NzlFRlxuICAgIHNvdXJjZW1hcDogdHJ1ZSwgLy8gXHU4RkQ5XHU0RTJBXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU0RTAwXHU1QjlBXHU4OTgxXHU1MTczXHU5NUVEXHVGRjBDXHU0RTBEXHU3MTM2XHU2MjUzXHU1MzA1XHU3Njg0XHU0RUE3XHU3MjY5XHU0RjFBXHU1Rjg4XHU1OTI3XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFPLFNBQVMsZUFBZSxXQUFXO0FBRXhRLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsU0FBUyx3QkFBd0I7QUFMMEcsSUFBTSwyQ0FBMkM7QUFRNUwsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsaUJBQWlCO0FBQUEsTUFDZixRQUFRO0FBQUEsTUFDUixRQUFRO0FBQUEsUUFDTixNQUFNO0FBQUEsVUFDSixPQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQTtBQUFBLFFBRVIsY0FBYztBQUFBLFFBQ2QsZUFBZTtBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxzQkFBc0I7QUFBQTtBQUFBLElBRXRCLFdBQVc7QUFBQTtBQUFBLEVBQ2I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
