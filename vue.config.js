const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  /**
   * 解决跨域问题
   */
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost/taxi', // 后端服务地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'  // 重写路径，将 /api 替换为空
        }
      }
    }
  }

})
