<template>
  <!-- 修改登录密码 输入三遍密码 -->
  <div class="content">
    <ul>
      <li class="list">
        <label for="forgetPsw_string" class="textInp">原密码</label>
        <input type="password" placeholder="输入原密码"  id="forgetPsw_string" class="loginInp" maxlength="16" >
      </li>
      <li class="list">
        <label for="forgetPsw5_string" class="textInp">新密码</label>
        <input type="password" placeholder="8-16位字母、数字或符合"  id="forgetPsw5_string" class="loginInp" maxlength="16" matchRegex="^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$">
      </li>
      <li class="list">
        <label for="forgetPsw55_string" class="textInp">确认密码</label>
        <input type="password" placeholder="8-16位字母、数字或符合" id="forgetPsw55_string" class="loginInp" maxlength="16" matchRegex="^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$">
      </li>
    </ul>
    <div>
      <button class="loginBtn" @click="nextTick">确认</button>
    </div>
    <!-- 设置弹窗提示 -->
    <div v-if="showAlert">
      <alertTip v-on:dismiss="dismiss" v-on:dismissWithData="dismissWithData" :tip="bindTip" :cancel="tipCancel" :commit="tipCommit" :commitData="commitData"></alertTip>
    </div>
  </div>
</template>

<script>
	import $ from 'jquery'
  import CSS from '../../common/css/keyboard.css'
  //引用密码控件
  import CfcaPass from '../../common/js/PassCfca'
  import { Toast } from 'mint-ui'
  import store from '../../store/store.js'
  import alertTip from '../../components/common/alert'
  export default {
    name: 'loginPsw',
    data () {
      return {
        showAlert: false,
        bindTip:'',
        tipCancel:'',
        tipCommit:'',
        commitData:'',
      }
    },

    components: {
      alertTip
    },
    created: function () {
      let _this = this
      _this.$api.post('enpKeysQry.do', null, data => {
        _this.reg_mbl = data.reg_mbl

        CfcaPass.RSA_PUBLIC_KEY = data.public_key
        CfcaPass.serverRandom = data.ocx_key
        var arrays = new Array()
        arrays = ['forgetPsw_string', 'forgetPsw5_string', 'forgetPsw55_string']
        CfcaPass.arrays = arrays
        CfcaPass.initInput()
      })
    },
    methods: {
    	nextTick: function () {
    		var _this = this
    		$('#CompleteKeyboard').css('display','none')
			if (!CfcaPass.checkRegex("forgetPsw5_string")) {
		  	Toast('密码应为8-16位数字、字母的组合')
		  	return
      }
			if (!CfcaPass.checkRegex("forgetPsw55_string")) {
		  	Toast('密码应为8-16位数字、字母的组合')
		  	return
      }
      if ($("#forgetPsw_string").val() == '' || $("#forgetPsw5_string").val() == '' || $("#forgetPsw55_string").val() == '') {
        Toast('请输入密码')
        return
      }
      if ($("#forgetPsw_string").val().length <= 5 || $("#forgetPsw55_string").val().length <= 5 || $("#forgetPsw5_string").val().length <= 5) {
        Toast('请输入6位密码')
        return
      }
      if (!CfcaPass.checkEqual('forgetPsw55_string','forgetPsw5_string')) {
        Toast('两次输入密码不一致，请重新输入')
        return
      }

      var pwdInfo = CfcaPass.getEncrypt("forgetPsw5_string")
      var pwdInfo1 = CfcaPass.getEncrypt("forgetPsw_string")
      let params = {'new_pswd':pwdInfo.value,'old_pswd':pwdInfo1.value,'old_rdm_salt':pwdInfo1.random,'new_rdm_salt':pwdInfo.random}
      _this.$api.post('logPwdMdf.do',params,data =>{
        Toast('设置成功')

        //是否设置了支付密码 Y是 N否
        if(this.$store.state.psw_flg&&this.$store.state.psw_flg=='N'){
        //没有支付密码
        //弹窗提示
          this.showAlertAction('setPayPsw')
        }else{
          //是否是临时登录密码 Y是 N否
          if(this.$store.state.first_log_flg&&this.$store.state.first_log_flg=='Y'){
            this.$store.state.first_log_flg = 'N';
          }

          setTimeout(function() {
            _this.$router.go(-1);
          },1000)
        }

      },fail=>{
      	Toast(fail.gda.msg_inf)
      })
    	},

      showAlertAction: function (action) {
        this.showAlert = true;
        if(action&&'setPayPsw'== action){
          this.bindTip = '您还未设置支付密码，为了资金安全，请您设置支付密码。';
          this.tipCancel = '退出';
          this.tipCommit = '确定';
          this.commitData = 'setPayPsw'
        }
      },

      dismiss: function () {
        this.showAlert = false
        //在微信里关闭页面
        WeixinJSBridge.call('closeWindow');
      },

      dismissWithData(action){
        this.showAlert = false
        if(action&&'setPayPsw'== action){
          this.$router.push({
            name:'forgetPsw'
          })
        }

      },
    }
  }
</script>

<style scoped>
  li {
    list-style: none;
  }
  .list{
    height: 3.2rem;
    line-height: 3.2rem;
    padding: 0 2%;
    font-size: 1rem;
    background: white;
    border-bottom: 1px solid #d1d1d1;
  }
  .textInp{
    display: inline-block;
    width: 4em;
    text-align: left;
  }
  .loginInp{
    height: calc( 100% - 1px);
    width: calc( 92% - 4em);
    box-sizing: border-box;
    padding-left: 0.3rem;
    vertical-align: top;
    border: none;
    outline: none;
  }
  .loginBtn{
    display: block;
    width: 94%;
    height: 3.2rem;
    line-height: 3.2rem;
    margin: 4rem auto 0;
    background: #e84f47;
    color: white;
    font-size: 1rem;
    border-radius: 0.3rem;
    border: none;
    outline: none;
  }
  .active{
    background: #f30;
  }
  .clearfix {
    overflow: hidden;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }
</style>
