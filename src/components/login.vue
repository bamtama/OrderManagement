<template>
  <div class="page_login">
      <div class="login-logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <div class="login-box">
        <p class="tip">Sign in to start your management</p>
        <el-input placeholder="请输入账号" v-model="account" ></el-input>
        <el-input placeholder="请输入密码" v-model="password" show-password type="password"></el-input>
        <div class="sbulogin">
          <el-checkbox v-model="checked">remember password</el-checkbox>
          <el-button type="primary" @click="login">login</el-button>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  name: 'login',
  data () {
    return {
      account: localStorage.getItem('checkbox_save_loginname') || '',
      password: localStorage.getItem('checkbox_save_pwd') || '',
      checked: localStorage.getItem('checkbox_save_pwd') ? true : '',
      showMode: false
    }
  },
  methods: {
    // 登录请求
    login () {
      if (!this.account || !this.password) {
        this.C.alert('please input the account and password')
        return
      }
      this.C.showLoading()
      this.C.fakeHttpSend(() => {
        this.C.user.default_page = 'dashboard_menu'
        this.C.hideLoading()
        this.loginWithMode(1)
      })
    },
    loginWithMode (type) {
      this.C.user['usermode'] = type
      localStorage.setItem('user_data', JSON.stringify(this.C.user))
      this.$router.push({name: this.C.user.default_page})
    }
  }
}
</script>
<style>
  .page_login{
    height: 100%;
    padding: 7% 0;
    background-color: #D2D6DE;
  }
  .login-logo{
    font-size: 35px;
    text-align: center;
    margin-bottom: 25px;
    font-weight: 300;
  }
  .login-box{
    width: 360px;
    margin: 0 auto;
    background: #fff;
    padding: 20px;
    border-top: 0;
    color: #666;
    box-sizing: border-box;
  }
  .tip{
    text-align: center;
    font-size: 14px;
  }
  .login-box .el-input{
    margin-bottom: 15px;
  }
  .sbulogin{
    height: 40px;
    margin-top: 10px;
  }
  .sbulogin .el-button--primary{
    float: right;
    margin-top: -10px;
  }
</style>
