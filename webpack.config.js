var webpack = require('webpack'),
    glob = require('glob'),
    path = require('path'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    // ExtractTextPlugin = require("extract-text-webpack-plugin"),
    FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

function pathJoin (dir) {
  return path.join(__dirname, './', dir)
}

var webpackConfig = {
  context: __dirname,
  entry: {
    
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.scss', '.html'],
    alias: {
      '@': pathJoin('src')
    }
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
        // use: ExtractTextPlugin.extract({
        //   fallback: 'style-loader',
        //   use: ['css-loader', 'sass-loader']
        // })
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ["transform-runtime"]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CopyWebpackPlugin([
      { from: './src/basic', to: './basic'}
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "./basic/commons.js"
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new ExtractTextPlugin("./css/style.css",{
    //   // allChunks: true
    // }),
    new FriendlyErrorsWebpackPlugin()
  ]
  // ,
  // devServer: {
  //   contentBase: pathJoin('dist'),
  //   hot: true,
  //   quiet: true
  // }
};

// 获取指定路径下的入口文件
function getEntries(globPath) {
  var files = glob.sync(globPath),
      entries = {};

  files.forEach(function(filepath) {
    //
    var name = filepath.split('.')[0].replace('src/', ''); //去掉src和.js
    entries[name] = './' + filepath;
  });
  return entries;
}

var entries = getEntries('src/pages/**/*.js');

Object.keys(entries).forEach(function(name) {
  webpackConfig.entry[name] = [entries[name]];
  // 每个页面生成一个html
  var path = name.split('/'),
      plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: './html/'+ path[1] + '.html',
        // 每个html的模版，先查找本页有没有模版文件，没有则使用根目录下的index.html
        template: glob.sync('./src/'+path[0]+'/'+path[1]+'/index.html')[0] || './index.html',
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [name]
      });
  webpackConfig.plugins.push(plugin);
});

if(process.env.npm_lifecycle_event === 'build'){
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }))
}
else{
  webpackConfig.devtool = '#source-map';
}
// console.log(webpackConfig.plugins);
module.exports = webpackConfig;