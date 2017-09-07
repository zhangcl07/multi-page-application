import Vue from 'vue'
// import $http from '@/common/axios.config'
import Hello from './main.vue'
import '@/common/common.scss'

export default new Vue({
  el: '#otherPage',
  template: '<Hello/>',
  components: { Hello }
})