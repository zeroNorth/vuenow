// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 移动端延迟300毫米的问题
import Fastclick from 'fastclick'
Fastclick.attach(document.body)
// 引用API文件
import API from './api/api'
// 引用utils文件
import utils from './utils/utils'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(Mint)
import Toast from 'mint-ui/lib/toast';
import Cell from 'mint-ui/lib/cell';
import Indicator from 'mint-ui/lib/indicator';
import 'mint-ui/lib/toast/style.css';
import 'mint-ui/lib/indicator/style.css';
import 'mint-ui/lib/cell/style.css';
import $ from 'jquery'

var baseURL = process.env.API_ROOT;
import Axios from 'axios';
import qs from 'qs';
//vuex
import store from './store/store'
import { Popup } from 'mint-ui';

Axios.defaults.baseURL = baseURL;
Vue.prototype.http = Axios;
//require('animate.css')

Vue.component(Toast.name, Toast);
Vue.use(Cell);
// 将API方法绑定到全局
Vue.prototype.$api = API
// 将utils方法绑定到全局
Vue.prototype.$utils = utils

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component(Popup.name, Popup);

//vue-wechat-title 修改标题
Vue.use(require('vue-wechat-title'))
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,//vuex 使用store
  template: '<App/>',
  components: { App }
})
