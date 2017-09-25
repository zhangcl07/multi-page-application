<template>
  <div>
    <h2>{{ msg }}</h2>
  </div>
</template>
<script>
  export default {
    name: 'Page',
    data () {
      return {
        msg: 'index-0910'
      }
    }
  }
</script>
<style lang="scss">
  @import "./main.scss";
  body{
    font-size: px2rem(50px)
  }
</style>
