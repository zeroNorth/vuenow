<template>
  <div class="container">
    <div class="posBlack"></div>
    <div class="forgetPsw">
      <h3 class="title">
        <b>输入支付密码</b>
        <span class="psw-close" @click="returnPay">
        <i class="el-icon-close close"></i>
        </span>
      </h3>
      <input type="text" name="hidden" id="hidden" value="" class="hide" @focus="toforgetPsw"/>
      <p class="forgerPos">
        <ul class="payment_box2" id="forget_pay_box">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <input type="password" id="remember_number" name="remember_number" maxLength="6" class="default input_key"/>
      </p>
    </div>
  </div>
</template>

<script>
  import CSS from '../../common/css/keyboard.css'
  //引用密码控件
  import CfcaPass from '../../common/js/PassCfca'
  import { Toast } from 'mint-ui'
  export default {
    name: 'remember',
    data () {
    	return {
    		focus: false
    	}
    },
    created: function (){
    	var _this = this
    	_this.$api.post('enpKeysQry.do', null, data => {
      _this.reg_mbl = data.reg_mbl

      CfcaPass.RSA_PUBLIC_KEY = data.public_key;
      CfcaPass.serverRandom = data.ocx_key;
      var arrays = new Array();
      arrays=["remember_number"]
      CfcaPass.arrays = arrays;
      CfcaPass.initInput();
    })
    },
    methods: {
      returnPay: function () {
      	$('#NumberKeyboard').css('display','none')
        this.$router.push('/payPsw')
      },
      toforgetPsw: function () {
      	var _this = this
      	this.focus = true
      	if (this.focus) {
      		$('#NumberKeyboard').css('display','none')
      		var pwdInfo = CfcaPass.getEncrypt("remember_number")
      		let params = {'pswd':pwdInfo.value,'rdm_salt':pwdInfo.random}
      		_this.$api.post('payPwdVfy.do',params, data => {
      			_this.$router.push({name:'forgetPsw'})
      		},fail => {
      			Toast(fail.gda.msg_inf)
      		})
      	}
      }
    }
  }
</script>
<style scoped>
	.hide{
		height: 0;
		width: 0;
		transform: scale(0);
	}
  .container{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .posBlack{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.3;
  }
  .forgetPsw{
    position: relative;
    left: 0;
    top: 30%;
    height: 70%;
    background: white;
  }
  .title{
    height: 2.94rem;
    line-height: 2.94rem;
    font-size: 0.875rem;
    border-bottom: 1px solid #eee;
    margin-bottom: 0.94rem;
    position: relative;
    left: 0;
    top: 0;
    text-align: center;
  }
  .close{
    position: absolute;
    left: 0.4rem;
    top: 50%;
    margin-top: -0.4rem;
    width: 0.8rem;
    height: 0.8rem;
  }
  .input_key{
    width: 100%;
    height: 3rem;
    background: #ffffff;
    outline: none;
    border: none;
    position: absolute;
    top: 5.5rem;
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

  .psw-close {
    width: 1.25rem;
    height: 1.25rem;
    line-height: 1.25rem;
    font-size: 0.75rem;
    position: absolute;
    left: 5%;
    top: 50%;
    margin-top: -0.625rem;
    border-bottom: 1px solid #fafafa;
    cursor: pointer;
  }
</style>
