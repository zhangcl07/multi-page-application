module.exports = {
  NODE_ENV: '"development"',
  host: 'http://localhost',
  port: '9001',
  contentBase: 'dist',
  //参考：https://github.com/chimurai/http-proxy-middleware
  proxyMap: {
    // '/': {
    //   target: 'http://www.example.com',
    //   changeOrigin: true
    // }
  }
}