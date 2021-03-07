<template>
  <div class="page_content">
    <chead></chead>
    <!-- 可替换内容 -->
    <slot>
    <div class="content">
      <div class="contenthead">
        <span class="autospan">用户名：</span>
        <el-input type="text"></el-input>
        <span class="autospan">用户状态：</span>
        <el-select v-model="searchStatus" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span class="autospan">注册时间：</span>
        <datePicker :deTimeType = '0'></datePicker>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" plain class="fr">添加会员</el-button>
      </div>
      <div class="contentbody">
        <table class="table_style">
          <thead>
          <tr>
            <th>ID</th>
            <th>会员来源</th>
            <th>账号状态</th>
            <th>认证状态</th>
            <th>字段</th>
            <th>字段</th>
            <th>字段</th>
            <th>字段</th>
            <th>字段</th>
            <th>字段</th>
            <th>字段</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>0</td>
            <td>1</td>
            <td>
              <mStatus tip="账号状态" :active="status1" @change="statusChange($event, 1)"></mStatus>
            </td>
            <td>
              <mStatus labels="已认证,未认证" :active="status2" @change="statusChange($event, 2)"></mStatus>
            </td>
            <td>0</td>
            <td>0</td>
            <td class="maxwidth">0</td>
            <td class="maxwidth">0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>
              <el-button type="danger" icon="el-icon-close">删除</el-button>
              <el-button type="success" icon="el-icon-edit">编辑</el-button>
            </td>
          </tr>
          </tbody>
        </table>
        <el-alert title="暂无数据"
                  type="warning"
                  center
                  show-icon :closable="false">
        </el-alert>
      </div>
    </div>
    </slot>
  </div>
</template>
<script>
import chead from '@/module/contentHead.vue'
import mStatus from '@/module/mStatus.vue'
import datePicker from '@/module/datePicker.vue'
export default {
  components: {
    chead, mStatus, datePicker
  },
  name: 'members',
  data () {
    return {
      status1: 0,
      status2: 1,
      searchStatus: 1,
      statusList: [{
        value: 1, label: '未认证'
      },{
        value: 0, label: '已认证'
      }]
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    statusChange (val, index) {
      this['status' + index] = val
    }
  }
}
</script>