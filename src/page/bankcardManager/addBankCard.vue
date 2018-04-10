<template>
  <div class="content">
    <p>请绑定与持卡人姓名一致的银行卡</p>
    <div class="bankInfo">
      <div class="name line" style="position: relative;">
        <span class="left"> 姓名</span>
        <input class="right openAccInfoInp" placeholder="请输入姓名" maxlength="6" type="text" v-model="name" :readonly ="isCertification" v-on:input="checkName"
               onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\u4E00-\u9FA5]/g,''))"/>
        <span v-show="isCertification1" class="clearName" @click="clearNm"></span>
      </div>
      <div class="name line">
        <span class="left"> 卡号</span>
        <input class="right openAccInfoInp" placeholder="请输入银行卡号" type="tel" maxlength="23" v-model="card_no" v-on:input="openFourSp" />
        <!-- <img src="../../images/icons_list_input_photo@2x.png" alt=""> -->
      </div>
    </div>
    <div style="margin-right: 1rem">
      <span class="supportLab" @click="supportLablClick">支持的银行卡</span>
    </div>
    <div class="footer">
      <div class="nextButton" :class="{ bgRed: choose }" @click="nextClick">下一步</div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import store from '../../store/store.js'
  import {
    Toast
  } from 'mint-ui'
  export default {
    name: 'addBankCard',
    data() {
      return {
        name: '',//this.$route.params.cusnm,
        idNo: '',//this.$route.params.idno,
        card_no: '',
        isCertification:'',
        isFromWithdraw:this.$route.params.selectType
      }
    },
    computed: {
      handle: function() {
        return this.idNo.replace(/\D/g, '').replace(/....(?!$)/g, '$& ')
      },
      choose: function() {
        if ((this.card_no.length >= 15) && (this.name.length >= 2)) {
          return true
        } else {
          return false
        }
      },
      isCertification1: function () {
      	if (!this.isCertification && this.name !== '') {
      		return true
      	} else {
      		return false
      	}
      }
    },

    created:function(){
      if('02'== this.$store.state.realnm_flg){
        this.isCertification = true;
      }else{
        this.isCertification = false;
      }
      this.name = this.$store.state.name;
      this.idNo = this.$store.state.id_no;
    },

    methods: {
    	checkName: function (){
    		this.name=this.name.replace(/[^\u4E00-\u9FA5]/g,'')
    	},
    	//如果可以清楚则点击清楚姓名
    	clearNm: function () {
    		if (this.isCertification) return
    		this.name = ''
    	},
      //查询是否绑卡
      bindCardVfy:function(){
        let params = {
          'card_no': this.card_no.replace(/\s+/g, '')
        }
        this.$api.post('bindCardVfy.do', params, msg => {
          this.queryCardTyp()
        }, fail => {
          Toast(fail.gda.msg_inf)
        })
      },
      queryCardTyp:function () {
        let params = {
          'card_no': this.card_no.replace(/\s+/g, '')
        }
        this.$api.post('bindCardInfoQry.do', params, msg => {
          if((this.isFromWithdraw == '0'|| this.isFromWithdraw == '1')&& msg.crd_typ == '01'){
            Toast('请使用借记卡')
            return
          }
          var _this = this;
          let params = {
          //
          'bankNm': msg.bnk_nm,
          //银行卡类型：0-借记卡 1-信用卡
          'cardTyp': msg.crd_typ,
          //姓名
          'name': _this.name,
          //证件号
          'idNo': _this.idNo,
          'card_Abb':msg.bnk_no,
          //银行卡号
          'cardNo': _this.card_no.replace(/\s+/g, ''),
          'isCertification':_this.isCertification
        }
        _this.$router.push({
          'path': 'inputCardMsg',
          query: params
        })
        }, fail => {
          Toast(fail.gda.msg_inf)
        })
      },
      supportLablClick:function () {
        this.$router.push({
          'name': 'supportCard'
        })
      },
      openFourSp: function() {
        this.card_no = this.card_no.replace(/\D/g, '').replace(/....(?!$)/g, '$& ')
      },
      tipsShow: function() {
        this.show = true
      },
      tipsHide: function() {
        this.show = false
      },
      nextClick: function() {
        var _this = this;
        if ((_this.name) != '') {
          if (this.name.length == 1) {
            Toast('请输入正确的姓名')
            return
          }
        } else {
          Toast('姓名不能为空')
          return
        }
        let creditInf1 = _this.card_no.replace(/\s+/g, '')
        if (creditInf1 == '') {
          Toast('银行卡号不能为空')
          return
        } else if (creditInf1 < 19) {
          Toast('请输入正确的银行卡号')
          return
        }
        this.bindCardVfy()
      }
    }
  }
</script>


<style scoped>
  .supportLab{
    color:#E84F47;
    width: 100%;
    text-align: right;
    vertical-align: middle;
    margin-top: 0.8rem;
    margin-bottom: -0.8rem;
    display: inline-block;
  }
  .perInfo {
    background: white;
    height: 6.25rem;
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
    height: 100%;
    color: #333333;
  }
  input[disabled]{
    color:#333333;
    opacity:1
  }
  .bankInfo {
    /* margin-top: 1rem; */
    background: white;
    height: 6.25rem;
  }

  p {
    margin-left: 1rem;
    font-size: 0.875rem;
    line-height: 3.125rem;
    color: #333333;
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
    z-index: 100;
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
  .clearName{
  	position: absolute;
  	right: 1rem;
  	top: 50%;
  	width: 1rem;
  	height: 1rem;
  	margin-top: -0.5rem;
  	background: url('../../images/clear.png') center center no-repeat;
    background-size: 100% 100%;
  }
</style>

