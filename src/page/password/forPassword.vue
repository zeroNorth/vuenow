<template>
  <div class="container">
    <div class="posBlack"></div>
    <div class="forgetPsw">
      <h3 class="title">
        输入支付密码
        <i class="el-icon-close close" @click="returnPay"></i>
      </h3>
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
    </div>
  </div>
</template>

<script>
  import CSS from '../../common/css/keyboard.css'
  //引用密码控件
  import CfcaPass from '../../common/js/PassCfca'
  export default {
    name: 'forPassword',
    created: function (){
    	var _this = this
    	_this.$api.post('enpKeysQry.do', null, data => {
      _this.reg_mbl = data.reg_mbl

      CfcaPass.RSA_PUBLIC_KEY = data.pub_key;
      CfcaPass.serverRandom = data.ocx_key;
      var arrays = new Array();
      arrays=["forgetPsw_number"]
      CfcaPass.arrays = arrays;
      CfcaPass.initInput();
    })
    },
    methods: {
      returnPay: function () {
        
      }
    }
  }
</script>
<style scoped>
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
    position: relative;
    left: 0;
    top: 0;
    margin-bottom: 2rem;
    font-size: 0.75rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    border-bottom: 1px solid #d1d1d1;
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
    top: 4rem;
    left: 0;
    opacity: 0;
  }
  .payment_box2,.payment_box5{
    width: 90%;
    height:2rem;
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
</style>
