// 接口调用工具
// 配置API接口地址
var baseURL = process.env.API_ROOT
// 兼容不支持promise的浏览器
//require('es6-promise').polyfill();
// 引用axios
import qs from 'qs'
var axios = require('axios')
import Toast from 'mint-ui/lib/toast';
import 'mint-ui/lib/toast/style.css';

import Indicator from 'mint-ui/lib/indicator';
import 'mint-ui/lib/indicator/style.css';

// 自定义判断元素类型js
function toType(obj) {
  return ({}).toString().call(obj).math(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

/*
  接口处理函数
*/

function apiAxios(method, url, params, success, failure) {
  Indicator.open()
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? qs.stringify(params) : null,
    params: method === 'GET' || method === 'DELETE' ? qs.stringify(params) : null,
    baseURL: baseURL,
    withCredentials: true
  })
    .then(function (res) {
//    console.log('接口' + url + '返回数据：' + JSON.stringify(res)+'IP'+baseURL)
      var msgCd = res.data.gda.msg_cd.substring(3, 8)
      if (msgCd !== '00000') {
        if (failure) {
          //请求接口的时候传fail，可以自己toast提示
          Indicator.close();
          failure(res.data)
        } else {
          //请求接口的时候不传fail，默认会有toast提示
          Indicator.close();
//        Toast('error: ' + JSON.stringify(res.data));
          Toast(res.data.gda.msg_inf);
          failure(res.data)
        }
      } else {
        if (success) {
          Indicator.close();
          success(res.data)
        }
      }
    })
    .catch(function (err) {
      let res = err.response
      if (undefined == res || null == res) {
        Indicator.close();
//      Toast('api error，' + err)
      } else if (err) {
        Indicator.close();
        Toast('api error, HTTP CODE: ' + res.status)
        Toast(res.data.gda.msg_inf)
        return
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }
}
