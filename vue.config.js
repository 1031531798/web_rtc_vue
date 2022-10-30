// import { defineConfig } from '@vue/cli-service'
const { defineConfig } = require('@vue/cli-service')
const getProxy = require('./build/proxy')
console.log(getProxy())
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: getProxy()
})
