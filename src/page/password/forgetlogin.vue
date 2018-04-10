<template>
  <div class="forget">
    <!--输入手机短信-->
    <div class="forget-sms">
      <div class="forget-lst" style="margin-bottom:1px;">
        <span class="forget-phone1">手机号</span><input type="tel" placeholder="请输入手机号码" maxlength="11" class="forget-inp" v-model="phone"/>
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
  </div>
</template>
<script>
import qs from 'qs';
import $ from 'jquery'
import CSS from '../../common/css/keyboard.css'
//引用密码控件
import CfcaPass from '../../common/js/PassCfca'
import { Toast } from 'mint-ui'
export default {
  name: 'forgetlogin',
  data() {
    return {
      smsSH: true,
      timer: null,
      phone: '',
      smsCode: '',
      smsNum: '',
      showNum: false,
      second: 60,
      id_nm: ''
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
      if ((/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(this.phone)) && (this.smsCode.length == 6) && (this.smsNum != '')) {
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
      if ((_this.phone) != '') {
        if (_this.phone.length <= 10) {
          Toast('请输入正确的手机号')
          return
        } else {
          if (!(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(_this.phone))){
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
      	'sms_type':'2'
      }
      _this.$api.post('smsSnd.do',params, data => {
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
      })
    },
    smsNext: function () {
      var _this = this
      if ((_this.phone) != '') {
        if (this.phone.length <= 10) {
          Toast('请输入正确的手机号')
          return
        } else {
          if (!(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(_this.phone))){
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
      	'sms_type':'2',
      	'sms_code': _this.smsCode,
      	'sms_seq':_this.smsNum
      }
      _this.$api.post('smsVfy.do',params, data => {
          _this.$router.push({path:'/forgetloginPsw',query:{'phone':_this.phone}})
      })
    }
  }
}
</script>

<style scoped>
.forget{
  position: absolute;
  left: 0;
  top: 0;
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
  height: calc( 100% - 1px );
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
