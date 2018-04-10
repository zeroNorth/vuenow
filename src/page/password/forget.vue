<template>
  <div class="forget">
    <!--输入手机短信-->
    <div class="forget-sms" v-show="smsSH">
      <div class="forget-lst" style="margin-bottom:1px;">
        <span class="forget-phone1">手机号</span><input type="tel" placeholder="请输入手机号码" maxlength="11" class="forget-inp" v-model="phone" readonly="readonly"/>
      </div>
      <div class="forget-lst" style="position:relative;left:0;top:0;">
        <span class="forget-phone1">短信验证码</span><input type="tel" placeholder="请输入验证码" maxlength="6" class="forget-inp1" v-model="smsCode"/>
        <button class="forget-btn" @click="findCode" id="forget-btn">获取验证码</button>
      </div>
      <div v-show="showNum" style="color: #f30;font-size: 0.5rem;margin: 0.5rem 0 0 3%;">短信序号为<span>({{smsNum}})</span></div>
      <div class="forget-next">
        <button class="forget-btn-next" :class="{bgRed:choose}" @click="smsNext">下一步</button>
      </div>
    </div>
    <!--弱实名身份证验证-->
    <div class="forget-ident" v-show="cardSH">
      <div class="forget-lst" style="margin-top:1.56rem;margin-bottom:1px;">
        <span class="forget-phone">姓名</span><input type="text" placeholder="请输入姓名" class="forget-inp" v-model="id_nm1" id="id_nm1"/>
      </div>
      <div class="forget-lst">
        <span class="forget-phone">身份证号</span><input type="text" placeholder="请输入您的身份证号" class="forget-inp" v-model="id_no1" maxlength="18"/>
      </div>
      <div class="forget-next">
        <button class="forget-btn-next" :class="{ bgRed: chooseCard }" @click="nextCard">下一步</button>
      </div>
    </div>
    <!--强实名身份证和银行卡验证-->
    <div class="forget-card" v-show="cardInd">
      <div class="forget-lst" style="margin:1.56rem 0 1px;">
        <span class="forget-phone">姓名</span><input type="text" placeholder="请输入姓名" class="forget-inp" v-model="id_nm" id="id_nm"/>
      </div>
      <div class="forget-lst" style="margin-bottom:1px;">
        <span class="forget-phone">身份证号</span><input type="text" placeholder="请输入您的身份证号" maxlength="18" class="forget-inp" v-model="id_no"/>
      </div>
      <div class="forget-lst" style="margin-bottom:1px;">
        <span class="forget-phone">银行卡号</span><input type="text" style="width: calc(94% - 6em);" placeholder="请输入银行卡号" maxlength="23" class="forget-inp" v-model="card_no" onkeyup="this.value=this.value.replace(/\D/g,'').replace(/....(?!$)/g,'$& ')"/>
      </div>
      <div class="forget-lst">
        <span class="forget-phone">手机号</span><input type="tel" placeholder="请输入银行预留手机号" maxlength="11" class="forget-inp" v-model="phone1"/>
      </div>
      <div class="forget-next">
          <button class="forget-btn-next" :class="{ bgRed: chooseInd }" @click="nextPsw">下一步</button>
      </div>
    </div>
  </div>
</template>
<script>
import qs from 'qs';
import $ from 'jquery'
import { Toast } from 'mint-ui'
export default {
  name: 'forget',
  data() {
    return {
      smsSH: true,
      cardSH: false,
      cardInd: false,
      timer: null,
      phone: this.$store.state.usr_id,
      smsCode: '',
      smsNum: '',
      showNum: false,
      second: 60,
      id_nm: '',
      id_no: '',
      id_nm1: '',
      id_no1: '',
      card_no: '',
      phone1: '',
      clear1: false,
      realnm_flg: ''//是否实名
    }
  },
  created: function() {
    var _this = this
    clearInterval(_this.timer)
  },
  beforeRouteLeave (to, from, next) {
    var _this = this
    next(clearInterval(_this.timer))
  },
  computed: {
    choose: function () {
      if ((/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.phone)) && (this.smsCode.length == 6) && (this.smsNum != '')) {
        return true
      } else {
        return false
      }
    },
    chooseInd: function () {
      if ((this.phone1) != '' && (this.id_nm) != ''&& (this.id_no) != '' &&(this.card_no) != '') {
        return true
      } else {
        return false
      }
    },
    chooseCard: function () {
      if ((this.id_nm1) != ''&& (this.id_no1) != '') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    clear6: function () {
      clearInterval(_this.timer)
    },
    findCode: function () {
      var _this = this
      _this.clear1 = true
      if ((_this.phone) != '') {
        if (_this.phone.length <= 10) {
          Toast('请输入正确的手机号')
          return
        } else {
          if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(_this.phone))){
            Toast('请输入正确的手机号')
            return
          }
        }
      } else {
        Toast('手机号不能为空')
        return
      }
      let params = {
      	'mbl_no':_this.phone,
      	'sms_type': '8'
      }
      _this.$api.post('payPwdSmsSnd.do',params, data => {
        $("#forget-btn").attr('disabled',true)
//        发送成功则开始计时
          clearInterval(_this.timer)
        _this.timer = setInterval(function(){
            _this.second--
            $("#forget-btn").html('重新发送('+_this.second+')').css({'background':'#999'})
            if ( _this.second <= 0) {
              clearInterval(_this.timer)
              $("#forget-btn").html('获取验证码').attr('disabled',false).css({'background':'#f30'})
              _this.second = 60
            }
          },1000)
          _this.smsNum = data.sms_seq
          if (_this.smsNum != '') {
            _this.showNum = true
          } else {
            _this.showNum = false
          }
      },fail =>{
      	if (data.gda.msg_cd.substring(3) !== '00000') {
      		Toast(data.gda.msg_inf)
      	}
      })
    },
    smsNext: function () {
      var _this = this
      if ((_this.phone) != '') {
        if (this.phone.length <= 10) {
          Toast('请输入正确的手机号')
          return
        } else {
          if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(_this.phone))){
            Toast('请输入正确的手机号')
            return
          }
        }
      } else {
        Toast('手机号不能为空')
        return
      }
      if ((_this.smsCode) != '') {
        if (_this.smsCode.length <= 5) {
          Toast('请输入符合标准的验证码')
          return
        }
      } else {
        Toast('验证码不能为空')
        return
      }

      if (_this.smsNum == '') {
        Toast('请先获取短信验证码')
        return
      }

      let params = {
      	'mbl_no':_this.phone,
      	'sms_code':_this.smsCode,
//    	'sms_type':'8',
      	'sms_seq': _this.smsNum
      }
      _this.$api.post('payPwdSmsVfy.do',params, data => {
          	if (data.flag == '00') {
          		_this.$router.push('/forgetPsw')
          	} else if (data.flag == '01') {
          		_this.cardSH = true
          		_this.cardInd = false
          		_this.smsSH = false
          	} else if(data.flag == '02') {
          		_this.cardSH = false
          		_this.cardInd = true
          		_this.smsSH = false
          	}
//          	_this.$router.push('/forgetPsw')
      },fail=>{
      		Toast(fail.gda.msg_inf)
      })
    },
    nextCard: function () {
      var _this = this
      if (_this.id_nm1 == '') {
        Toast('请输入姓名')
        return
      }
      let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$|^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/
      if (!(reg.test(_this.id_no1))) {
        Toast('身份证输入不合法')
        return
      }
      let arrInd = {
      	'mbl_no': _this.phone,
      	'id_nm':encodeURI(encodeURI(_this.id_nm1)),
      	'id_no':_this.id_no1,
      	'card_no': ''
      }
      _this.$api.post('pwdUsrInfVfy.do',arrInd,data => {
        if (data.gda.msg_cd.substring(3,8) != '00000') {
          Toast(data.gda.msg_inf)
        } else {
          _this.$router.push('/forgetPsw')
        }
      },fail=>{
      	Toast(fail.gda.msg_inf)
      })
    },
    nextPsw: function () {
      var _this = this
      if (_this.id_nm == '') {
        Toast('请输入姓名')
        return
      }
      let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$|^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/
      if (!(reg.test(_this.id_no))) {
        Toast('身份证输入不合法')
        return
      }
      let creditInf1 = _this.card_no.replace(/\s+/g,'')
      if (creditInf1 == '') {
        Toast('银行卡号不能为空')
        return
      } else if (creditInf1 < 19) {
        Toast('请输入正确的银行卡号')
        return
      }
      if ((_this.phone1) != '') {
        if (this.phone1.length <= 10) {
          Toast('请输入正确的手机号')
          return
        } else {
          if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(_this.phone1))){
            Toast('请输入正确的手机号')
            return
          }
        }
      } else {
        Toast('手机号不能为空')
        return
      }
      let id_name = encodeURI(encodeURI(_this.id_nm))
      let card_no55 = _this.card_no.replace(/\s+/g,'')
      let arrInd = {
      	'mbl_no':_this.phone1,
      	'id_nm':encodeURI(encodeURI(_this.id_nm)),
      	'id_no':_this.id_no,
      	'card_no':card_no55
      }
      _this.$api.post('pwdUsrInfVfy.do',arrInd,data=> {
        if (data.gda.msg_cd.substring(3,8) != '00000') {
          Toast(data.gda.msg_inf)
        } else {
          _this.$router.push('/forgetPsw')
        }
      })
    }
  }
}
</script>

<style scoped>
.forget{
  width: 100%;
  height: calc(100% - 3.125rem);
  background: #f4f6f7;
  font-size: 0.8rem;
}
.forget-lst{
  width: 100%;
  height: 3.25rem;
  line-height: 3.25rem;
  /*margin: 0.3rem auto 0;*/
  box-sizing: border-box;
  padding: 0 3%;
  background: #fff;
}
.forget-phone{
  display: inline-block;
  width: 5em;
}
.forget-phone1{
  display: inline-block;
  width: 7em;
}
.forget-inp{
  height: 100%;
  border: none;
  outline: none;
  margin-left: 0.5rem;
}
.forget-inp1{
  width: 6em;
  height: 100%;
  border: none;
  outline: none;
  margin-left: 0.5rem;
}
.forget-btn{
  position: absolute;
  right: 3%;
  top: 0.45rem;
  font-size: 0.75rem;
  color: #fff;
  background: #f30;
  padding: 0.75rem 1.25rem;
  border-radius: 0.2rem;
  border: none;
  outline: none;
}
.forget-btn-next{
  display: block;
  width: 90%;
  height: 3.5rem;
  line-height: 3.5rem;
  margin: 2rem auto 0;
  font-size: 1rem;
  color: #fff;
  background: #ccc;
  border-radius: 0.3rem;
  border: none;
  outline: none;
}
/*绑定的class要写在最后*/
.bgRed{
  background: #f30;
}
</style>
