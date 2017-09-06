import '@/common/common.scss'
import '@/common/axios.config'

const TEMP = `
  <div>
    <h2>index</h2>
  </div>
`

new Vue({
  el: '#app',
  template: TEMP,
  data: {
    msg: 'index'
  }
})