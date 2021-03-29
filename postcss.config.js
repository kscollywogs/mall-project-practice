module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport': {
      // 视窗的宽度，对应的是设计稿的宽度
      viewportWidth: 375,
      // 视窗的高度，对应设计稿的高度
      viewportHeight: 667,
      // 指定'px'转换为视窗单位值的小数位数(多情况无法整除)
      unitPrecision: 5,
      // 指定需要转换的视窗单位,一般用vw
      viewportUnit: 'vw',
      // 指定不需要转换的类
      selectorBlackList: ['ignore', 'tab-bar', 'tab-bar-item'],
      // 小于或等于1px不转换为视窗单位
      minPixelValue: 1,
      // 允许在媒体查询中转换px
      mediaQuery: false,
      exclude: [/TabBar.vue$/]
    }
  }
}
/**
 * 在js中使用正则 /正则相关规则/
 * exclude中存放的元素必须是正则表达式
 * 按照派出的文件写对应的正则
 * 正则的规则：
 * ^abc 表示匹配的内容必须以对应内容开头
 * abc$ 表示必须以对应内容结尾
 */
