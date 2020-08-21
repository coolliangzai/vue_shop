import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/glob.css'
// 引入字体图标
import './assets/fonts/iconfont.css'
//引入axios
import axios from 'axios'
// 配置axios请求的根路径
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
//将axios挂载到vue的原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
