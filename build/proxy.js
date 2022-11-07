function getProxy () {
  let proxys = process.env.VUE_APP_PROXY.replace(/\\n/g, '\n')
  try {
    proxys = JSON.parse(proxys)
  } catch (error) {}
  const proxy = {

  }
  for (const [prefix, target] of proxys) {
    if (prefix && target) {
      proxy[prefix] = {
        target,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          [`^${prefix}`]: ''
        }
      }
    }
  }
  return {
    proxy
  }
}
module.exports = getProxy
