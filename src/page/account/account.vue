<template>
  <div>

    <div class="topView">
      <div class="fl" style="line-height: 5.7rem;">
        <img :src="imgUrl" class="imgHead" :onerror="defaultUrl"/>
      </div>
      <div class="fl">
        <p class="userInfo userName">{{userName}}</p>
        <p class="userInfo userMobile" :class="{hasUserName:userName}">{{userId}}</p>
      </div>
    </div>

    <div class="balView">
      <div class="balTitle"><span>余额</span></div>
      <div class="balValue"><span>{{userBal}}</span></div>
    </div>
    <ul style="background: white;">
      <hr style="height:1px;border:none;border-top:1px solid #F0F0F0;margin:0"/>
      <li class="listItem" @click="showDetailTip">
        <div class="fl otherPic1">
          <img src="../../images/Balance_of_payments@2x.png" class="imgWh"/>
        </div>
        <div class="fr rightIcon">
          <img src="../../images/arrow@2x.png" class="img-arraw"/>
        </div>
        <div class="fl">
          <p class="otherP">收支明细</p>
        </div>
      </li>
      <hr style="height:1px;border:none;border-top:1px solid #F0F0F0;margin:0"/>
      <li class="listItem" @click="toPassword">

        <div class="fl otherPic1">
          <img src="../../images/Password_management@2x.png" class="imgWh"/>
        </div>
        <div class="fr rightIcon">
          <img src="../../images/arrow@2x.png" class="img-arraw"/>
        </div>
        <div class="fl">
          <p class="otherP">密码管理</p>
        </div>
      </li>
      <hr style="height:1px;border:none;border-top:1px solid #F0F0F0;margin:0"/>
      <li class="listItem" @click="showUnbindTip">
        <div class="fl otherPic1">
          <img src="../../images/Unbundling@2x.png" class="imgWh2"/>
        </div>
        <div class="fr rightIcon">
          <img src="../../images/arrow@2x.png" class="img-arraw"/>
        </div>
        <div class="fl">
          <p class="otherP">解除绑定</p>
        </div>
      </li>

    </ul>
    <!-- 绑卡、设置密码弹窗提示 -->
    <div v-if="showAlert">
      <alertTip v-on:dismiss="dismiss" v-on:dismissWithData="dismissWithData" :tip="bindTip" :cancel="tipCancel" :commit="tipCommit" :commitData="commitData"></alertTip>
    </div>

    <!-- 解绑提示 -->
    <div v-if="showUnbind">
      <unBindTip v-on:dismiss2="dismiss2" v-on:dismissWithData2="dismissWithData2" :title="unbindTitle" :tip2="unbindTip" :cancel2="tipCancel2" :commit2="tipCommit2" :commitData2="commitData2"></unBindTip>
    </div>
  </div>
</template>

<script>

  import alertTip from '../../components/common/alert'
  import unBindTip from '../../components/common/alert2'
  import { Toast } from 'mint-ui'
  import store from '../../store/store.js'
  import numeral from 'numeral'

  export default {
    name: 'account',
    data() {
      return {
        userName:'',
        userId:'',
        userBal:'',
        defaultUrl:'this.src="' + require('../../images/nav_head_default.png') + '"',
        imgUrl:'./static/images/nav_head_default.png',
        showAlert: false,
        bindTip:'',
        tipCancel:'',
        tipCommit:'',
        commitData:'',

        showUnbind:false,
        unbindTitle:'',
        unbindTip:'',
        tipCancel2:'',
        tipCommit2:'',
        commitData2:'',

        tipType:'',//0 解绑提示 1 收支明细提示
      }
    },

    computed: {
    },

    components: {
      alertTip,
      unBindTip
    },

    created: function () {
      this.qryUserInfo();
    },
    methods: {
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
          this.userName = data.name;
          if(data.usr_id&&data.usr_id.length>10){
            this.userId = data.usr_id.substring(0,3)+'****'+data.usr_id.substring(7,11)
          }
          this.userBal = numeral(parseFloat(data.bal)/100).format('0,0.00')
          this.imgUrl = window.location.origin+'/mhp/imgServlet?enc_flg=1&jump_pre_flag=YES&img='
        }, fail => {
          Toast(fail.gda.msg_inf);
          setTimeout(function() {
            //在微信里关闭页面
            WeixinJSBridge.call('closeWindow');
          },2000)
        })
      },
      toPassword: function () {
      	this.$router.push({name: 'password'})
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

      showUnbindTip:function(){
        this.tipType = '0'
        this.unbindTitle = '温馨提示'
        this.unbindTip = '您确定要解除绑定吗'
        this.tipCancel2 = '取消'
        this.tipCommit2 = '确认'
        this.commitData2 = ''
        this.showUnbind = true;
      },

      dismiss2: function () {
        this.showUnbind = false

        if('1'==this.tipType){
          window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.piccfu.wallet'
        }
      },

      dismissWithData2(action){

        if('0' == this.tipType){
          var _this = this;
          _this.$api.post('UserUnBind.xhtml', null, data => {
            this.showUnbind = false
            Toast('解除绑定成功');
            setTimeout(function() {
              //在微信里关闭页面
              WeixinJSBridge.call('closeWindow');
            },2000)
          })
        }else{
          this.showUnbind = false
        }
      },

      showDetailTip: function() {
        this.tipType = '1'
        this.unbindTitle = '敬请期待！'
        this.unbindTip = '请前往麦保付App查看'
        this.tipCancel2 = '前往'
        this.tipCommit2 = '取消'
        this.commitData2 = ''
        this.showUnbind = true;
      },

    }
  }
</script>

<style scoped>
  ul {
    list-style-type: none;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .img-arraw {
    width: 0.5rem;
    height: 0.875rem;
    vertical-align: middle;
    margin-top: 1rem;
  }

  .otherP {
    height: 1.06rem;
    line-height: 1.06rem;
    margin-left: 0.9375rem;
    color: #666666;
    text-align: left;
    margin-top: 1.1rem;
    font-size: 0.875rem;
  }

  .listItem {
    height: 3.25rem;
    background-color: white;
  }

  .rightIcon {
    height: 3.25rem;
    position: absolute;
    right: 0.9375rem;
  }

  .otherPic1 {
    height: 3.25rem;
    line-height: 3.15rem;
    margin-left: 1.8125rem;
  }

  .imgWh {
    width: 1.5625rem;
    height: 1.5625rem;
    vertical-align: middle;
  }

  .imgWh2 {
    width: 1.1rem;
    height: 1.5625rem;
    vertical-align: middle;
    margin-left: 0.23rem;
    margin-right: 0.2325rem;
  }

  .imgHead {
    width: 3.45rem;
    height: 3.45rem;
    vertical-align: middle;
    margin-left: 1.5rem;
    border-radius: 1.725rem;
  }

  .topView{
    background: #E84F47;
    height: 6rem;
  }

  .balView{
    background: white;
    height:6.25rem;
    padding-left: 1.8125rem;
  }

  .balTitle{
    color: #A8A8A8;
    padding-top: 1.2rem;
    font-size: 0.875rem;
  }

  .balValue{
    color: #666666;
    font-size: 2.25rem;
  }

  .userInfo{
    margin-left: 0.9375rem;
    color: white;
    text-align: left;
  }

  .userName{
    font-size: 1.125rem;
    margin-top: 1.3rem;
  }

  .userMobile{
    font-size: 0.875rem;
    margin-top: 2.2rem;
  }

  .hasUserName{
    margin-top: 0.3rem;
  }

</style>
