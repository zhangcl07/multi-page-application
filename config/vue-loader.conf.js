let ExtractTextPlugin = require("extract-text-webpack-plugin");

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
      loader: 'css-loader',
      options: {
        minimize: true,
        sourceMap: options.sourceMap
      }
    },
    postcssLoader = {
      loader: 'postcss-loader',
      options: {
        sourceMap: options.sourceMap
      }
    }
    sassResourceLoader = {
      loader: 'sass-resources-loader',
      options: {
        resources: options.resources
      }
    };

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = [
      cssLoader,
      postcssLoader
    ]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  function generateSassResourceLoader() {
    const loaders = [
      cssLoader,
      postcssLoader,
      'sass-loader',
      sassResourceLoader
    ]
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // console.log(generateSassResourceLoader());
  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateSassResourceLoader(),
    scss: generateSassResourceLoader(),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
};
