<template>
  <!-- 重置支付密码 输入两遍密码 -->
  <div class="forgetPsw">
    <p class="mtNum">请输入6位数字密码</p>
    <p class="forgerPos">
      <ul class="payment_box5" id="forget_pay_box1">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <input type="password" id="forgetPsw55_number" name="forgetPsw" maxLength="6" class="default input_key"/>
    </p>
    <p class="mtNum">请输入6位数字密码</p>
    <p class="forgerPos">
      <ul class="payment_box2" id="forget_pay_box">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <input type="password" id="forgetPsw_number" name="forgetPsw_number" maxLength="6" class="default input_key"/>
    </p>
    <div class="forgetPsw-next">
      <router-link to="/forgetPsw" tag="div">
        <button class="forget-psw-next" @click="nextTick">下一步{{NUM}}</button>
      </router-link>
    </div>
  </div>
</template>
<script>
import qs from 'qs';
import $ from 'jquery'
import CSS from '../../common/css/keyboard.css'
//引用密码控件
import CfcaPass from '../../common/js/PassCfca'
import { Toast } from 'mint-ui'
import store from '../../store/store.js'
export default {
  name: 'forgetPsw',
  data() {
    return {
      NUM: ''
    }
  },
  created: function () {
    let _this = this
    _this.$api.post('enpKeysQry.do', null, data => {
      _this.reg_mbl = data.reg_mbl

      CfcaPass.RSA_PUBLIC_KEY = data.public_key;
      CfcaPass.serverRandom = data.ocx_key;
      var arrays = new Array();
      arrays=["forgetPsw_number","forgetPsw55_number"]
      CfcaPass.arrays = arrays;
      CfcaPass.initInput();
    })
  },

  beforeRouteLeave: (to, from, next) => {

        next();
        //强制设置密码，如果不设置就关闭页面
        if(this.$store.state.psw_flg&&this.$store.state.psw_flg=='N'){
          //在微信里关闭页面
          WeixinJSBridge.call('closeWindow');
        }

  },

  methods: {
    nextTick: function () {
      var _this = this
      $('#NumberKeyboard').css('display','none')
      if ($("#forgetPsw_number").val() == '' || $("#forgetPsw55_number").val() == '') {
        Toast('请输入密码')
        return
      }
      if ($("#forgetPsw_number").val().length <= 5 || $("#forgetPsw55_number").val().length <= 5) {
        Toast('请输入6位密码')
        return
      }
      if (!CfcaPass.checkEqual('forgetPsw55_number','forgetPsw_number')) {
        Toast('两次输入密码不一致，请重新输入')
        return
      }
      var pwdInfo = CfcaPass.getEncrypt("forgetPsw_number")
      let params = {'new_pswd':pwdInfo.value,'rdm_salt':pwdInfo.random}
      _this.$api.post('payPwdReset.do',params,data =>{
        Toast('设置成功')
        setTimeout(function() {

          //是否设置了支付密码 Y是 N否
          if(_this.$store.state.psw_flg&&_this.$store.state.psw_flg=='N'){
            _this.$store.state.psw_flg = 'Y';
            _this.$router.go(-2)
          }else{
            //回到进入重置密码之前的页面
            _this.$router.go(-2)
          }

        },1000)
      },fail=>{
      	Toast(fail.gda.msg_inf)
      })
    }
  }
}
</script>

<style scoped>
.forgetPsw{
  text-align: center;
}
.forgerPos{
  position: relative;
  left: 0;
  top: 0;
}
.input_key{
  width: 100%;
  height: 3rem;
  background: #ffffff;
  outline: none;
  border: none;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.payment_box2,.payment_box5{
  width: 90%;
  height:3rem;
  margin: 0.3rem auto;
  font-size: 0.4rem;
  list-style-type: none;
  background: #ffffff;
  text-align: center;
  border: 1px #eeeeee solid;
}
.payment_box2 li,.payment_box5 li{
  width: calc(100% / 6);
  height: 100%;
  box-sizing: border-box;
  border-right: 1px #eeeeee solid;
  float: left;
}
.payment_box2 li:nth-last-child(1){
  border-right:none;
}
.payment_box2 .active {
  background: url('../../img/password-blink.gif') no-repeat center center;
}
.payment_box5 li:nth-last-child(1){
  border-right:none;
}
.payment_box5 .active {
  background: url('../../img/password-blink.gif') no-repeat center center;
}
.forgetDot{
  background: url('../../img/passeord-dot.png') no-repeat center center;
  background-size: 0.75rem;
}
.li-item-dot {
  position: absolute !important;
  left: 1.375rem;
  top: 1.25rem;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 100%;
  background: #000000;
}
.forget-psw-next{
  display: block;
  width: 90%;
  height: 3.2rem;
  line-height: 3.2rem;
  margin: 2rem auto 0;
  font-size: 1rem;
  color: #fff;
  background: #f30;
  border-radius: 0.3rem;
  border: none;
  outline: none;
}
.mtNum{
  margin: 1.875rem 0 1.5rem;
}
/*绑定的class要写在最后*/
.bgRed{
  background: #f30;
}
</style>
