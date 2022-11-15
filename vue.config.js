const { defineConfig } = require('@vue/cli-service')
const getProxy = require('./build/proxy')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    https: true,
    ...getProxy()
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true, // 开启 CSS source maps?
    sourceMap: false, // css预设器配置项
    loaderOptions: {
      // 如发现 css.modules 报错，请查看这里：http://www.web-jshtml.cn/#/detailed?id=12
      scss: {
        additionalData: '@import "./src/styles/variables.scss";' // 引入全局变量
      }
    }
  }
})
