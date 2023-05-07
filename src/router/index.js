import { createRouter, createWebHashHistory } from 'vue-router'
import { userStore, mainStore } from '../stores';
import { localGetData, sessionGetData } from "@/hooks/useStorage.js"

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
    //独享前置路由守卫，隐藏底部导航栏
    beforeEnter: (to, from, next) => {
      let mainData = mainStore();
      mainData.footerNavIsShow = false;
      next();
    },
  },
  {
    path: '/',
    name: 'memory',
    component: () => import('../views/memory.vue'),
    meta: { transitionName: 'slide-left', index: 1 },
    children: [
      {
        path: '/DueToday',
        name: 'DueToday',
        component: () => import('../components/memory/DueToday.vue'),
        //独享前置路由守卫，登录拦截
        beforeEnter: (to, from, next) => {
          let user = localGetData('user') || sessionGetData('user');
          let userData = userStore();
          if (user != null && !userData.isLogin) {
            userData.user = user;
            userData.isLogin = true;
          }
          if (userData.isLogin) {
            next()
          } else {
            next('/login')
          }
        },
      },
      {
        path: '/MemoryBank',
        name: 'MemoryBank',
        component: () => import('../components/memory/MemoryBank.vue'),

      },
    ]
  },
  {
    path: '/MakingPage',
    name: 'MakingPage',
    component: () => import('../views/MakingPage.vue'),
    meta: { transitionName: 'slide-left', index: 3 },

  },
  {
    path: '/Personal',
    name: 'Personal',
    component: () => import('../views/Personal.vue'),
    meta: { transitionName: 'slide-left', index: 5 },
  },

  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('../views/calendar.vue'),
    meta: { index: 0 },
    //独享前置路由守卫，隐藏底部导航栏
    beforeEnter: (to, from, next) => {
      let mainData = mainStore();
      mainData.footerNavIsShow = false;
      next();
    },
  },
  {
    path: '/PkMainPage',
    name: 'PkMainPage',
    component: () => import('../views/PkMainPage.vue'),
    meta: { index: 0 },
  },
  {
    path: '/Community',
    name: 'Community',
    component: () => import('../views/Community.vue'),
    meta: { index: 0 },
    children: [
      {
        path: '/ViewTemplate',
        name: 'ViewTemplate',
        component: () => import('../components/community/ViewTemplate.vue'),
        meta: { transitionName: 'slide-right' },
      },
    ]
  }
]


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {


})

//暴露router
export default router
