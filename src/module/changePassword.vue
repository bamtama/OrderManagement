<template>
  <div style="display:inline-block">
    <el-button  @click="dialogVisible = true">修改密码</el-button>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="35%"
      :before-close="handleClose" append-to-body>
      <div class="lis">
      <span>账号：</span>
      <el-input :disabled="true" v-model="account" ></el-input>
    </div>
      <div class="lis">
        <span>密码设置：</span>
        <el-input v-model="password1" show-password type="password" ></el-input>
      </div>
      <div class="lis">
        <span>确认密码：</span>
        <el-input v-model="password2" show-password type="password"></el-input>
      </div>
      <div v-text="errorMsg" class="errorMsg"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onChangePassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  components: {
  },
  name: 'changePass',
  data () {
    return {
      account: this.C.user.username,
      user_id: this.C.user.user_id,
      password1: '',
      password2: '',
      errorMsg: '',
      dialogVisible: false
    }
  },
  methods: {
    // 修改密码
    onChangePassword () {
      let _self = this
      if (_self.password1 !== _self.password2) {
        _self.errorMsg = '两次密码不一致!'
        return
      }
      if (!_self.password2) {
        _self.errorMsg = '密码不能为空!'
        return
      }
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(_self.password2)) {
        _self.errorMsg = '密码必须为6~12位字母和数字组合！\n'
        return
      }
      this.C.showLoading('请求中')
      this.C.httpSend(this.HTTP_HOST_LOT + '/util/change_ps',
        {password: _self.password2}, (json) => {
          _self.C.hideLoading()
          if (json === 0) {
            _self.dialogVisible = false
            this.C.alert('操作成功')
          }
        }, 'post')
    },
    handleClose (done) {
      done()
    }
  }
}
</script>
<style>
  .el-dialog__body{
    padding-top:15px;
    padding-bottom:15px;
  }
  .errorMsg{
    color: red;
    text-align: center;
  }
  .lis{
    margin-bottom:10px;
  }
  .lis span{
    display: inline-block;
    width:20%;
  }
  .el-dialog .lis .el-input{
    width:77%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
