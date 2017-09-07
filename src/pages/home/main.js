import Vue from 'vue'
// import $http from '@/common/axios.config'
import Page from './main.vue'
import '@/common/common.scss'

new Vue({
  el: '#app',
  template: '<Page/>',
  components: { Page }
})