<template>
  <div class="item_img_uploader" :class="imageList.length == 0 ? 'empty' : ''" ref="item">
    <div class="cont" v-show="imageList.length > 0" ref="imgcont">
      <img :src="item.url" v-for="item in imageList" :key="item.id"/>
    </div>
    <div class="opt">
      <el-upload  action="#" list-type="picture" :multiple="false" :auto-upload="false"
      :class="uploadPlus ? 'upload_plus_hidden' : ''"
      :file-list="imageList" :on-change="onUploadChange"
      :http-request="onUploadImage">
        <el-button type="text" class="btn_new" slot="trigger" :icon="imageList.length > 0 ? `m-icon-img-plus` : 'el-icon-plus'">{{imageList.length > 0 ? '插入' : '插入图片'}}</el-button>
      </el-upload>
      <el-button type="text" class="btn_preview" icon="m-icon-img-picture" @click="onPreview">预览</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'imguploader',
  components: {},
  props: {
    maxLen: {Type: Number, default: 1},
    list: {Type: Array, default: () => {return [] }},
    width: {default: '100'}, // 预览图片宽高
    height: {default: '100'}
  },
  data () {
    return {
      imageList: [],
      uploadPlus: false
    }
  },
  computed: {
  },
  mounted() {
    this.$refs.item.style.width = this.width + 'px'
    this.$refs.item.style.minHeight = (parseInt(this.height) + 12) + 'px'
    this.$refs.imgcont.style.width = this.width + 'px'
    this.$refs.imgcont.style.height = this.height + 'px'
    this.imageList = this.list
    console.log(this.list)
    if (this.list.length === 0) {
      this.uploadPlus = false
    }
  },
  watch: {
    list (nv) {
      this.imageList = nv
      console.log(nv)
      if (nv.length === 0) {
        this.uploadPlus = false
      }
    }
  },
  methods: {
    onPreview () {
      if (this.imageList.length > 0) {
        this.C.alert(`<img src="${this.imageList[0].url}">`, '预览')
      }
    },
    onUploadChange (file, filelist) {
      // 只接受一张图片
      if (filelist.length > 1) {
        filelist.splice(0, 1)
      }
      this.imageList = filelist
      this.uploadPlus = true
      this.$emit('change', this.imageList)
    },
    onUploadImage () {
      // 视接口情况是否要在此处上传
    }
  }
}
</script>

<style scoped lang="less">
.item_img_uploader{
  display: inline-block;
  &.empty{
    .border_dashed();
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0;
    .btn_preview{
      display: none;
    }
    .btn_new{
      font-size: 14px;
    }
  }
  >.cont{
    width: 150px;
    height: 150px;
    overflow: hidden;
    margin-bottom: 5px;
    >img{
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
    }
  }
  >.opt{
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-around;
    .el-button{
      margin: 0;
      border: none;
      background: transparent;
    }
  }
  /deep/ .el-upload-list{
    display: none;
  }
  .border_dashed{
    position: relative;
    padding: 1px;
    box-sizing: border-box;
    &:before{
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(45deg, #e1e9f5 25%, #F9FCFF 0, #F9FCFF 50%, #e1e9f5 0, #e1e9f5 75%, #F9FCFF 0);
      background-size: 16px 16px;
      z-index: 0;
    }
    &:after{
      content: '';
      position: absolute;
      left: 1px;
      top: 1px;
      bottom: 1px;
      right: 1px;
      background: #F9FCFF;
      z-index: 1;
    }
  }
}
</style>
