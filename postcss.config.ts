/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = {
  plugins: [
    require('autoprefixer'),
    // require('postcss-pxtorem')({
    //   rootValue({ file }) {
    //     // 根据不同的文件路径设置不同的 rootValue
    //     // if (file.includes('vant')) {
    //     //   return 75 // 例如，如果文件路径中包含 'vant'，使用 37.5
    //     // }
    //     return 37.5 // 默认值
    //   },
    //   unitPrecision: 5, // 转换后的精度，保留小数点后 5 位
    //   propList: ['*'], // 需要转换的属性列表，* 代表所有属性都转换
    //   selectorBlackList: ['--el', '.el-', '.no-chang'], // 不进行转换的选择器（例如 `.no-rem` 会被忽略）
    //   replace: false, // 是否直接替换 px 为 rem
    //   mediaQuery: false, // 是否转换媒体查询中的 px
    //   minPixelValue: 0, // 小于该值的 px 单位不会被转换
    //   exclude: '/node_modules|index\.html',
    // }),
  ],
}
