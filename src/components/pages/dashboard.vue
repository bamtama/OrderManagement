<template>
  <div class="page_content">
    <chead></chead>
    <div style="position: relative"  class="content dashb">
      <el-tabs class="tab_card_hor" v-model="g_type" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="今日" name="0"></el-tab-pane>
        <el-tab-pane label="昨日" name="1"></el-tab-pane>
        <el-tab-pane label="近7日" name="7"></el-tab-pane>
        <el-tab-pane label="本月" name="8"></el-tab-pane>
        <el-tab-pane label="上月" name="9"></el-tab-pane>
      </el-tabs>
      <div class="row">
        <div class="row item">
          <i class="el-icon-edit"></i>
          <div>
            <span class="span1">注册量</span>
            <span class="span2" v-text ="ver_reg"></span>
          </div>
        </div>
        <div class="row item">
          <i class="el-icon-s-goods"></i>
          <div>
            <span class="span1">交易量</span>
            <span class="span2" v-text ="ver_buys"></span>
          </div>
        </div>
        <div class="row item">
          <i class="el-icon-shopping-cart-2"></i>
          <div>
            <span class="span1">访问量</span>
            <span class="span2" v-text ="ver_visit"></span>
          </div>
        </div>
        <div class="row item">
          <i class="el-icon-cloudy-and-sunny"></i>
          <div>
            <span class="span1">盈利量</span>
            <span class="span2" v-text ="ver_profit"></span>
          </div>
        </div>
      </div>
      <div :class="count < 10 ? 'has-success' : 'has-warning'" class="form-group">
          <span class="help-block">
              <i :class="count < 10 ? '' : 'el-icon-loading'"></i>
              <span v-text="count < 10 ? '还有 ' + count + ' 秒重新刷新' : '刷新中...'"></span>
          </span>
      </div>
    </div>
  </div>
</template>

<script>
import chead from '@/module/contentHead.vue'
export default {
  components: {
    chead
  },
  name: 'dash',
  data () {
    return {
      j_timer: 0,
      count: 10,
      g_type: 0,
      type: '0.00000',
      ver_reg: '0.00000',
      ver_buys: '0.00000',
      ver_visit: '0.00000',
      ver_profit: '0.00000'
    }
  },
  mounted () {
    window.eventHub.$on('unload_module', function () {
      this.$destroy()
    })
    this.refresh()
    this.getdata()
  },
  beforeDestroy () {
    window.eventHub.$off('unload_module')
    clearInterval(this.j_timer)
  },
  watch: {
  },
  computed: {
  },
  methods: {
    refresh () {
      let _self = this
      if (this.j_timer) clearInterval(this.j_timer)
      this.j_timer = setInterval(function () {
        _self.count--
        // 标签当中显示时间
        if (_self.count === 0) {
          _self.getdata(1)
          _self.count = 10
        }
      }, 1000)
    },
    handleClick () {
      this.count = 10
      this.getdata()
    },
    getdata () {
    },
    format_data () {
    }
  }
}
</script>
<style lang="less">
  .dashb{
    .row.item{
      margin-top: 20px;
      margin-right: 20px;
      flex: 1;
      >i{
        display: block;
        width: 90px;
        height: 90px;
        text-align: center;
        line-height: 90px;
        font-size: 30px;
        color: white;
        &.el-icon-edit{
          background: #00c0ef !important;
        }
        &.el-icon-s-goods{
          background: #dd4b39 !important;
        }
        &.el-icon-shopping-cart-2{
          background: #00a65a !important;
        }
        &.el-icon-cloudy-and-sunny{
          background: #605ca8 !important;
        }
      }
      >div{
        display: block;
        padding: 5px 10px;
        .span1{
          display: block;
          line-height: 20px;
          font-size: 14px;
        }
        .span2{
          font-weight: bold;
          font-size: 18px;
          line-height: 25px;
          vertical-align: top;
        }
      }
    }
  }
  .form-group{
   position: absolute;
    top:23px;
    left: 400px;
  }
  .has-warning{
    color: #f39c12;
  }
  .has-success{
    color: #00a65a;
  }
</style>
