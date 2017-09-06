import '@/common/common.scss'
import '@/common/axios.config'

const TEMP = `
  <div>
    <p>{{txt}}</p>
  </div>
`

new Vue({
  el: '#app',
  template: TEMP,
  data: {
    txt: 'Hello hello hello hello heeeeeeeeeeeello!!!'
  }
})