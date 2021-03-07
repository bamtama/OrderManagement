<template>
  <el-date-picker
    v-model="newtime"
    @change = 'changedate'
    @blur="actionBlur"
    type="datetimerange"
    range-separator="-"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :format="format"
    :default-time="['00:00:00', '23:59:59']"
    :picker-options="pickerOptions"
    clearable="clearable">
  </el-date-picker>
</template>

<script>
export default {
  components: {
  },
  name: 'datePick',
  props: ['deTimeType', 'setDatetime', 'format'],
  created () {
    this.newtime = this.setDatetime || this.timeType[this.deTimeType || 0]
  },
  watch: {
    setDatetime: {
      handler (nv) {
        this.newtime = nv
      }
    }
  },
  data () {
    return {
      timeType: [
        [
          new Date(new Date().toLocaleDateString()),
          new Date(new Date(new Date().setUTCDate(new Date().getDate() + 1)).toLocaleDateString()).getTime() - 1
        ], [
          new Date(new Date().getTime() - 3600 * 1000 * 24 * 1).toLocaleDateString(),
          new Date(new Date().toLocaleDateString()).getTime() - 1
        ], [
          new Date(new Date().getTime() - 3600 * 1000 * 24 * 7).toLocaleDateString(),
          new Date(new Date(new Date().setUTCDate(new Date().getDate() + 1)).toLocaleDateString()).getTime() - 1
        ], [
          new Date(new Date().getTime() - 3600 * 1000 * 24 * 30).toLocaleDateString(),
          new Date(new Date(new Date().setUTCDate(new Date().getDate() + 1)).toLocaleDateString()).getTime() - 1
        ], [
          new Date(new Date().setUTCDate(1)).toLocaleDateString(),
          new Date(new Date(new Date().setUTCDate(new Date().getDate() + 1)).toLocaleDateString()).getTime() - 1
        ], [
          new Date(new Date().setUTCMonth(new Date().getMonth() - 1, 1)).toLocaleDateString(),
          new Date(new Date(new Date().setUTCDate(1)).toLocaleDateString()).getTime() - 1
        ]
      ],
      // newtime: [new Date(2013, 10, 10, 10, 10), new Date()],
      newtime: [],
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            const end = new Date(new Date(new Date().setUTCDate(new Date().getDate() + 1)).toLocaleDateString()).getTime() - 1
            const start = new Date(new Date().toLocaleDateString())
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const end = new Date(new Date().toLocaleDateString()).getTime() - 1
            const start = new Date(new Date().getTime() - 3600 * 1000 * 24 * 1).toLocaleDateString()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近7天',
          onClick (picker) {
            const end = new Date(new Date(new Date().setUTCDate(new Date().getDate() + 1)).toLocaleDateString()).getTime() - 1
            const start = new Date(new Date().getTime() - 3600 * 1000 * 24 * 7).toLocaleDateString()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近30天',
          onClick (picker) {
            const end = new Date(new Date(new Date().setUTCDate(new Date().getDate() + 1)).toLocaleDateString()).getTime() - 1
            const start = new Date(new Date().getTime() - 3600 * 1000 * 24 * 30).toLocaleDateString()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '这个月',
          onClick (picker) {
            const end = new Date(new Date(new Date().setUTCDate(new Date().getDate() + 1)).toLocaleDateString()).getTime() - 1
            const start = new Date(new Date().setUTCDate(1)).toLocaleDateString()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date(new Date().setUTCMonth(new Date().getMonth() - 1, 1)).toLocaleDateString()
            end.setTime(new Date(new Date(end.setUTCDate(1)).toLocaleDateString()).getTime() - 1)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  mounted () {
    this.changedate()
  },
  computed: {

  },
  methods: {
    changedate () {
      if (this.newtime) {
        this.newtime[0] = this.C.dateFormat(new Date(this.newtime[0]), 'yyyy-MM-dd hh:mm:ss')
        this.newtime[1] = this.C.dateFormat(new Date(this.newtime[1]), 'yyyy-MM-dd hh:mm:ss')
        this.$emit('change', this.newtime)
      }
    },
    actionBlur () {
      if (this.newtime !== null) {
        this.newtime = [...this.newtime]
      }
    }
  }
}
</script>
