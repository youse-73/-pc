import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 一级路由的组件，占位符必须放到 App.vue 中
  { path: '/login', component: () => import('@/views/login') },
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('@/views/layout'),
    children: [
      { path: 'dashboard', component: () => import('@/views/dashboard') },
      { path: 'article', component: () => import('@/views/article') }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
