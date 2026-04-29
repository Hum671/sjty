import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Inspect from 'vite-plugin-inspect'
import { VantResolver } from '@vant/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env,
  },
  server: {
    host: '0.0.0.0',
    port: 5170,
    proxy: {
      '^/api': {
        target: 'http://api.sjmg36.com', // 测试地址
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
    VueSetupExtend(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
      include: ['/src', /\.[tj]sx?$/, /.vue$/, /.md$/],
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      // 配置自动导入
      dirs: ['src'], // 自动导入的组件目录
      extensions: ['vue'], // 只导入 .vue 文件
      deep: true, // 是否递归子目录
      resolvers: [
        ElementPlusResolver(),
        VantResolver(),
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],
      dts: 'src/components.d.ts',
    }),
    Icons({
      autoInstall: true,
    }),
    Inspect(), // 启用 Inspect 插件
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'verdor'
          }
        },
      },
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.vue', '.json', '.html'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: './postcss.config.ts', // 确保 PostCSS 配置文件正确加载
    preprocessorOptions: {
      less: {
        javascriptEnable: true,
        additionalData: `@import "${path.resolve(__dirname, 'src/assets/variables.less')}";`,
      },
    },
  },
})
