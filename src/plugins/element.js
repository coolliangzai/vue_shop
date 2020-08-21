import Vue from 'vue'
// 按需导入element-ui
import {
  Button,
  Form,
  Input,
  FormItem,
  Message
} from 'element-ui'
// 自定义一个方法$message将它挂载到vue的原型上
Vue.prototype.$message = Message
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
