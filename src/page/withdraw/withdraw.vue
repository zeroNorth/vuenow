<template>
  <div class="div-info">
    <ul style="margin-top: 1.2rem;">
      <div class="type-selected">

        <!-- 银行卡的item -->
        <div class="type-item" v-if="!listSelected" @click="selectCard">
        </div>
        <div class="item-padding type-item"  @click="selectCard" v-else>
          <div class="fl other-pic1">
            <img :src="imgUrl" class="img-wh"/>
          </div>
          <div class="fl">
            <p class="otherP">{{this.bnkName}} {{'0'==this.crdTyp?'储蓄卡':'信用卡'}} {{this.crdNoLast}}</p>
          </div>
          <div class="fr other-pic1">
            <img src="../../images/arrow@2x.png" class="img-arraw"/>
          </div>
        </div>

      </div>
      <div class="top-tip">
        <div class="inputEdit">
          <span class="he unit-style">金额</span>
          <input type="text" maxlength="11" class="he input-style" v-model="inputMoney" id="moneyInput"  onkeyup="var p2 = parseFloat(value).toFixed(2);value = p2>=0?(/\.0?$/.test(value)?value:p2.replace(/0$/,'').replace(/\.0$/,'')):''" onblur="value = value.replace(/\.0*$/,'')"/>
        </div>

      </div>
      <div class="nextButton" :class="{ bgRed: choose }" @click="nextClick">下一步</div>
    </ul>
    <!-- 支付密码和短信弹框 -->
    <div class="positionPsw" v-if="showPayPwd">
      <commonPsw v-on:close="closePsw" v-on:closeWithData="closeWithData" :inputMoney="inputMoney" :cardNo="cardNo" :listSelected="listSelected" :typeAction="typeAction"></commonPsw>
    </div>

    <!-- 绑卡、设置密码弹窗提示 -->
    <div v-if="showAlert">
      <alertTip v-on:dismiss="dismiss" v-on:dismissWithData="dismissWithData" :tip="bindTip" :cancel="tipCancel" :commit="tipCommit" :commitData="commitData"></alertTip>
    </div>
  </div>
</template>

<script>
  import numeral from 'numeral'
  import commonPsw from '../../components/common/password'
  import alertTip from '../../components/common/alert'
  import $ from 'jquery'
  import { Toast } from 'mint-ui'
  import store from '../../store/store.js'

  export default {
    name: 'withdraw',
    data() {
      return {
        inputMoney: '',
        showPayPwd: false,
        showAlert: false,
        cardNo: '',
        //0 充值 1 提现
        typeAction:'1',
        showList:false,
        //没有余额
        noBal:false,
        //crdTyp 卡类型 0：借记卡 1：信用卡
        bindCardList:[],
        bnkName:'',
        crdTyp:'',
        crdNoLast:'',
        stokAmtLimit:'',
        stokAmtLimitFomart:'',
        dayAmtLimit:'',
        dayAmtLimitFomart:'',
        imgUrl:'',
        accountBal:'',
        currentIndex:'',
        listSelected:'',
        bindTip:'您还未绑定借记卡，请先添加',
        tipCancel:'取消',
        tipCommit:'添加',
        commitData:'addCard',
      }
    },
    computed: {
      choose: function () {
        if (this.inputMoney.length > 0 && parseFloat(this.inputMoney) > 0) {
          if(parseFloat(this.inputMoney)>(parseFloat(this.accountBal)/100)){
            this.noBal = true;
            return false;
          }else{
            this.noBal = false;
            return true;
          }
        } else {
          return false;
        }
      }
    },

    activated: function () {
      this.initData();
    },
    components: {
      commonPsw,
      alertTip
    },
    created: function () {
      this.$store.state.select_type = this.typeAction;
      this.bindCardList = '';
      this.listSelected = this.$route.params.listSelected;
      if(this.listSelected){
        this.bnkName = this.listSelected.bnk_nm;
        this.crdTyp = this.listSelected.crd_typ;
        this.crdNoLast = this.listSelected.crdno_last;
        this.stokAmtLimitFomart = this.listSelected.stokAmtLimitFomart;
        this.dayAmtLimitFomart = this.listSelected.dayAmtLimitFomart;
        this.imgUrl = this.listSelected.img_url;
      }else{
        //查询绑定银行卡
        this.qryBindCrdInfo();
      }
      this.qryUserInfo();
    },

    mounted: function () {
    },

//    beforeRouteLeave: (to, from, next) => {
//
////      if(to.path=='/openAccount'||to.path=='/rollMoneyInResult'){
////        next();
////      }else{
////        next('/openAccount');
////      }
//
//    },


    methods: {
      initData: function () {
        this.listSelected = this.$route.params.listSelected;
        this.inputMoney = ''
        this.showPayPwd = false

      },

      //选择方式后，设置item数据
      setCurrentData: function (index) {
        var _this = this
        if(_this.bindCardList.length>0){
          _this.currentIndex = index;
          _this.listSelected = _this.bindCardList[index];

          //获取某一条数据
          _this.bnkName = _this.bindCardList[index].bnk_nm;
          _this.crdTyp = _this.bindCardList[index].crd_typ;
          _this.crdNoLast = _this.bindCardList[index].crdno_last;
          _this.stokAmtLimitFomart = _this.bindCardList[index].stokAmtLimitFomart;
          _this.dayAmtLimitFomart = _this.bindCardList[index].dayAmtLimitFomart;
          _this.imgUrl = _this.bindCardList[index].img_url;

        }
      },

      qryBindCrdInfo:function(){
        var _this = this
//        for (var i=0;i<_this.bindCardList.length;i++)
//        {
//          _this.bindCardList[i].stokAmtLimitFomart = numeral(parseFloat(_this.bindCardList[i].stok_amt_limit)/100).format('0,0.00')
//          _this.bindCardList[i].dayAmtLimitFomart = numeral(parseFloat(_this.bindCardList[i].day_amt_limit)/100).format('0,0.00')
//        }
//
//        _this.setCurrentData(0);

        let param = {
          //查询类型 	0：借记卡  1：信用卡 2：全部
          'qry_typ':'0',
        }

        _this.$api.post('bindCardsQry.do', param, data => {
          _this.bindCardList = data.data;
//          alert(JSON.stringify(data));
          if(_this.bindCardList){
            for (var i=0;i<_this.bindCardList.length;i++)
            {
              _this.bindCardList[i].stokAmtLimitFomart = numeral(parseFloat(_this.bindCardList[i].stok_amt_limit)/100).format('0,0.00')
              _this.bindCardList[i].dayAmtLimitFomart = numeral(parseFloat(_this.bindCardList[i].day_amt_limit)/100).format('0,0.00')
            }
            _this.setCurrentData(0);

          }else{
            //绑卡弹窗提示
            this.showAlert = true;
          }

        }, fail => {

        })
      },

      nextClick: function () {
        var _this = this;
        if (!(/^(0?|[1-9]\d*)(\.\d{0,2})?$/.test(_this.inputMoney))) {
        	Toast('请输入合法的金额')
        	return
        }
        if (this.inputMoney.length > 0 && parseFloat(this.inputMoney) > 0) {
          if(parseFloat(this.inputMoney)>(parseFloat(this.accountBal)/100)){
            //余额不足
            return ;
          }else if(parseFloat(this.inputMoney)>(parseFloat(this.listSelected.wdc_amt_limit)/100)){
            Toast('提现金额不能大于'+numeral(parseFloat(this.listSelected.wdc_amt_limit)/100).format('0,0.00')+'元')
            return;
          }
          //----------------提现---------------//
          //弹出密码框
          _this.showPayPwd = true;
          //----------------提现---------------//

        }
      },
      closePsw: function () {
        this.showPayPwd = false
      },
      selectCard: function () {
        var _this = this
        if(_this.listSelected){
          this.$router.push({
            name:'selectBankcard',
            //selectType 0 充值 1 提现
            params: {selectType: '1'}
          })
        }else{
          //绑卡弹窗提示
          this.showAlertAction('addCard');
        }
      },

      dismiss: function () {
        this.showAlert = false
        //在微信里关闭页面
        WeixinJSBridge.call('closeWindow');
      },

      dismissWithData(action){
        this.showAlert = false
        if(action&&'addCard'== action){
          this.$router.push({
            name:'addBankCard',
            //selectType 0 充值 1 提现
            params: {selectType: '1'}
          })
        }else if(action&&'setLoginPsw'== action){
          this.$router.push({
            name:'loginPsw'
          })
        }else if(action&&'setPayPsw'== action){
          this.$router.push({
            name:'forgetPsw'
          })
        }
      },

      closePsw: function () {
        this.showPayPwd = false
      },

      //从密码控件页面传回来数据
      closeWithData(msg) {
        this.showPayPwd = false
        //在微信里关闭页面
        WeixinJSBridge.call('closeWindow');
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

          this.accountBal = data.bal;
          if(this.accountBal==null||(this.accountBal!=null&&parseFloat(this.accountBal)==0)){
            this.accountBal = '0.00';
          }
          $("#moneyInput").attr('placeholder','可提现金额'+numeral(parseFloat(this.accountBal)/100).format('0,0.00')+'元');
          }, fail => {
          Toast(fail.gda.msg_inf);
          setTimeout(function() {
            //在微信里关闭页面
            WeixinJSBridge.call('closeWindow');
          },2000)
        })
      },

      showAlertAction: function (action) {
        this.showAlert = true;
        if(action&&'addCard'== action){
          this.bindTip = '您还未绑定借记卡，请先添加';
          this.tipCancel = '取消';
          this.tipCommit = '添加';
          this.commitData = 'addCard'
        }else if(action&&'setLoginPsw'== action){
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
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  li {
    list-style: none;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
  }


  .top-tip {
    background: #fff;
    height: 3.25rem;
    display: block;
    margin: 1.2rem 0px;
  }


  .inputEdit {
    display: block;
    justify-content: center;
    height: 3.25rem;
    box-sizing: border-box;
    padding: 0 4%;
  }

  .input-style {
    border: none;
    outline: none;
    width: 70%;
    font-size: 1.05rem;
    line-height: 1.2rem;
  }

  .he {
    display: inline-block;
  }

  .nextButton {
    background: #EFEFEF;
    color: #CCCCCC;
    width: 92%;
    margin: 2.4rem auto 0rem;
    height: 2.85rem;
    display: flex;
    justify-content: center;
    align-items: Center;
    border-radius: 0.3rem;
  }

  .unit-style {
    color: #666666;
    font-size: 1.08rem;
    margin-right: 0.5rem;
    line-height: 3.25rem;
  }

  .positionPsw {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
  }

  .bgRed {
    background: #E84F47;
    color: white;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .other-pic1 {
    height: 3rem;
    line-height: 3rem;
  }

  .img-wh {
    width: 1.875rem;
    height: 1.875rem;
    vertical-align: middle;
    padding-bottom: 1rem;
  }

  .otherP {
    height: 1.06rem;
    line-height: 1.06rem;
    margin-left: 0.5rem;
    color: #666666;
    text-align: left;
    margin-top: 0.6rem;
    font-weight: bold;
    font-size: 0.875rem;
  }

  .shadoww {
    margin-left: 0.5rem;
    margin-top: 0.3125rem;
    color: #939393;
    font-size: 0.875rem;
  }

  .type-item{
    background: #fff;
    height:3rem;
    display: block;
    align-items:left;
    padding-top: 0.75rem;
  }

  .item-padding{
    padding-left: 1rem;
  }


  .img-arraw {
    width: 0.5rem;
    height: 1rem;
    position: absolute;
    margin-top: 0.5rem;
    right: 1rem;
  }

  .he{
    display: inline-block;
  }

</style>
