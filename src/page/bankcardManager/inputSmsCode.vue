<template>
  <div>
    <div class="tipsMsg" style="margin: 1rem 1rem;">
          本次操作需要短信确认，请输入{{showMblNo}}收到的短信序号为<span class="sms-code-num">{{smsSeq}}</span>的验证码
    </div>
    <div style="background:white" class="tipsMsg codeInput">
        <p>验证码</p>
        <input type="tel" placeholder="短信验证码" class="textInput" v-model="inputCode" maxlength="6" id="sms_content"/>
        <button class="btnSms" @click="resend" id="btn-sms">重新发送({{second}}s)</button>
    </div>
    <div>
        <div class="submitCode" :class="{ bgRed: inputCodeLisener }" @click="gosubmit">确定</div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import {
    Toast
  } from 'mint-ui'
export default {
  name:'inputSmsCode',
  data: function () {
      return {
        second:60,
        showMblNo: this.$route.query.show_mbl_no,
        smsSeq:this.$route.query.sms_seq,
        token:this.$route.query.token,
        isCertification:this.$route.query.isCertification,
        timer:'',
        inputCode:''
      }
    },
    beforeRouteLeave(to, from, next){
        next(clearInterval(this.timer));
   },
    created() {
        clearInterval(this.timer);
    },
    mounted(){
        var _this = this
        $("#btn-sms").attr('disabled',true)
        clearInterval(_this.timer)
        _this.timer = setInterval(function(){
            $('.btnSms').text('重新发送(' +_this.second + 's)')
            $('.btnSms').css({'background-color':'#CACED7','color':'white'})
            _this.second--
            if(_this.second < 0){
               $('.btnSms').css({'background-color':'#E84F47','color':'white'})
              $('.btnSms').text('重新发送')
              _this.second = 60
              clearInterval(_this.timer)
              if (_this.second === 60) {
                $("#btn-sms").attr('disabled',false)
              }
            }
          },1000)
    },
    computed: {
      inputCodeLisener: function () {
        if (this.inputCode.length == 6) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods:{
     bindCard:function() {
        var _this = this
        let params = {
          'cap_corg':_this.$route.query.bnk_no,//银行编码
          'card_no':_this.$route.query.card_no,//卡号
          'mbl_no':_this.$route.query.phone,//银行预留手机号
          'card_typ':_this.$route.query.type,//卡类型
          'id_nm':encodeURI(encodeURI(_this.$route.query.id_name)),//_this.$route.query.id_name,
          'id_no':_this.$route.query.id_no,
          'id_typ':'00',
          'cvv2':_this.$route.query.cvn2,
          'exp_tm':_this.$route.query.exp_tm,
          'sms_code':_this.inputCode,
          'token':_this.token,
          'sms_seq':_this.smsSeq,//短息序列号
        }
        this.$api.post('bindCard.do', params, msg => {
          Toast('绑卡成功')
          this.$router.go(-3);
        }, fail => {
          Toast(fail.gda.msg_inf)
        })
      },
      gosubmit:function(){
        if (this.inputCode.length == 6) {
          this.bindCard()
        }

      },
      resend: function () {
        var _this = this
        $("#btn-sms").attr('disabled',true)
        var _this = this;
        let params = {
          'mbl_no':_this.$route.query.phone,
          'cap_corg':_this.$route.query.bnk_no,
          'card_typ':_this.$route.query.type,
          'card_no': _this.$route.query.card_no,
          'cvv2':_this.$route.query.cvn2,
          'exp_tm':_this.$route.query.exp_tm
        }
        if(!_this.isCertification){
          params.id_typ = '00'
          params.id_nm = encodeURI(encodeURI(_this.$route.query.id_name))//_this.$route.query.id_name
          params.id_no = _this.$route.query.id_no
        }
        _this.$api.post('qSignSmsSnd.do', params , msg => {
          _this.token = msg.sms_token
          _this.smsSeq = msg.sms_seq
          clearInterval(_this.timer)
          $("#btn-sms").attr('disabled',true)
            _this.timer = setInterval(function(){
            $('.btnSms').text('重新发送(' +_this.second + 's)')
            $('.btnSms').css({'background-color':'#CACED7','color':'white'})
            _this.second--
            if(_this.second < 0){
               $('.btnSms').css({'background-color':'#E84F47','color':'white'})
              $('.btnSms').text('重新发送')
              _this.second = 60
              clearInterval(_this.timer)
              if (_this.second === 60) {
                $("#btn-sms").attr('disabled',false)
              }
            }
          },1000)
        }, fail => {
          Toast(fail.gda.msg_inf)
          $("#btn-sms").attr('disabled',false)
        })
      }
    }
}
</script>


<style scoped>
p{
  color: black;
    font-size: 0.875rem;
    display: inline-block;
    width: 13%;
    padding-left: 0.5rem;
}
.tipsMsg {
    margin: 0 auto;
    color: #393939;
    font-size: 0.8rem;
    margin-top: 1.2rem;
  }
  .password-head {
    width: 100%;
    height: 100%;
  }

  .password-head-in {
    width: 100%;
    height: 100%;
  }

  .pos-opa {
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.5;
  }

  .password {
    width: 100%;
    height: 40%;
    text-align: center;
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;
  }

  .input-psw {
    outline: none;
    border: 1px solid #000;
  }

  .putPsw {
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

  .sms {
    width: 100%;
    height: 100%;
  }

  .sms-pos {
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.5;
  }

  .sms-content {
    height: 70%;
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
  }

  .putSms {
    height: 2.94rem;
    line-height: 2.94rem;
    border-bottom: 1px solid #eee;
    margin-bottom: 0.94rem;
    position: relative;
    left: 0;
    top: 0;
    font-size: 1rem;
    text-align: center;
  }

  .sms-close {
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

  .sms-code-num {
    color: #E84F47;
  }

  .codeInput {
    font-size: 0px;
    height: 3.125rem;
    border: 1px solid #eee;
    margin-bottom: 1.94rem;
    margin-top: 1.125rem;
  }

  .submitCode {
    display: block;
    width: 90%;
    height: 2.625rem;
    line-height: 2.625rem;
    border-radius: 0.188rem;
    margin: 0 auto;
    font-size: 1rem;
    color: #fff;
    background: #CACED7;
    text-align: center;
    border: none;
    outline: none;
  }

  .textInput {
    width: 48%;
    height: 3.125rem;
    line-height: 1.2rem;
    border: none;
    font-size: 0.875rem;
    outline: none;
    padding-left: 0.5rem;
  }

  .btnSms {
    width: 31.5%;
    height: 2rem;
    line-height: 2rem;
    font-size: 0.8rem;
    color: #fff;
    background: #CACED7;
    border: none;
    border-radius: 0.2rem;
    outline: none;
  }

  .line_pay_box {
    position: relative;
    width: 95%;
    height: 1.4rem;
    line-height: 1rem;
    margin-top: 0.36rem;
    padding-left: 5%;
  }

  .payment_box {
    width: 80%;
    height: 3rem;
    margin: 0 auto;
    font-size: 0.4rem;
    list-style-type: none;
    background: #ffffff;
    text-align: center;
    border: 1px #eeeeee solid;
    display: flex;
    margin-top: 2.1875rem;
  }

  .payment_box li {
    width: 17%;
    border-right: 1px #eeeeee solid;
    float: left;
  }

  .payment_box li:nth-last-child(1) {
    border-right: none;
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

  .input_key {
    width: 80%;
    height: 3rem;
    background: #ffffff;
    outline: none;
    border: none;
    position: absolute;
    top: 5.1875rem;
    left: 10%;
    opacity: 0;
  }

  .payment_box .active {
    background: url('../../images/password-blink.gif') no-repeat center center;
  }

  .payment_box div {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: 3rem;
    background: url('../../images/passeord-dot.png') no-repeat center center;
    background-size: 0.75rem;
  }

  .ifSend {
    position: absolute;
    z-index: -9999;
    opacity: 0;
  }

  .forgetPsw {
    color: #E84F47;
    margin-top: 0.9rem;
    font-size: 1rem;
    float: right;
    margin-right: 9%;
  }

  .bgRed {
    background: #E84F47;
    color: white;
  }

  .result_icon {
    width: 4.6rem;
    height: 4.6rem;
    padding-left: calc( 50% - 2.3rem);
    margin-top: 30%;
    vertical-align: middle;
    display: table-cell;
  }

  .tip_state{
    text-align: center;
    color: #333333;
    font-size: 1.25rem;
    margin-top: 1.25rem;
    padding: 0 4rem;
  }

  .tip_msg{
    text-align: center;
    color: #333333;
    font-size: 1rem;
    margin-top: 0.75rem;
    padding: 0 4rem;
  }
</style>
