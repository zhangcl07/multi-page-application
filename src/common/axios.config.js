// 配置接口调用的基本信息
Vue.prototype.$http = axios.create({
  // baseURL: '',
  timeout: 6000,
  // headers: {},
  // transformResponse: [function (data) {
  //   return data
  // }],
  /**
   * 作为全局接口拦截
   * @param status
   * @returns {boolean}
   */
  validateStatus: function (status) {
    if (status >= 400) {
      return false
    }
    return status >= 200 && status < 300
  }
})