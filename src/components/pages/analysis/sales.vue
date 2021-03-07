<template>
  <div class="page_content">
    <chead></chead>
    <div class="content">
      <div class="contenthead">
        <datePicker @change="onDateChange" :deTimeType="2" format="yyyy-MM-dd"></datePicker>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
      </div>
      <div class="contentbody">
        <div id="salesAnalysis" style="width: auto;height:400px;"></div>
        <div class="datamx">
          <span>数据明细</span>
          <el-button class=" fr" :icon="tableIsShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom' " type="primary"  @click="onchangeShowTable">{{tableIsShow ? '收起列表' : '展开列表'}}</el-button>
        </div>
        <el-tabs class="salestabs" v-model="listTab" type="border-card" :hidden="!tableIsShow">
          <el-tab-pane label="按用户查看" name="member_type">
            <table class="table_style">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户名称</th>
                  <th>注册来源</th>
                  <th>注册时间</th>
                  <th><a href="javascript:;" @click="onSort('count')">下单量<i class="el-icon-d-caret"></i></a></th>
                  <th><a href="javascript:;" @click="onSort('good')">转化量<i class="el-icon-d-caret"></i></a></th>
                  <th><a href="javascript:;" @click="onSort('profit')">盈利<i class="el-icon-d-caret"></i></a></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <el-alert v-show="mList['member_type'] && mList['member_type'].length === 0" title="暂无数据" type="warning" center show-icon :closable="false"></el-alert>
          </el-tab-pane>
          <el-tab-pane label="按日期查看" name="date">
            <table class="table_style">
              <thead>
              <tr>
                <th>日期</th>
                <th>用户</th>
                <th>注册时间</th>
                <th><a href="javascript:;" @click="onSort('count')">下单量<i class="el-icon-d-caret"></i></a></th>
                <th><a href="javascript:;" @click="onSort('good')">转化量<i class="el-icon-d-caret"></i></a></th>
                <th><a href="javascript:;" @click="onSort('profit')">盈利<i class="el-icon-d-caret"></i></a></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
            <el-alert v-show="mList['date'] && mList['date'].length === 0" title="暂无数据" type="warning" center show-icon :closable="false"></el-alert>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import chead from '@/module/contentHead.vue'
import datePicker from '@/module/datePicker.vue'
export default {
  components: {
    chead, datePicker
  },
  name: 'salesAnalysis',
  data () {
    return {
      isInit: true,
      dataSource: '',
      tableIsShow: true,
      listTab: 'member_type',
      startdate: '',
      enddate: '',
      page: 1,
      pageSize: 10000, // 暂时不需要分页
      mList: {},
      sortRule: {'date': 'count', 'member_type': 'count'},
      sortSeqs: {'date': {}, 'member_type': {}},
      myChart: null,
      option: {
        color: ['#7486F6', '#E37495', '#0DB190'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['下单量', '转化额', '盈利'],
          bottom: 'bottom',
          left: '10%'
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        xAxis: [
          {
            type: 'category',
            data: ['2020-03-20', '2020-04-20', '2020-05-20', '2020-06-20']
          }
        ],
        yAxis: [
          {
            name: '金额（元）',
            type: 'value'
          },
          {
            type: 'value',
            scale: true,
            name: '下单量',
            boundaryGap: [0.2, 0.2]
          }
        ],
        series: [
          {
            name: '转化额',
            type: 'bar',
            barGap: 0
          },
          {
            name: '中奖金额',
            type: 'bar'
          },
          {
            name: '盈利',
            type: 'bar'
          }
        ]
      }
    }
  },
  created () {
  },
  mounted () {
    this.initChart()
  },
  watch: {
    searchParams: {
      handler: function () {
        this.onSearch()
      },
      immediate: false
    }
  },
  computed: {
    searchParams () {
      return {
        dataSource: this.dataSource,
        startdate: this.startdate,
        enddate: this.enddate
      }
    }
  },
  methods: {
    initChart () {
      let echarts = require('echarts/lib/echarts')
      require('echarts/lib/chart/line')
      require('echarts/lib/chart/bar')
      require('echarts/lib/component/tooltip')
      require('echarts/lib/component/title')
      require('echarts/lib/component/legend')
      this.myChart = echarts.init(document.getElementById('salesAnalysis'))
      this.myChart.setOption(this.option)
    },
    onchangeShowTable () {
      this.tableIsShow = !this.tableIsShow
    },
    getChartList () {
      let p = new Promise((resolve) => {
        let data = [{
          date: '2020-01-01',
          count: 1,
          profit: 100,
          good: 200
        },{
          date: '2020-01-02',
          count: 4,
          profit: 300,
          good: 400
        },{
          date: '2020-01-03',
          count: 14,
          profit: 600,
          good: 500
        }]
        resolve(data)
      })
      return p
    },
    getList (type) {
      console.log('type', type)
      let p = new Promise((resolve) => {
        resolve([])
      })
      return p
    },
    updateChart (list) {
      let dataitem = {}
      list.sort((a, b) => {
        a.date = this.C.dateFormat(a.date, 'yyyy-MM-dd')
        b.date = this.C.dateFormat(b.date, 'yyyy-MM-dd')
        return new Date(a.date) - new Date(b.date)
      }).forEach(obj => {
        for (let key in obj) {
          if (!dataitem[key]) {
            dataitem[key] = []
          }
          dataitem[key].push(obj[key])
        }
      })
      let tmpopt = {
        series: [
          {
            name: '下单量',
            type: 'bar',
            barGap: 0,
            data: dataitem['count']
          },
          {
            name: '转化额',
            type: 'bar',
            data: dataitem['good']
          },
          {
            name: '盈利',
            type: 'bar',
            data: dataitem['profit']
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: dataitem['date']
          }
        ]
      }
      this.myChart.setOption(Object.assign({}, this.option, tmpopt))
    },
    onSort (rule) {
      this.sortRule[this.listTab] = rule
      let tmpseq = this.sortSeqs[this.listTab][rule] || 1
      this.sortSeqs[this.listTab][rule] = tmpseq * -1
      this.getList(this.listTab).then(data => { this.mList[this.listTab] = data })
    },
    onDateChange (d) {
      this.startdate = this.C.dateFormat(new Date(d[0]), 'yyyy-MM-dd')
      this.enddate = this.C.dateFormat(new Date(d[1]), 'yyyy-MM-dd')
    },
    onSearch () {
      this.C.showLoading('加载中')
      Promise.all([this.getChartList(), this.getList('date'), this.getList('member_type')]).then(datas => {
        this.C.hideLoading()
        // 图表数据更新
        this.updateChart(datas[0])
        // 列表更新
        this.mList['date'] = datas[1]
        this.mList['member_type'] = datas[2]
        this.mList = JSON.parse(JSON.stringify(this.mList))
      })
    }
  }
}
</script>
