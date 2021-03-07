<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="ipage"
    :page-sizes="[10, 20, 30, 50, 100]"
    :page-size="ipageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total='total' style="text-align: center">
  </el-pagination>
</template>
<script>
export default {
  components: {
  },
  name: 'pagination',
  // 暴露的参数，page:当前页 pageSize: 每页数据数 total: 所有数据数
  props: ['page', 'pageSize', 'total'],
  data () {
    return {
      ipageSize: this.pageSize,
      ipage: this.page
    }
  },
  watch: {
    page (nv, ov) {
      if (nv !== ov) {
        this.ipage = nv
      }
    }
  },
  methods: {
    handleSizeChange (pageSize) {
      if (this.total === 0) return
      this.ipageSize = pageSize
      let start = parseInt(pageSize * (this.ipage - 1)) // start：当前列表首个数据在总列表中的索引，从0开始
      // 检查当前page是否存在，不存在则会改变page触发handleCurrentChange回调，存在则直接回调
      if (start <= this.total) {
        this.$emit('change', {pageSize: pageSize, page: this.ipage, start: start})
      }
    },
    handleCurrentChange (page) {
      if (this.total === 0) return
      this.ipage = page
      let start = parseInt(this.ipageSize * (page - 1))
      this.$emit('change', {pageSize: this.ipageSize, page: page, start: start})
    }
  }
}
</script>
