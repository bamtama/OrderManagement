import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '*', component: () => (import('@/components/404')) },
    {
      path: '/',
      name: 'login',
      component: () => (import('@/components/login'))
    },
    {
      path: '/',
      name: 'index',
      component: () => (import('@/components/index')),
      children: [
        {
          path: '/dashboard',
          name: 'dashboard_menu',
          meta: {
            title: '统计总表',
            icon: 'el-icon-odometer'
          },
          component: () => (import('@/components/pages/dashboard'))
        },
        {
          path: '/reports',
          name: 'reports_menu',
          meta: {
            title: '报表管理',
            icon: 'el-icon-pie-chart'
          },
          component: {render: (e) => e('router-view')}, // 空组件时设置
          children: [
            {
              path: '/reports/dealer',
              name: 'reports_dealer_page',
              meta: {
                title: '报表列表'
              },
              component: () => (import('@/components/pages/reports/dealer'))
            }
          ]
        },
        {
          path: '/management',
          name: 'management_menu',
          meta: {
            title: '商品管理',
            icon: 'el-icon-monitor'
          },
          component: {render: (e) => e('router-view')}, // 空组件时设置
          children: [
            {
              path: '/management/good',
              name: 'management_good_page',
              meta: {
                title: '商品列表'
              },
              component: () => (import('@/components/pages/management/good'))
            }
          ]
        },
        {
          path: '/system',
          name: 'system_menu',
          meta: {
            title: '系统管理',
            icon: 'el-icon-s-grid'
          },
          component: {render: (e) => e('router-view')}, // 空组件时设置
          children: [
            {
              path: '/system/department',
              name: 'system_department_page',
              meta: {
                title: '部门管理',
                icon: 'el-icon-user'
              },
              component: () => (import('@/components/pages/system/department'))
            },
            {
              path: '/system/authority',
              name: 'system_authority_page',
              meta: {
                title: '权限管理',
                icon: 'el-icon-user'
              },
              component: () => (import('@/components/pages/system/authority'))
            },
            {
              path: '/system/notification',
              name: 'system_notification_page',
              meta: {
                title: '通知管理',
                icon: 'el-icon-user'
              },
              component: () => (import('@/components/pages/system/notification'))
            },
            {
              path: '/system/logs',
              name: 'system_logs_page',
              meta: {
                title: '日志列表',
                icon: 'el-icon-user'
              },
              component: () => (import('@/components/pages/system/logs'))
            }
          ]
        },
        {
          path: '/analysis',
          name: 'analysis_menu',
          meta: {
            title: '数据分析',
            icon: 'el-icon-s-data'
          },
          component: {render: (e) => e('router-view')}, // 空组件时设置
          children: [
            {
              path: '/analysis/sales',
              name: 'analysis_sales_page',
              meta: {
                title: '分析列表',
                icon: 'el-icon-user'
              },
              component: () => (import('@/components/pages/analysis/sales'))
            }
          ]
        },
        {
          path: '/members',
          name: 'members_menu',
          meta: {
            title: '注册会员管理',
            icon: 'el-icon-user'
          },
          component: () => (import('@/components/pages/members'))
        },
        {
          path: '/notices',
          name: 'notices_menu',
          meta: {
            title: '公告信息',
            icon: 'el-icon-message'
          },
          component: () => (import('@/components/pages/notices'))
        }
      ]
    }
  ]
})
