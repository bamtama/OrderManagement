<template>
  <div class="content_head">
    <div v-if="this.$route.meta.isInnerPage" class="btn_back">
      <el-button type="text" icon="el-icon-arrow-left" @click="gotoBack">返回上页</el-button>
    </div>
    <h1>{{ this.$route.meta.title }}</h1>
    <span>{{ this.$route.meta.info }}</span>
  </div>
</template>

<script>
export default {
  components: {
  },
  name: 'contentHead',
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    gotoBack () {
      this.$router.go(-1)
    }
  }
}
</script>
