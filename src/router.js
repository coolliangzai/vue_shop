import Vue from 'vue'
import VueRouter from 'vue-router'
import login from './components/Login'
import home from './components/Home'
import welcome from './components/Welcome'
import users from './components/user/Users'
import rights from './components/power/rights'
import roles from './components/power/Roles'
import cate from './components/goods/Cate'
import params from './components/goods/Params'
import list from './components/goods/List'
import add from './components/goods/Add'
Vue.use(VueRouter)
const routes = [{
  path: '/login',
  component: login
}, {
  path: '/',
  redirect: '/login'
}, {
  path: '/home',
  component: home,
  redirect: '/welcome',
  children: [{
      path: '/welcome',
      component: welcome
    }, {
      path: '/users',
      component: users
    },
    {
      path: '/rights',
      component: rights
    },
    {
      path: '/roles',
      component: roles
    }, {
      path: '/categories',
      component: cate
    },
    {
      path: '/params',
      component: params
    }, {
      path: '/goods',
      component: list
    },
    {
      path: '/goods/add',
      component: add
    }
  ]
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
