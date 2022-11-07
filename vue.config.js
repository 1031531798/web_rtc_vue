const { defineConfig } = require('@vue/cli-service')
const getProxy = require('./build/proxy')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    https: true,
    ...getProxy()
  }
})
