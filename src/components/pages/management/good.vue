<template>
  <div class="page_content">
    <chead></chead>
    <div class="content">
      <div class="contenthead">
        <datePicker format="yyyy-MM-dd"></datePicker>
        <mCascader></mCascader>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
      </div>
      <div class="contentbody">
        <table class="table_style">
          <thead>
            <tr>
              <th v-for="i in 10" :key="`th_${i}`">字段</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="i in 10" :key="`th_${i}`"></td>
              <td>
                <el-button>操作</el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import chead from '@/module/contentHead.vue'
import datePicker from '@/module/datePicker'
import mCascader from '@/module/mCascader'
export default {
  name: 'goods',
  components: {
    chead,
    datePicker,
    mCascader
  }
}
</script>

<style>

</style>