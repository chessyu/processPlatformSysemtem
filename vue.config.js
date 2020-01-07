
const path = require('path')


let node_env = process.env.NODE_ENV === 'production';

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: node_env?'./': '/',
  outputDir: 'dist', // 打包生成的生产环境构建文件的目录
  assetsDir: 'assets', // 放置生成的静态资源路径，默认在outputDir
  indexPath: 'index.html', // 指定生成的 index.html 输入路径，默认outputDir
  productionSourceMap: node_env, // 开启 生产环境的 source map?
  lintOnSave: false,
  css: { // 配置css模块
    loaderOptions: { // 向预处理器 Loader 传递配置选项
        less: { // 配置less（其他样式解析用法一致）
          javascriptEnabled: true, // 设置为true
        }
    },
    sourceMap: true,
    extract: true
  },
  chainWebpack: config => {
    // 配置路径别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('C',resolve('src/types/components'))
  },
  devServer: {
    host:'0.0.0.0',
    port: 1025, // 端口
    proxy:{
      [process.env.VUE_APP_BASE_API]:{
        target:'http://m2-dev.hhycdk.com/api/',
        changeOrigin:true,
        ws:true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '',//重写,
        }
      }
    }
  }
}