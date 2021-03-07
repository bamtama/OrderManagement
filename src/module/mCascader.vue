<template>
  <div class="m_cascader" v-if="!seperate">
    <div class="m_cascader_item">
      <div v-show="loading"
        v-loading="loading"
        class="cascader_loading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0)"></div>
      <el-cascader
        ref="refmcascader"
        v-model="value"
        expand-trigger="hover"
        :placeholder = "loading ? `` : `请选择`"
        :options="groupList"
        :filterable = "true"
        :show-all-levels = "false"
        :multiple = "true"
        @active-item-change="handleItemChange"
        @change="handleChange" :disabled="disabled"></el-cascader>
      </div>
  </div>
  <div class="m_cascader" v-else>
    大类：
    <div class="m_cascader_item">
      <div v-show="loading"
        v-loading="loading"
        class="cascader_loading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0)"></div>
      <el-cascader
        v-model="classesValue"
        expand-trigger="hover"
        :placeholder = "loading ? `` : `请选择`"
        :options="classesGroupList"
        :filterable = "true"
        :show-all-levels = "false"
        :multiple = "true"
        :disabled = "disabled || classesGroupList.length == 0"
        @change="handleClassesChange"></el-cascader>
    </div>
      小类：
    <el-cascader
      v-model="value"
      expand-trigger="hover"
      :placeholder = "loading ? `` : `请选择`"
      :options="groupList"
      :filterable = "true"
      :show-all-levels = "false"
      :multiple = "true"
      @active-item-change="handleItemChange"
      @change="handleChange"></el-cascader>
  </div>
</template>
<style lang='less' scopedSlots>
  .m_cascader{
    display: inline-block;
    .m_cascader_item{
      display: inline-block;
      position: relative;
      font-weight: 500;
      .cascader_loading{
        position: absolute;
        z-index: 1;
        width: calc(100% - 10px);
        height: 100%;
        .el-loading-spinner{
          margin: 0;
          transform: translateY(-50%);
        }
      }
    }
    .el-cascader__label{
      color: #104380;
      font-weight: 500;
    }
    .el-input .el-icon-arrow-down {
      color: #104380;
      font-size: 18px;
      font-weight: bold;
    }
  }
</style>
<script>
export default {
  components: {
  },
  name: 'mCascader',
  /*
  * init 初始化列表，值为首个选项或者以setValue计算
  * showAll
  * setValue
  * customShow
  * customRemove
  * showRules
  * seperate
  * isMixShow
  */
  props: {
    init: { default: false, type: Boolean },
    showAll: { default: false, type: Boolean },
    setValue: { default: null, type: Object },
    customShow: { default: null, type: Object },
    customRemove: { default: null, type: Object },
    showRules: {default: () => { return [1, 1] }, type: Array},
    seperate: {default: false, type: Boolean},
    disabled: {default: false, type: Boolean},
    isMixShow: {default: false, type: Boolean}
  },
  data () {
    return {
      value: [],
      classesValue: [],
      loading: true,
      groupList: [],
      classesGroupList: []
    }
  },
  mounted () {
    let _this = this
    setTimeout(function(){
      _this.loading = false
    }, 2000)
  },
  destroyed () {
  },
  watch: {
  },
  methods: {
    handleItemChange () {},
    handleChange () {}
  }
}
</script>
