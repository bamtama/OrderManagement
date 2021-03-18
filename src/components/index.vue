<template>
  <div class="page_index THEME">
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-button v-model="isCollapse" class="menubuttom" :class="isCollapse ? 'menubuttom menubuttomss' : 'menubuttom'" icon="el-icon-menu" @click="handleSwitch">开关</el-button>
        <div class="mainlogo">
          <span class="logo-mini" :hidden="!isCollapse">
            <img src="../assets/logo.png" alt="">
          </span>
          <img src="../assets/logo.png" alt="" :hidden="isCollapse">
        </div>
        <div class="el_menu_wrap">
          <div class="state" :style="isCollapse ? 'margin-bottom:0' : ''">
            <div :class="isCollapse ? 'imglogo' : ''"><img src="../assets/logo.png" alt=""></div>
            <div :style="isCollapse ? 'display:none' : ''">
              <p class="username" v-text="this.C.user.username"></p>
              <span class="onlines"><i class="zt"></i><i> Online</i></span>
            </div>
          </div>
          <el-menu :default-openeds="default_openeds_array" @open="handleOpen" unique-opened :collapse="isCollapse" collapse-transition :default-active="menuIndex">
            <template v-for="router in this.$router.options.routes">
              <template v-for="(route, index) in router.children">
                <div class="el-menu-group" v-if="route.nav1" :key="`group_${index}`" :index="route.name" v-text="route.title"></div>
                <el-menu-item :key="`sub_${index}`" :index="route.name" @click="gotoPage(route)" v-if="!route.children">
                  <i :class="route.meta.icon"></i>
                  <span slot="title" v-text="route.meta.title"></span>
                </el-menu-item>
                <el-submenu :key="`sub_${index}`" :index="route.name" v-else>
                  <template slot="title">
                    <i :class="route.meta.icon"></i>
                    <span v-text="route.meta.title"></span>
                  </template>
                  <el-menu-item-group :key="index2" v-for="(route2, index2) in route.children">
                    <el-menu-item :index="route2.name" @click="gotoPage(route2)" v-text="route2.meta.title"></el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </template>
            </template>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 12px;display: flex">
          <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab" style="flex:1;overflow: hidden;">
            <el-tab-pane
              v-for="(item) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name">
            </el-tab-pane>
          </el-tabs>
          <MessageTip></MessageTip>
          <el-dropdown>
            <div class="userinfo ">
              <img src="../assets/logo.png" alt="">
              <span v-text="this.C.user.username"></span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <div class="loginsta">
                <img src="../assets/logo.png" alt="">
                <p>username</p>
                <p>department</p>
                <p>some info</p>
              </div>
              <div class="loutb">
                <changePas></changePas>
                <el-button @click="onLogout">log out</el-button>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
          <el-footer class="main-footer">
            <div class="">Copyright © 2020 All rights reserved.</div>
            <div class="right">Version 4.0.0</div>
          </el-footer>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SOCKET from '../utils/connect'
import MessageTip from '../module/MessageTip'
import changePas from '../module/changePassword'
export default {
  components: {
    MessageTip, changePas
  },
  name: 'index',
  data () {
    return {
      isCollapse: false,
      editableTabsValue: '', // 标签选中
      editableTabs: [],
      menuIndex: '', // 导航选中
      default_openeds_array: [],
      mroutes: {}
    }
  },
  created () {
  },
  destroyed: function () {
    SOCKET.close()
  },
  mounted () {
    this.$nextTick(this.resizeMenu)
    window.onresize = this.resizeMenu
    this.loadTab()
  },
  watch: {
    $route: {
      handler () {
        this.setSelectByRoute()
      },
      immediate: true
    }
  },
  computed: {
  },
  methods: {
    onLogout () {
      window.localStorage.clear()
      this.$router.push('/login')
    },
    addTab (item) {
      let has = -1
      let tabs = this.editableTabs
      tabs.forEach((tab, index) => {
        if (tab.name === item.name) {
          has = index
          return false
        }
      })
      if (has > -1) {
        this.editableTabsValue = item.name
        return
      }
      this.editableTabs.push({
        title: item.meta.title,
        name: item.name,
        content: item
      })
      this.editableTabsValue = item.name
      this.saveTab()
    },
    removeTab (targetName) {
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      let nextTab
      if (tabs.length <= 1) {
        return
      }
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
        console.log('removeTab', activeName, nextTab, JSON.parse(JSON.stringify(nextTab)))
        this.gotoPage(JSON.parse(JSON.stringify(nextTab)).content)
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      this.saveTab()
    },
    clickTab (target) {
      let tabs = this.editableTabs
      tabs.forEach((tab) => {
        if (tab.name === target.name) {
          this.gotoPage(JSON.parse(JSON.stringify(tab)).content)
        }
      })
    },
    gotoPage (item) {
      if (item.name !== this.$route.name || this.editableTabs.length <= 0) {
        this.menuIndex = item.name
        this.$router.push(item.path)
        this.addTab(item)
      }
    },
    handleSwitch () {
      this.isCollapse = !this.isCollapse
    },
    handleOpen (key) {
      this.default_openeds_array.push(key)
    },
    saveTab () {
      localStorage.setItem('tabs_save_' + this.C.user.user_id, JSON.stringify(this.editableTabs))
    },
    loadTab () {
      let allroutes = this.$router.options.routes[2]
      this._routeToMap(allroutes, this.mroutes)
      
      let list = localStorage.getItem('tabs_save_' + this.C.user.user_id)
      if (list) {
        this.editableTabs = JSON.parse(list)
      } else {
        this.addTab(this.mroutes[this.C.user.default_page])
      }
      this.setSelectByRoute()
    },
    setSelectByRoute () {
      this.menuIndex = this.$route.name
      this.editableTabsValue = this.$route.name
      console.log('setSelectByRoute', this.menuIndex)
    },
    resizeMenu () {
      if (document.body.clientWidth < 1200) this.isCollapse = true
      else this.isCollapse = false
    },
    _routeToMap (item, target) {
      if (item.children) {
        item.children.forEach(si => {
          this._routeToMap(si, target)
        })
      } else {
        target[item.name] = item
      }
    }
  }
}
</script>
