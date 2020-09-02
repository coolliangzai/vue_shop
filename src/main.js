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
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//引入相关样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//注册为全局组件
Vue.use(VueQuillEditor, /* { default global options } */ )
Vue.filter('DateFormate', function (origindate) {

  var newDate = new Date(origindate)
  var year = newDate.getFullYear()
  //padStart()一共接受两个参数，第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串补全到字符串的头部。
  var month = (newDate.getMonth() + 1 + '').padStart(2, '0')
  var day = (newDate.getDate() + '').padStart(2, '0')
  var hh = (newDate.getHours() + '').padStart(2, '0')
  var mm = (newDate.getMinutes() + '').padStart(2, '0')
  var ss = (newDate.getSeconds() + '').padStart(2, '0')
  return year + '-' + month + '-' + day + '-' + hh + ':' + mm + ':' + ss
})
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
