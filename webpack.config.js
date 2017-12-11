const webpack = require('webpack'),
    glob = require('glob'),
    path = require('path'),
    // CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin')
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'),
    HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin'),
    vueLoaderConfig = require('./config/vue-loader.conf');

function pathJoin (dir) {
  return path.join(__dirname, './', dir)
}

const webpackConfig = {
  context: __dirname,
  entry: {},
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue: 'vue/dist/vue.js',
      '@': pathJoin('src')
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: vueLoaderConfig.cssLoaders({
            resources: ['./src/common/variables.scss'],
            sourceMap: false,
            extract: true
          })
        }
      },
      {
        test: /\.scss$/,
        // loader: 'style-loader!css-loader!sass-loader'
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: true
              }
            },
            'postcss-loader',
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  path.resolve(__dirname, './src/common/variables.scss')
                ]
              },
            }
          ]
        })
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
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
    // new CopyWebpackPlugin([
    //   { from: './src/basic', to: './basic'}
    // ]),
    new ExtractTextPlugin("css/[name].[contenthash:8].css",{
      allChunks: true
    }),
    new FriendlyErrorsWebpackPlugin(),
    new HtmlWebpackInlineSVGPlugin()
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
    // src/pages/home/main.js
    var name = filepath.split('/')[2]; // 取page的名称
    entries[name] = './' + filepath;
  });
  return entries;
}

var entries = getEntries('src/pages/**/main.js');

Object.keys(entries).forEach(function(name) {
  webpackConfig.entry[name] = [entries[name]];
  var commonChunks = ['manifest','commons', name];
  // if(process.env.npm_lifecycle_event !== 'build'){
  //   commonChunks.push()
  // }
  // 每个页面生成一个html
  var plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: './'+ name + '.html',
        // 每个html的模版，先查找本页有没有模版文件，没有则使用根目录下的index.html
        template: glob.sync('./src/pages/'+ name +'/index.html')[0] || './src/frame/index.html',
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: commonChunks,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      });
  webpackConfig.plugins.push(plugin);
});

if(process.env.npm_lifecycle_event === 'build'){
  webpackConfig.output.filename = 'js/[name].[chunkhash:8].js';
  webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'commons',
    minChunks: function (module, count) {
      // 返回当前模块是否有从node_modules内引入的
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(
          path.join(__dirname, './node_modules')
        ) === 0
      )
    }
  }))
  webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  }))
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }))
  webpackConfig.plugins.push(new CleanWebpackPlugin([path.resolve('./dist')], {root: process.cwd()}))
}
else{
  webpackConfig.devtool = '#source-map';
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
}
// console.log(webpackConfig);
module.exports = webpackConfig;
