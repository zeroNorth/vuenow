<template>
  <div class="content">
    <ul>
      <li class="list">
        <label for="forgetPsw_string5" class="textInp">新密码</label>
        <input type="password" placeholder="8-16位字母、数字或符合" v-model="space1" id="forgetPsw5_string" class="loginInp" maxlength="16" matchRegex="^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$">
      </li>
      <li class="list">
        <label for="forgetPsw_string55" class="textInp">确认密码</label>
        <input type="password" placeholder="8-16位字母、数字或符合" v-model="space2" id="forgetPsw55_string" class="loginInp" maxlength="16" matchRegex="^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$">
      </li>
    </ul>
    <div>
      <button class="loginBtn active"  @click="passwordSure">确认</button>
    </div>
  </div>
</template>

<script>
  import CSS from '../../common/css/keyboard.css'
  //引用密码控件
  import CfcaPass from '../../common/js/PassCfca'
  import { Toast } from 'mint-ui'
  export default {
    name: 'forgetloginPsw',
    data () {
      return {
        space1: '',
        space2: '',
        phone: this.$route.query.phone
      }
    },
    created: function () {
      let _this = this
      _this.$api.post('enpKeysQry.do', null, data => {
        _this.reg_mbl = data.reg_mbl

        CfcaPass.RSA_PUBLIC_KEY = data.public_key
        CfcaPass.serverRandom = data.ocx_key
        var arrays = new Array()
        arrays = ['forgetPsw5_string', 'forgetPsw55_string']
        CfcaPass.arrays = arrays
        CfcaPass.initInput()
      })
    },
    computed: {
      showSure: function () {
        if (this.space1.length >= 8 && this.space2.length >= 8) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
    	passwordSure: function () {
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
	      if ($("#forgetPsw5_string").val() == '' || $("#forgetPsw55_string").val() == '') {
	        Toast('请输入密码')
	        return
	      }
	      if ($("#forgetPsw55_string").val().length <= 5 || $("#forgetPsw5_string").val().length <= 5) {
	        Toast('请输入6位密码')
	        return
	      }
	      if (!CfcaPass.checkEqual('forgetPsw55_string','forgetPsw5_string')) {
	        Toast('两次输入密码不一致，请重新输入')
	        return
	      }
	      var pwdInfo = CfcaPass.getEncrypt("forgetPsw5_string")
	      let params = {'new_pswd':pwdInfo.value,'rdm_salt':pwdInfo.random,'mbl_no':_this.phone}
	      _this.$api.post('logPwdReset.do',params,data=>{
	      	Toast('设置成功')
	      })
    	}
    }
  }
</script>

<style scoped>
  li {
    list-style: none;
  }
  .list{
    height: 3.1875rem;
    line-height: 3.1875rem;
    padding: 0 2%;
    font-size: 0.75rem;
    background: white;
    border-bottom: 1px solid #d1d1d1;
  }
  .textInp{
    display: inline-block;
    width: 4em;
    text-align: left;
  }
  .loginInp{
    height: 100%;
    width: calc( 94% - 4em);
    box-sizing: border-box;
    padding-left: 0.3rem;
    border: none;
    outline: none;
  }
  .loginBtn{
    display: block;
    width: 94%;
    height: 3.125rem;
    line-height: 3.125rem;
    margin: 2rem auto 0;
    background: #d1d1d1;
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
