import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/glob.css'
// 引入字体图标
import './assets/fonts/iconfont.css'
//引入axios
import axios from 'axios'
// 引入插件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)
//通过axios请求拦截器添加token，保证拥有获取数据的权限。
axios.interceptors.request.use(config => {
  //为请求头添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config);
  return config;
})
// 配置axios请求的根路径
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
//将axios挂载到vue的原型上
Vue.prototype.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
