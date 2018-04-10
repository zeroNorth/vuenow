<template>
  <div class="content">
    <div class="bankCardTips">
      <img :src="bankInfo.img_url" alt="" class="img">
      <div class="tips">
        <div class="bankName">{{bankInfo.bnk_nm}}</div>
        <div class="bankType">{{ bankInfo.crd_typ == "0" ? "储蓄卡" : "信用卡"}} | 尾号{{bankInfo.crdno_last}}</div>
      </div>
    </div>
    <div class="bankCardLimit">
      <span class="left">单笔限额</span>
      <span class="right">{{stokAmtLimit}}元</span>
    </div>
    <div class="bankCardLimit">
      <span class="left">单日限额</span>
      <span class="right">{{dayAmtLimit}}元</span>
    </div>
    <div class="manager" @click="press">
      <span>管理</span>
    </div>

    <!-- 删除 actionsheet -->
    <mt-popup v-model="sheetVisible" position="bottom" class="pickerStyle">
      <div class="alert-footer">
        <div  class="footer_button"  @click="deleteBankCard"><span style="color: #EC4949;">删除</span></div>
        <div  class="footer_button" @click="closeSheet" style="margin-top: 0.375rem;"><span style="color: #333333;">取消</span></div>
      </div>

    </mt-popup>

    <!-- 支付密码和短信弹框 -->
    <div class="positionPsw" v-if="showPayPwd">
      <commonPsw v-on:close="closePsw" v-on:closeWithData="closeWithData" :inputMoney="inputMoney" :cardNo="cardNo" :listSelected="bankInfo" :typeAction="typeAction"></commonPsw>
    </div>
  </div>
</template>
<script>
import numeral from 'numeral'
import commonPsw from '../../components/common/password'
import $ from 'jquery'
import { Toast } from 'mint-ui'
export default {
  name: 'bankCardDetail',
  data () {
    return {
      sheetVisible: false,
      inputMoney: '',
      showPayPwd: false,
      cardNo:'',
      //删除银行卡
      typeAction:'2',
      bankInfo1:this.$route.query.bankInfo1,
      bankInfo: ''
    }
  },
  computed: {
    stokAmtLimit:function () {
      return numeral(
            parseFloat(this.bankInfo.stok_amt_limit) / 100
          ).format("0,0.00")
    },
    dayAmtLimit:function () {
      return  numeral(
            parseFloat(this.bankInfo.day_amt_limit) / 100
          ).format("0,0.00")
    }
  },
  activated () {
  	this.bankInfo1 = this.$route.query.bankInfo1
  	this.bankInfo = JSON.parse(this.bankInfo1)
  },
  methods: {
    deleteBankCard: function () {
      this.showPayPwd = true
      this.sheetVisible = false;
    },
    press: function() {
      this.sheetVisible = true
    },
    //从密码控件页面传回来数据
    closeWithData(msg) {
      this.showPayPwd = false
      Toast('删卡成功');
      this.$router.go(-1);
    },
    closePsw: function () {
      this.showPayPwd = false
    },
    closeSheet: function(){
      this.sheetVisible = false;
    },
  },
  components: {
    commonPsw
  }
}
</script>
<style scoped>
.bankCardTips {
  background-color: white;
  border-bottom: 0.5px solid lightgray;
  width: 100%;
  height: 4rem;
}
img{
  margin-left: 1rem;
  float: left;
  padding-top: 1rem;
  width: 2rem;
  height: 2rem;
}
.tips {
  float: left;
  margin-left: 1rem;
  padding-top: 0.75rem;
}
.bankName {
  font-size: 1rem;
}
.bankType {
  font-size: 0.75rem;
  color: lightgray;
}
.bankCardLimit {
  background-color: white;
  border-bottom: 0.5px solid lightgray;
  width: 100%;
  height: 3rem;
  line-height: 3rem;
}
.left {
  float: left;
  margin-left: 1rem;
}
.right {
  float: right;
  margin-right: 1rem;
}
.mint-actionsheet-listitem {
  color: red;
}
.manager {
  background-color: white;
  border-radius: 3px;
  margin: 1rem;
  font-size: 1rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
}

.positionPsw {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.pickerStyle{
  background: #F5F6F8;
  width: 100%;
}

.alert-footer {
  text-align: center;
  line-height: 3.05rem;
  background: #F4F6F7;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 6.05rem;
}

.footer_button {
  padding: 0 0.9375rem;
  height: 3.05rem;
  line-height: 1.875rem;
  font-size: 0.9375rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: Center;
  background: white;
}
</style>


