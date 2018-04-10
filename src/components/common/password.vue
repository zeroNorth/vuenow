<template>
  <div class="password-head" id="showPSW">
    <!-- 支付密码输入框 -->
    <div class="password-head-in" v-show="showPsw">
      <div class="pos-opa"></div>
      <div class="password" id="showPSW1">
        <h4 class="putPsw">
          <b>输入支付密码</b>
          <span class="psw-close" @click="close">
            <i class="el-icon-close"></i>
          </span>
        </h4>
        <ul class="payment_box neverUseThisClass" id="pay_box1">
          <li style="width: 16%;border-right: 1px #eeeeee solid;"></li>
          <li style="width: 16%;"></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <input type="text" class="ifSend" id="ifSend" v-model="ifSend" @focus="ifCode"/>
        </ul>
        <input type="password" id="paypswNum_number" name="paypswNum" maxLength="6" class="default input_key"
               />
        <div class="forgetPsw" @click="forgetPsw">忘记密码？</div>
      </div>
    </div>
    <!-- 支付密码输入框 -->

    <!-- 短信输入框 -->
    <div class="sms" v-show="showSms">
      <div class="sms-pos"></div>
      <div class="sms-content" id="sms-content">
        <h4 class="putSms">
          <b>短信验证码</b>
          <span class="sms-close" @click="close">
            <i class="el-icon-close"></i>
          </span>
        </h4>
        <div class="wdNity">
          本次操作需要短信确认，请输入{{showMblNo}}收到的短信序号为<span class="sms-code-num">{{smsSeq}}</span>的验证码
        </div>
        <div class="wdNity put-sms-code">
          <input type="tel" placeholder="" class="text-input" v-model="inputCode" maxlength="6" id="sms_content"/>
          <button class="btn-sms" @click="resend" id="btn-sms">重新发送({{second}}s)</button>
        </div>
        <div>
          <div class="submit" :class="{ bgRed: inputCodeLisener }" @click="gosubmit">确定</div>
        </div>
      </div>
    </div>
    <!-- 短信输入框 -->

    <!-- 充值提现结果提示 -->
    <div class="sms" v-show="showResult">
      <div class="sms-pos"></div>
      <div class="sms-content" >
        <h4 class="putSms">
          <b>{{typeName}}结果</b>
          <span class="psw-close" @click="close">
            <i class="el-icon-close"></i>
          </span>
        </h4>
        <div class="wdNity">
          <img class="result_icon" :src="resultIconUrl"/>
        </div>

        <div class="tip_state">{{typeStateInfo}}</div>
        <div class="tip_msg">{{typeMsg}}</div>
      </div>
    </div>
    <!-- 充值提现结果提示 -->

  </div>
</template>

<script>
  import $ from 'jquery'
  import CSS from '../../common/css/keyboard.css'
  import CfcaPass from '../../common/js/PassCfca'
  import { Toast } from 'mint-ui'
  import store from '../../store/store.js'

  export default {
    name: 'password',
    props: ['inputMoney','listSelected','typeAction'],
    data: function () {
      return {
        showMblNo: '',
        smsSeq:'',
        second: 60,
        arr: '',
        showSms: false,
        payPwd: '',
        randomSalt: '',
        ifSend: '',
        getProfitDt: '',
        smsToken: '',
        showPsw:true,
        showResult:false,
        inputCode:'',
        typeName:'',
        typeStateInfo:'',
        typeMsg:'',
        resultTip:'',
        resultIconUrl:'',

      }
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

    created: function () {
      var _this = this
      _this.$api.post('enpKeysQry.do', null, data => {
        CfcaPass.RSA_PUBLIC_KEY = data.public_key;
        CfcaPass.serverRandom = data.ocx_key;
        var arrays = new Array("paypswNum_number");
        CfcaPass.arrays = ["paypswNum_number"];
        CfcaPass.initInput();
      }, fail => {
      })
    },
    methods: {
      ifCode: function () {
        $("#ifSend").blur()
        var _this = this
        //关闭密码框
        this.showPsw = false;
        var pwdInfo = CfcaPass.getEncrypt("paypswNum_number")
        _this.payPwd = pwdInfo.value
        _this.randomSalt = pwdInfo.random



          console.log('typeAction:'+_this.typeAction)
          //0 充值 1 提现 2删除银行卡
          if('0'==_this.typeAction){
            //-------------验证支付密码-------------//
            let arr = {
              'pswd': _this.payPwd,
              'rdm_salt': _this.randomSalt
            }
            _this.$api.post('payPwdVfy.do', arr, msg => {
            this.typeName = '充值'
            //-----充值发短信-------//
            //发送短信
            this.resend();
            }, fail => {
              //打开密码框
              this.showPsw = true;
              Toast(fail.gda.msg_inf);
            })

          }else if('1'==_this.typeAction){
            this.typeName = '提现'
            //-----提现-------//
            let value6 = {
              //提现金额
              'trans_amt': (parseFloat(_this.inputMoney)*100) + '',
              //支付密码
              'pswd': _this.payPwd,
              //客户端随机因子
              'rdm_salt': _this.randomSalt,
              //协议号
              'agr_no': _this.listSelected.agr_no,
            }

            this.$api.post('withdraw.do', value6, msg => {
              $('#NumberKeyboard').css('display','none')
              $("#showPSW1").val('')
              $('#forget_pay_box li').removeClass('active')

              this.typeStateInfo = '提现申请成功';
              this.typeMsg = '';
              this.resultIconUrl = './static/images/icon_payment_success.png';
              _this.showResult = true;
              clearInterval(timer)
              var showResultSecond = 3
              var timer = setInterval(function(){
                showResultSecond --;
                console.log('showResultSecond:'+showResultSecond)
                if(showResultSecond < 0){
                  clearInterval(timer)
                  console.log('提示并退出')
                  _this.$emit('closeWithData',"提示并退出");
                }
              },1000)
            }, fail => {

              //提现处理中
              if('MHP00003' == fail.gda.msg_cd){
                this.typeStateInfo = fail.gda.msg_inf;
                this.typeMsg = '';
                this.resultIconUrl = './static/images/icon_payment_processing.png';
                this.showResult = true;
                clearInterval(timer)
                var showResultSecond = 3
                var timer = setInterval(function(){
                  showResultSecond --;
                  console.log('showResultSecond:'+showResultSecond)
                  if(showResultSecond < 0){
                    clearInterval(timer)
                    _this.$emit('closeWithData',"提示并退出");
                  }
                },1000)
              }else if('MHP11002' == fail.gda.msg_cd){
                //支付密码错误
                Toast(fail.gda.msg_inf);
                this.showPsw = true;
              }else{
                this.typeStateInfo = '提现申请失败';
                //提现失败
                this.typeMsg = fail.gda.msg_inf;
                this.resultIconUrl = './static/images/icon_payment_fail.png';
                this.showResult = true;
                clearInterval(timer)
                var showResultSecond = 3
                var timer = setInterval(function(){
                  showResultSecond --;
                  console.log('showResultSecond:'+showResultSecond)
                  if(showResultSecond < 0){
                    clearInterval(timer)
                    _this.$emit('closeWithData',"提示并退出");
                  }
                },1000)
              }


            })

          }else if('2'==_this.typeAction){
            console.log(_this.listSelected)
            //-----删除银行卡-解绑-------//
            let value7 = {
              //卡类型
              'crd_typ':  _this.listSelected.crd_typ,
              //银行编码
              'bnk_no':  _this.listSelected.bnk_no,
              //支付密码
              'pswd': _this.payPwd,
              //客户端随机因子
              'rdm_salt': _this.randomSalt,
              //协议号
              'agr_no': _this.listSelected.agr_no,
            }

            this.$api.post('unBindCard.do', value7, msg => {
              $('#NumberKeyboard').css('display','none')
              $("#showPSW1").val('')
              $('#forget_pay_box li').removeClass('active')

              _this.$emit('closeWithData',"提示并退出");
            }, fail => {
              //打开密码框
              this.showPsw = true;
              Toast(fail.gda.msg_inf);
            })
          }
          else{
            //0 充值 1 提现 其他关闭
            this.close();
          }

      },
      close: function () {
        $('#NumberKeyboard').css('display', 'none')
        this.$emit('close')
      },
      gosubmit: function () {
        if($('#sms_content').val().length != 6){
          Toast('请输入6位短信验证码')
        }else{
          var _this = this

          if('0'==_this.typeAction){
            //-----充值-------//
            let value5 = {
              //银行编码
              'bnk_no':_this.listSelected.bnk_no,
              //充值金额
              'trans_amt': (parseFloat(_this.inputMoney)*100) + '',
              //支付密码
              'pswd': _this.payPwd,
              //客户端随机因子
              'rdm_salt': _this.randomSalt,
              //协议号
              'agr_no': _this.listSelected.agr_no,
              //短信验证码
              'sms_code': $('#sms_content').val(),
              //短信token
              'sms_token': _this.smsToken,
              //短信序列号
              'sms_seq': _this.smsSeq,
            }


            _this.$api.post('recharge.do', value5, msg => {
              //充值成功，关闭弹窗
              $('#NumberKeyboard').css('display','none')
              $("#showPSW1").val('')
              $('#forget_pay_box li').removeClass('active')

              this.showResult = true;
              this.typeStateInfo = '充值成功'
              this.typeMsg = '';
              this.resultIconUrl = './static/images/icon_payment_success.png';
              clearInterval(timer)
              var showResultSecond = 3
              var timer = setInterval(function(){
                showResultSecond --;
                console.log('showResultSecond:'+showResultSecond)
                if(showResultSecond < 0){
                  clearInterval(timer)
                  console.log('提示并退出')
                  _this.$emit('closeWithData',"提示并退出");
                }
              },1000)
            }, fail => {

              //短信校验失败
              if('MHP00002' == fail.gda.msg_cd){
                Toast(fail.gda.msg_inf);
              }else{
                //充值处理中
                if('MHP00001' == fail.gda.msg_cd){
                  this.typeStateInfo = fail.gda.msg_inf;
                  this.typeMsg = '';
                  this.resultIconUrl = './static/images/icon_payment_processing.png';
                }else{
                  //充值失败
                  this.typeStateInfo = '充值失败';
                  this.typeMsg = fail.gda.msg_inf;
                  this.resultIconUrl = './static/images/icon_payment_fail.png';
                }

                this.showResult = true;
                clearInterval(timer)
                var showResultSecond = 3
                var timer = setInterval(function(){
                  showResultSecond --;
                  console.log('showResultSecond:'+showResultSecond)
                  if(showResultSecond < 0){
                    clearInterval(timer)
                    console.log('提示并退出')
                    _this.$emit('closeWithData',"提示并退出");
                  }
                },1000)
              }
            })
          }else{
            _this.close()
          }
        }
      },
      resend: function () {
        var _this = this
        $("#btn-sms").attr('disabled',true)
        //0 充值 1 提现
        if('0'==_this.typeAction){
          let params = {
            //协议号
            'agr_no':_this.listSelected.agr_no,
            //充值金额
            'trans_amt': (parseFloat(_this.inputMoney)*100) + '',
          }
          _this.$api.post('rechargeSmsSnd.do', params , msg => {
            //打开短信框
            this.showSms = true;
            _this.smsToken = msg.sms_token
            _this.smsSeq = msg.sms_seq
            _this.showMblNo = msg.show_mbl_no
            clearInterval(timer)
            var timer = setInterval(function(){
              $('.btn-sms').text('重新发送(' +_this.second + 's)')
              $('.btn-sms').css({'background-color':'#CACED7','color':'white'})
              _this.second--
              if(_this.second < 0){
                $('.btn-sms').css({'background-color':'#E84F47','color':'white'})
                $('.btn-sms').text('重新发送')
                _this.second = 60
                clearInterval(timer)
                if (_this.second === 60) {
                  $("#btn-sms").attr('disabled',false)
                }
              }
            },1000)
          }, fail => {
            this.close()
            Toast(fail.gda.msg_inf);
          })
        }else{
          this.close();
        }

      },
      forgetPsw:function(){
        var _this = this
				_this.$router.push({name: 'forget'})
      },
    }

  }
</script>

<style scoped>
  .wdNity {
    width: 90%;
    margin: 0 auto;
    color: #cccccc;
    font-size: 0.8rem;
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
    height: 68%;
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

  .put-sms-code {
    font-size: 0px;
    height: 3.125rem;
    border: 1px solid #eee;
    border-radius: 0.2rem;
    margin-bottom: 1.94rem;
    margin-top: 1.125rem;
  }

  .submit {
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

  .text-input {
    width: 63%;
    height: 3.125rem;
    line-height: 3.125rem;
    border: none;
    font-size: 1rem;
    outline: none;
    padding-left: 0.5rem;
  }

  .btn-sms {
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

  /*.payment_box div {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: 3rem;
    background: url('../../images/passeord-dot.png') no-repeat center center;
    background-size: 0.75rem;
  }*/

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
<style>
	.neverUseThisClass div{
		display: block;
    margin: 0 auto;
    width: 100%;
    height: 3rem;
    background: url('../../images/passeord-dot.png') no-repeat center center;
    background-size: 0.75rem;
	}
</style>
