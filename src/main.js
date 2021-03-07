import Vue from 'vue'
import App from './App.vue'
import router from './router'
import common from './utils/common'

Vue.prototype.C = common
window.eventHub = new Vue()

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  common.skey = new Date().getTime()
  common.showLoading('正在进入 ' + to.meta.title, '.el-main')
  next()
})
router.afterEach(() => {
  common.hideLoading()
  window.scrollTo(0, 0)
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')