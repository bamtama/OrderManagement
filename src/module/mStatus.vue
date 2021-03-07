<template>
  <div class="m_status" :class="{'active': isActive, 'disable': !able}" @click="onChange">
    <span class="dot"></span>
    <div class="tip">{{tip}}：{{isActive ? mlabel[0] : mlabel[1]}}</div>
  </div>
</template>
<script>
export default {
  name: 'mStatus',
  data () {
    return {
      status: '',
      mlabel: [],
      mvalue: []
    }
  },
  props: {
    // 二元值顺序[true, false]
    active: {default: '0'}, // 当前激活值
    labels: {default: '启用,禁用'}, // 状态文本
    values: {default: '0,1'}, // 状态对应值 注：可以填写任意一项，以填写项为准判断是否激活状态，不填写默认为0,1
    tip: {default: '状态'},   // 提示文本前缀
    able: {default: true},    // 是否可操作(权限判断后)
    action: {default: null},  // 内置请求
    params: {default: null}   // 内置请求的额外参数
  },
  watch: {
    active (nv) {
      if (nv) {
        this.status = parseInt(nv)
      }
    },
    labels (nv) {
      if (nv) {
        this.mlabel = nv.split(',')
      }
    },
    values (nv) {
      if (nv) {
        this.mvalue = nv.split(',')
      }
    }
  },
  computed: {
    isActive () {
      let truev = this.mvalue[0]
      let falsev = this.mvalue[1]
      if (truev === '' && falsev !== '') {
        return parseInt(this.status) != falsev
      } else {
        return parseInt(this.status) == truev
      }
    }
  },
  mounted () {
    this.status = this.active
    this.mlabel = this.labels.split(',')
    this.mvalue = this.values.split(',')
  },
  methods: {
    onChange () {
      if (this.able) {
        let nv = this.mvalue.find(v => { return v != this.status })
        if (!this.action) {
          this.actionStatusChange(nv)
        } else {
          this.actionRequest(nv)
        }
      }
    },
    actionStatusChange (nv) {
      this.$emit('change', nv)
    },
    actionRequest (nv) {
      this.C.showLoading()
      this.C.httpSend(this.HTTP_HOST_LOT + this.action, Object.assign({status: nv}, this.params), data => {
        this.C.tip('操作成功')
        this.C.hideLoading()
        this.$emit('change', data === 0)
      }, 'post')
    }
  }
}
</script>
<style lang='less' scoped>
.m_status{
  display: inline-block;
  width: 32px;
  height: 18px;
  box-sizing: border-box;
  border-radius: 9px;
  border: 1px solid #D2D2D2;
  background: #fff;
  position: relative;
  cursor: pointer;
  &.active{
    >.dot{
      background-color: #85D060;
      margin-left: 15px;
    }
  }
  &.disable{
    cursor: default;
  }
  &:hover{
    >.tip{
      display: block;
    }
  }
  >.dot{
    display: inline-block;
    margin-left: 1px;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: #bbb;
    transition: all 0.3s;
  }
  >.tip{
    display: none;
    position: absolute;
    z-index: 99;
    left: 36px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #5C3535;
    padding: 5px 8px;
    background: #FFFBF2;
    border: 1px solid #E5D1C0;
    box-shadow: 0 0 6px 0 rgba(0,0,0,0.3);
    border-radius: 2px;
    white-space: nowrap;
  }
}
</style>
