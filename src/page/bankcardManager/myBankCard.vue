<template>
  <div class="content">
    <ul style="margin-top: 1rem;">
      <li v-for="(item, index) in bankList" class = "list" @click="itemPressed(index)">
        <div class="list_top" :style= "{background:'#'+ item.org_color}">
        <span class="list_bankName"> {{ item.bnk_nm }}<span style="display:inline-block;padding-left:1rem"></span>{{ item.crd_typ == "0" ? "储蓄卡" : "信用卡"}}</span>
        </div>
        <div class="list_bottom">
          <img :src="item.img_url" alt="">
          <span class="list_cardNumber"> **** **** **** {{ item.crdno_last }}</span>
        </div>
      </li>
      <div class="addBankCard" @click="addBankCard">
        <span>＋ 添加银行卡</span>
      </div>
    </ul>

    <!-- 绑卡、设置密码弹窗提示 -->
    <div v-if="showAlert">
      <alertTip v-on:dismiss="dismiss" v-on:dismissWithData="dismissWithData" :tip="bindTip" :cancel="tipCancel" :commit="tipCommit" :commitData="commitData"></alertTip>
    </div>

  </div>

</template>
<script>

  import alertTip from '../../components/common/alert'
  import store from '../../store/store.js'
  import { Toast } from 'mint-ui'

export default {
  name: "myBankCard",
  data() {
    return {
      bankList: [],
      showAlert: false,
      bindTip:'',
      tipCancel:'',
      tipCommit:'',
      commitData:'',
    };
  },

  components: {
    alertTip
  },

  created() {
    var _this = this;

    let param = {
      //查询类型 	0：借记卡  1：信用卡 2：全部
      'qry_typ':'2',
    }

    _this.$api.post(
      "bindCardsQry.do",
      param,
      data => {
        _this.bankList = data.data;
        for (var i = 0; i < _this.bindCardList.length; i++) {
          _this.bankList[i].stokAmtLimitFomart = numeral(
            parseFloat(_this.bindCardList[i].stokAmtLimit) / 100
          ).format("0,0.00");
          _this.bankList[i].dayAmtLimitFomart = numeral(
            parseFloat(_this.bankList[i].dayAmtLimit) / 100
          ).format("0,0.00");
        }
        _this.setCurrentData(0);
      },
      fail => {}
    );

    this.qryUserInfo();
  },
  methods: {
    addBankCard: function() {
      this.$router.push({
        name: "addBankCard",
        params: { 'selectType':"0" }
      });
    },
    itemPressed: function(index) {
      this.$router.push({
        path: "bankCardDetail",
        query: {bankInfo1:JSON.stringify(this.bankList[index])}
      });
    },

    qryUserInfo: function (){
      var _this = this;
      _this.$api.post('usrInfQry.do', null, data => {
        _this.$store.state.realnm_flg = data.realnm_flg;
        _this.$store.state.usr_id = data.usr_id;
        _this.$store.state.bal = data.bal;
        _this.$store.state.name = data.name;
        _this.$store.state.id_no = data.id_no;
        _this.$store.state.first_log_flg = data.first_log_flg;
        _this.$store.state.psw_flg = data.psw_flg;

        //是否是临时登录密码 Y是 N否
        if(this.$store.state.first_log_flg&&this.$store.state.first_log_flg=='Y'){
          this.showAlertAction('setLoginPsw');
        }else if(this.$store.state.psw_flg&&this.$store.state.psw_flg=='N'){
          //是否设置了支付密码 Y是 N否
          this.showAlertAction('setPayPsw');
        }
      }, fail => {
        Toast(fail.gda.msg_inf);
        setTimeout(function() {
          //在微信里关闭页面
          WeixinJSBridge.call('closeWindow');
        },2000)
      })
    },

    dismiss: function () {
      this.showAlert = false
      //在微信里关闭页面
      WeixinJSBridge.call('closeWindow');
    },

    dismissWithData(action){
      this.showAlert = false
      if(action&&'setLoginPsw'== action){
        this.$router.push({
          name:'loginPsw'
        })
      }else if(action&&'setPayPsw'== action){
        this.$router.push({
          name:'forgetPsw'
        })
      }
    },

    showAlertAction: function (action) {
      this.showAlert = true;
      if(action&&'setLoginPsw'== action){
        this.bindTip = '您目前使用的是临时登录密码，为了账户安全，请重新设置登录密码。';
        this.tipCancel = '退出';
        this.tipCommit = '确定';
        this.commitData = 'setLoginPsw'
      }else if(action&&'setPayPsw'== action){
        this.bindTip = '您还未设置支付密码，为了资金安全，请您设置支付密码。';
        this.tipCancel = '退出';
        this.tipCommit = '确定';
        this.commitData = 'setPayPsw'
      }
    },

  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
}
.list {
  margin: 1rem;
  border-color: white;
}
.list:first-child{
	margin-top: 0;
}
.list_top {
  background-color: cyan;
  height: 3rem;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.list_bankName {
  margin-left: 0.5rem;
  margin-top: 1rem;
  font-size: 1rem;
  color: white;
  line-height: 3rem;
}
.list_bottom {
  background-color: white;
  height: 3.5rem;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
img {
  padding-top: 0.75rem;
  margin-left: 1rem;
  width: 2rem;
  height: 2rem;
}
.list_cardNumber {
  float: right;
  font-size: 1rem;
  line-height: 3.5rem;
  margin-right: 1rem;
}
.addBankCard {
  background-color: white;
  border-radius: 3px;
  margin: 1rem;
  font-size: 1rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
}
</style>

