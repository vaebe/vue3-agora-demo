/// <reference types="vite/client" />
declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const componentOptions: ComponentOptions
  export default componentOptions
}

declare module 'element-plus/dist/locale/*.mjs' {
  const locale: any
  export default locale
}
