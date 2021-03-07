<template>
  <div class="index_404">
    <h2>404</h2>
    <div class="tip">未找到页面</div>
    <router-link to="/">返回登录页</router-link>
  </div>
</template>

<script>
export default {
  name: 'index_404',
  data () {
    return {
      msg: '404'
    }
  }
}
</script>
<style lang="less">
  .index_404{
    text-align: center;
    color:#A1A1A1;
    h2{
      font-size: 100px;
      margin-top: 10%;
    }
    .tip{
      font-size: 14px;
    }
    a{
      text-decoration: underline;
      margin-top: 5%;
      display: inline-block;
    }
  }
</style>
