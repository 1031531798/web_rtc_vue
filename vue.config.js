const { defineConfig } = require('@vue/cli-service')
const getProxy = require('./build/proxy')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: getProxy(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  }
})
