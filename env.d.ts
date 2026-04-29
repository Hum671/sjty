/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_NAME: string // 添加你自定义的环境变量
  VITE_APP_WEB_HOST: string
  // 其他的自定义环境变量也可以在这里声明
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
