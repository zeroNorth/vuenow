import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  //是否实名
  realnm_flg:'',
  //手机号
  usr_id:'',
  //余额
  bal:'',
  //姓名
  name:'',
  //身份证号
  id_no:'',
  //是否是临时登录密码 Y是 N否
  first_log_flg:'',
  //是否设置了支付密码 Y是 N否
  psw_flg:'',
  //当前业务0 充值 1 提现
  select_type:'',
  cardItem: '',//发红包页面的选择银行卡的index
  ifList: false,//选择页面的切换
  is_default_pay: '使用账户余额付款，',
	payType: '02',
  redresolve: '',//红包处的
  redphone: '',//红包处手机号
  redpay: '',//红包处金额
  bon_name: '',//红包名字
  eff_unit: '',
  redagr_no: '',//银行卡快捷号
  sucTime: ''
}

export default new Vuex.Store({
  state
});
