<template>
  <div class="content">
    <keep-alive>
          <router-view></router-view>
    </keep-alive>

    <p style="height: 2rem">银行卡信息已经被保护</p>
    <div class="perInfo">
      <div class="name line">
        <span class="left">姓名</span>
        <span class="info_right" id="name"> {{ name }}</span>
      </div>
      <div class="name line">
        <span class="left"> 身份证号</span>
        <input class="right openAccInfoInp" placeholder="请输入身份证号" maxlength="18" v-model="idNo" :readonly ="isCertification"/>
      </div>
      <div class="name line">
        <span class="left">卡号</span>
        <span class="info_right" id="cardNo"> {{ card_no }}</span>
      </div>
      <div class="name line">
        <span class="left">银行</span>
        <span class="info_right" id="bankNm"> {{ bankNm }}</span>
      </div>
      <div class="name" :class ="{line:isCreditCard}">
        <span class="left">卡类型</span>
        <span class="info_right" id="cardTyp"> {{ cardTyp }}</span>
      </div>
    </div>
    <div class="creditCard" v-show="isCreditCard">
      <div class="name line" style="position:relative">
        <span class="left"> 有效期</span>
        <input class="right openAccInfoInp" placeholder="卡正面有效期 月份/年份" maxlength="4" v-model="expirationDate"/>

        <img class="phoneExplain" src="../../images/tips@2x.png"  @click="expirationShow">
        <div class="alert-info" @click.stop="" v-show="expirationshow">
          <div class="alert-layer"></div>
          <div class="alert-text" style="height: 15.5rem">
            <div class="alert-title">
              <span>有效期说明</span>
            </div>
            <div>
              <img  src="../../images/validateLogo@2x.png" class="validateImg"></div>
            <div class="alert-content" style="padding-top: 0.5rem">
              <span>有效期是打印在信用卡正面卡号下方，标准格式为月份在前，年份在后的一串数字。</span>
              <div class="alert-footer">
                <span @click="expirationHide">知道了</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="name">
        <span class="left"> CVN2</span>
        <input class="right openAccInfoInp" placeholder="XXX" maxlength="3" v-model="cvn2"/>
      </div>
    </div>
    <div style="height: 1.5rem"></div>
    <div class="bankInfo">
      <div class="name" style="position:relative">
        <span class="left"> 手机号</span>
        <input class="right openAccInfoInp" placeholder="银行预留手机号" type="tel" maxlength="11" v-model="phone" onkeyup="this.value=this.value.replace(/\D/g,'')" />
        <img class="phoneExplain" src="../../images/tips@2x.png" alt="" @click="tipsShow">
        <div class="alert-info" @click.stop="" v-show="show">
          <div class="alert-layer"></div>
          <div class="alert-text">
            <div class="alert-title">
              <span>手机号说明</span>
            </div>
            <div class="alert-content">
              <span>银行预留的手机号码是办理该银行卡时所写的手机号码。没有预留手机号码或者停用，请联系银行客服更新处理。</span>
              <div class="alert-footer">
                <span @click="tipsHide">知道了</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="checkBox">
      <img class="checkBoxImg" :src="srcValue" @click="checkClick" alt="">
      <span style="color:#939393;vertical-align: middle;font-size: 0.8125rem;">同意</span><span><a style="color:#E84F47;vertical-align: middle;text-decoration:none;font-size: 0.8125rem;" :href="protocolUrl">《麦保付用户快捷支付服务协议》</a></span>
    </div>
    <div class="footer">
      <div class="nextButton" :class="{ bgRed: choose }" @click="nextClick">下一步</div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {
    Toast
  } from 'mint-ui'
  export default {
    name: 'inputCardMsg',
    data() {
      return {
        name: this.$route.query.name,
        idNo: this.addCoverupCode(this.$route.query.idNo),
        card_no: this.addCoverupCode(this.$route.query.cardNo),
        card_Abb:this.$route.query.card_Abb,
        bankNm: this.$route.query.bankNm,
        phone: '',
        //有效期
        expirationDate:'',
        isCertification:this.$route.query.isCertification,
        cvn2:'',
        params: '',
        show: false,
        expirationshow:false,
        checkValue:true
      }
    },
    computed: {
      protocolUrl:function(){
        var url = window.location.origin
        return url + '/mca/wap/agree/bindCardProtocol.html'
      },
      srcValue:function () {
        return this.checkValue?"./static/images/ic_agree_blue@2x.png":"./static/images/ic_agree@2x.png"
      },
      isCreditCard:function () {
        return this.$route.query.cardTyp == '0'?false:true
      },
      cardTyp:function () {
        return this.$route.query.cardTyp == '0'?'借记卡':'信用卡'
      },
      choose: function() {
        if ((/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(this.phone)) && (this.idNo.length == 15||this.idNo.length == 18) && (this.phone.length == 11)) {
          return true
        } else {
          return false
        }
      }
    },

    activated:function(){
      this.name = this.$route.query.name;
      this.card_no = this.addCoverupCode(this.$route.query.cardNo);
    },

    methods: {
      qSignSmsSnd:function(){
        var _this = this;
        let params = {
          'mbl_no':_this.phone,
          'cap_corg':_this.card_Abb,
          'card_typ':_this.$route.query.cardTyp,
          'card_no': _this.$route.query.cardNo,
          'cvv2':_this.cvn2,
          'exp_tm':_this.expirationDate
        }
        if(!_this.isCertification){
          params.id_typ = '01'
          params.id_nm = encodeURI(encodeURI(_this.name))//_this.name
          params.id_no = _this.idNo
        }
        this.$api.post('qSignSmsSnd.do', params, msg => {
          let params = {
          'isCertification':_this.isCertification,
          'show_mbl_no':msg.show_mbl_no,
          'bnk_no':_this.card_Abb,//银行编码
          'card_no':_this.$route.query.cardNo,//卡号
          'phone':_this.phone,//银行预留手机号
          'type':_this.$route.query.cardTyp,//卡类型
          'id_name':_this.name,
          'id_no':_this.idNo,
          'cvn2':_this.cvn2,
          'exp_tm':_this.expirationDate,
          'token':msg.sms_token,
          'sms_seq':msg.sms_seq,//短息序列号
        }
        _this.$router.push({
          'path': 'inputSmsCode',
          query: params
        })
        }, fail => {
          Toast(fail.gda.msg_inf)
        })
      },
      checkClick:function () {
        this.checkValue = !this.checkValue
      },
      addCoverupCode:function (val) {
        if(!val){
          return ''
        }
        var arr = val.split('')
        var temp = '';
        for(var i = 0;i < arr.length - 8;i++){
          temp+='*'
        }
        arr.splice(4,arr.length - 8,temp)
        return arr.join('');
      },
      expirationShow:function () {
        this.expirationshow = true
      },
      expirationHide:function () {
        this.expirationshow = false
      },
      tipsShow: function() {
        this.show = true
      },
      tipsHide: function() {
        this.show = false
      },
      nextClick: function() {
        var _this = this;
        $(".openAccInfoInp").blur()
        let idno = _this.idNo
        if (idno == '') {
          Toast('身份证号不能为空')
          return
        } else if (idno.length != 18) {
          Toast('请输入有效的身份证号')
          return
        }
        if(this.$route.query.cardTyp == '1'){
          let expirationDate = _this.expirationDate
          let cvn2 = _this.cvn2
          if(expirationDate == ''){
            Toast('有效期不能为空')
            return;
          }
          if(cvn2 == ''){
            Toast('cvn2不能为空')
            return;
          }
        }
        if ((_this.phone) != '') {
          if (this.phone.length <= 10) {
            Toast('请输入正确的手机号')
            return
          } else {
            if (!(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(_this.phone))) {
              Toast('请输入正确的手机号')
              return
            }
          }
        } else {
          Toast('手机号不能为空')
          return
        }
        if(!_this.checkValue){
          Toast('请阅读并同意《麦保付用户快捷支付协议》')
          return
        }
        _this.qSignSmsSnd()
        return
      }
    }
  }
</script>


<style scoped>
  .checkBox{
    margin-left: 1rem;
    margin-top: 0.5rem;
    height: 1.5rem;
  }
  .creditCard {
    margin-top: 0rem;
    background: white;
    height: 6.25rem;
  }
  .perInfo {
    margin-top: 1rem;
    background: white;
    height: 16.025rem;
  }

  .name {
    height: 3.125rem;
    font-size: 0.875rem;
    line-height: 3.125rem;
  }

  .left {
    display: inline-block;
    margin-left: 1rem;
    width: 20%;
    color: #333333;
  }

  .line {
    border-bottom: 1px solid #F0F0F0;
  }

  .info_right {
    width: 60%;
    color: #333333;
  }

  .right {
    outline: none;
    font-size: 0.875rem;
    border: none;
    width: 60%;
    color: #333333;
  }
  input[disabled]{
    color:#333333;
    opacity:1
    }
  .bankInfo {
    /* margin-top: 1rem; */
    background: white;
    height: 3.12rem;
  }

  p {
    margin-left: 1rem;
    font-size: 0.875rem;
    line-height: 3.125rem;
    color: #333333;
  }

  .phoneExplain {
    vertical-align: middle;
    width: 1.1rem;
    height: 1.1rem;
    position: absolute;
    right: 17px;
    top: 52%;
    margin-top: -12px;
  }
  .validateImg{
    width:7.0625rem;
    height:4.0625rem;
    margin-left: 4.75rem;
    margin-top: -0.5rem;
  }
  .checkBoxImg {
    vertical-align: middle;
    width: 0.9375rem;
    height: 0.9375rem;
    right: 17px;
    top: 50%;
  }
  .nextButton {
    background: #EFEFEF;
    color: #CCCCCC;
    width: 90%;
    margin: 1.5rem auto 0rem;
    height: 3rem;
    text-align: center;
    line-height: 3rem;
    border-radius: 0.375rem;
  }

  .tips {
    width: 100%;
    text-align: center;
    margin-left: 0;
  }

  .alert-info {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 300;
  }

  .alert-layer {
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.4;
  }

  .alert-text {
    position: absolute;
    left: 50%;
    top: 50%;
    /* width: 100%; */
    width: 16.875rem;
    height: 12.5rem;
    background: #fff;
    z-index: 200;
    margin: -6.25rem 0 0 -8.4375rem;
    border-radius: 6px;
  }

  .alert-title {
    height: 3.875rem;
    line-height: 3.875rem;
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
  }

  .alert-content {
    width: 90%;
    margin: 0 auto;
    font-size: 0.875rem;
    padding-top: 0rem;
    line-height: 1.5rem;
  }

  .alert-footer {
    text-align: center;
    border-top: 1px solid #dcdcdc;
    line-height: 2.5rem;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2.5rem;
  }

  .alert-footer span {
    color: #E84F47;
    font-size: 1rem;
  }

  .bgRed {
    background: #E84F47;
    color: white;
  }
</style>
