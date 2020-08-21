import Vue from 'vue'
import VueRouter from 'vue-router'
import login from './components/Login'
import home from './components/Home'
Vue.use(VueRouter)
const routes = [{
  path: '/login',
  component: login
}, {
  path: '/',
  redirect: '/login'
}, {
  path: '/home',
  component: home
}, ]
const router = new VueRouter({
  routes
})
//设置路由导航守卫befroeEach
router.beforeEach((to, from, next) => {
  // 如果需要访问的路径为/login直接放行
  if (to.path == '/login') return next();
  //从window对象下拿到token值
  const tokenStr = window.sessionStorage.getItem('token')
  //如果没有token值那么就强制跳转到/login
  if (!tokenStr) return next('/login');
  //如果有token值直接放行
  next()
})
export default router
