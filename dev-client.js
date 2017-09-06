require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?path=/__webpack_hmr&reload=true&quiet=true&noInfo=true')

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
