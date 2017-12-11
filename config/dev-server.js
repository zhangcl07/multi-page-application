const webpack = require('webpack'),
    express = require('express'),
    opn = require('opn'),
    devConfig = require('./dev-config'),
    WebpackDevServer = require('webpack-dev-server'),// https://github.com/webpack/webpack-dev-middleware
    webpackConfig = require("./../webpack.config.js"),
    proxyMiddleware = require('http-proxy-middleware');//https://github.com/chimurai/http-proxy-middleware

for(var key in webpackConfig.entry){
  webpackConfig.entry[key].push('./config/dev-client');
}
// console.log(webpackConfig);
// const app = express();

const compiler = webpack(webpackConfig);

const app = new WebpackDevServer(compiler, {
  contentBase: devConfig.contentBase,
  publicPath: webpackConfig.output.publicPath,
  hot: true
});

// 接口代理
Object.keys(devConfig.proxyMap).forEach(function (context) {
  var options = devConfig.proxyMap[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(context, proxyMiddleware(options))
})

// https://webpack.js.org/guides/development/#webpack-dev-middleware
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
  quiet: true
})
// 开启 hot-reload and state-preserving 
// https://github.com/glenjamin/webpack-hot-middleware
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})

// 当html-webpack-plugin模版更新时，刷新页面
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

app.use(devMiddleware)
app.use(hotMiddleware)

const uri = devConfig.host+':'+devConfig.port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at '+ uri +' \n')
  opn(uri)
})

app.listen(devConfig.port);