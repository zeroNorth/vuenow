<template>
	<div class="vipRed">
		<payList v-show="$store.state.ifList"></payList>
		<div style="padding-top: 1.25rem;">
			<ul>
				<li class="list clearfix">
					<span class="list-text-amt fl">金额</span>
					<input type="email" placeholder="填写金额" class="list-inp fl" v-model="pay" v-on:input="onlyNum"/>
					<span class="list-text fr">元</span>
				</li>
				<li class="list clearfix">
					<span class="list-amt fl">有效期至</span>
					 <el-date-picker
					  class="list-date fr"
				      v-model="value1"
				      type="date"
				      placeholder="请选择有效期日期"
				      format="yyyy-MM-dd"
  					  value-format="yyyy-MM-dd">
				    </el-date-picker>
					<!--<input type="text" placeholder="请选择有效期截止日期" class="list-date fr" v-model="date"/>-->
				</li>
				<li class="list clearfix">
					<span class="list-num fl">手机号</span>
					<input type="tel" placeholder="请输入接收人手机号" maxlength="11" class="list-inp fl" :class="{ ifPd : usr_nm}" v-model="phone" v-on:input="checkPer"/>
					<span v-show='usr_nm' class="theName fr">({{usr_nm}})</span>
				</li>
			</ul>
		</div>
		<div class="amount">
			<span>￥</span>{{amount}}
		</div>
		<div class="ensure">
			<button class="red-btn" @click="isSure">确定</button>
			<span class="supernatant" v-show="!showOp" @click="isSure1"></span><!--白色浮层-->
		</div>
		<div class="method">
			<span>{{redListInf}}</span><span class="blue-btn" @click="changeLIST">更换</span>
		</div>
		<router-link to="redRecord" class="router-red">
			<img src="../../images/red.png" alt="coupon" class="coupon-img"/>
			红包记录
		</router-link>
		<RedPsw v-show="showPsw1" v-on:close="close" :phone="phone"></RedPsw>

    <!-- 绑卡、设置密码弹窗提示 -->
    <div v-if="showAlert">
      <alertTip v-on:dismiss="dismiss" v-on:dismissWithData="dismissWithData" :tip="bindTip" :cancel="tipCancel" :commit="tipCommit" :commitData="commitData"></alertTip>
    </div>

	</div>
</template>

<script>
  import $ from 'jquery'
  import { Toast } from 'mint-ui'
  import store from '../../store/store.js'
  import PayList from './payList'
  import RedPsw from '../../components/common/redPassword'
  import alertTip from '../../components/common/alert'

  export default {
    name: 'VipRed',
    data() {
      return {
      	pay: '',
      	value1: '',
      	phone: '',
      	boxtrue: '',
      	usr_nm: '',
//    	bon_name: '',//红包名称
      	exp_dt: '',//失效时间，后台返回的时间
      	tot_max_amt: '',//单笔红包最大金额
//    	eff_unit: '',
      	showPsw1: false,//密码框是否显示
        showAlert: false,
        red_eff_dt: ''
      }
    },
    computed: {
    	showOp: function () {
    		return this.pay && this.value1 && this.phone
    	},
    	amount: function () {
    		if (this.pay) {
    			return Number(this.pay).toFixed(2)
    		} else {
    			return  '0.00'
    		}
    	},
    	redListInf: function () {
    		return this.$store.state.is_default_pay
    	}
    },
    activated: function () {},
    components: {
    	PayList,RedPsw,alertTip
    },
    created: function () {

      this.qryUserInfo();

    	let params = {
    		'prd_type': '1'
    	}
    	var _this = this
    	_this.$api.post('redBonRuleQry.do',params,data=>{
    		_this.$store.state.bon_name = data.bon_name
    		_this.$store.state.eff_unit = data.eff_unit
    		_this.red_eff_dt = data.eff_dt
    	})
    },
    mounted: function () {
    },
    methods: {
    	close: function () {
    		this.showPsw1 = false
    	},
    	onlyNum: function () {
    		if (! (/^(0?|[1-9]\d*)(\.\d{0,2})?$/.test(this.pay))) {
    			Toast('请输入正确金额')
    			this.pay = ''
    		}
    	},
    	checkPer: function () {
    		var _this = this

    		if ((/\D/g.test(this.phone))){
    			this.phone = ''
    			return
    		}
    			if (_this.phone.length == 11) {

    				if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(this.phone.substring(0,11)))){
    			Toast('请输入正确的手机号')
    			return
    		}

	    			let params = {
	    				'mbll_no': _this.phone
	    			}
	    			_this.$api.post('redBonRecverChk.do',params,msg=>{
	    				if (msg.auth_flg != '00') {
	    					_this.usr_nm = msg.usr_nm
	    				}
	    			})
				} else {
					_this.usr_nm = ''
				}


    	},
    	changeLIST: function () {
    		this.$store.state.ifList = !this.$store.state.ifList
    	},
    	isSure1: function () {
    		var _this = this
    		if (!this.pay) {
    			Toast('请输入金额')
    			return
    		}
    		if (!this.value1) {
    			Toast('请选择日期')
    			return
    		}
    		if (!this.phone) {
    			Toast('请填写手机号')
    			return
    		}
    	},
    	isSure: function () {
    		var _this = this
    		if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(this.phone.substring(0,11)))){
    			Toast('请输入正确的手机号')
    			return
    		}

    		_this.showPsw1 = true

			let value2 = _this.value1.toISOString().substring(0,10)

			let arr = value2.split("-");
		    let newdt = new Date(Number(arr[0]),Number(arr[1])-1,Number(arr[2])+1);
		    var month = '';
		    var getdate = '';
		    if ((newdt.getMonth()+1) < 10) {
		    	month = '0'+ (newdt.getMonth()+1)
		    } else {
		    	month =(newdt.getMonth()+1)
		    }
		    if ((newdt.getDate()+1) < 10) {
		    	getdate = '0'+ newdt.getDate()
		    } else {
		    	getdate =newdt.getDate()
		    }
		    let resolve = newdt.getFullYear() + month+ getdate
		    if (this.value1) {
	    		let value1 = newdt.getFullYear() + month+ getdate
				let pick = this.red_eff_dt.substring(0,4)+this.red_eff_dt.substring(5,7) +this.red_eff_dt.substring(8)
	    		if (Number(value1) <= Number(pick)) {
	    			this.value1 = this.red_eff_dt
	    			_this.$store.state.redresolve = pick
	    		} else {
	    			_this.$store.state.redresolve = resolve
	    		}
    		}



//			_this.$store.state.redphone = _this.phone.substring(0,11)
			_this.$store.state.redpay = _this.pay
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
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.list{
		width: 100%;
		height: 3.2rem;
		padding: 0 4%;
		margin-bottom: 1.25rem;
		font-size: 0;
		background: white;
		box-sizing: border-box;
		border-top: 1px solid #e5e5e5;
		border-bottom: 1px solid #e5e5e5;
	}
	.list-text-amt{
		display: inline-block;
		width: 2rem;
		font-size: 1rem;
		color: #333;
		line-height: calc( 3.2rem - 2px );
	}
	.list-text{
		display: inline-block;
		width: 1rem;
		font-size: 1rem;
		color: #333;
		line-height: calc( 3.2rem - 2px );
	}
	.list-amt{
		display: inline-block;
		width: 4rem;
		font-size: 1rem;
		color: #333;
		line-height: calc( 3.2rem - 2px );
	}
	.list-num{
		display: inline-block;
		width: 3rem;
		font-size: 1rem;
		color: #333;
		line-height: calc( 3.2rem - 2px );
	}
	.list-inp{
		width: calc( 98% - 3rem );
		line-height: calc( 3.2rem - 2px );
		font-size: 1rem;
		color: #333;
		text-align: right;
		box-sizing: border-box;
		border: none;
		outline: none;
	}
	.list-date{
		width: calc( 98% - 4rem );
		line-height: calc( 3.2rem - 2px );
		font-size: 1rem;
		color: #333;
		text-align: right;
		box-sizing: border-box;
		border: none;
		outline: none;
	}
	.amount {
		padding-bottom: 1.25rem;
		font-size: 1.875rem;
		color: #333;
		text-align: center;
	}
	.ensure{
		position: relative;
		left: 0;
		top: 0;
		width: 92%;
		height: 2.75rem;
		margin: 0 auto 0.625rem;
	}
	.red-btn{
		display: block;
		width: 100%;
		height: 100%;
		line-height: 100%;
		background: #e84f47;
		font-size: 1rem;
		color: white;
		text-align: center;
		border-radius: 0.3rem;
		border: none;
		outline: none;
	}
	.supernatant{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: white;
		opacity: 0.6;
	}
	.method{
		font-size: 0.875rem;
		color: #999;
		text-align: center;
	    margin-bottom: 0.5rem;
	}
	.blue-btn {
		display: inline-block;
		color: #4c89e6;
		cursor: pointer;
	}
	.router-red{
		display: block;
		text-align: center;
		font-size: 0.8rem;
		color: #e84f47;
	}
	.coupon-img {
		width: 0.6rem;
		height: 0.7rem;
		vertical-align: top;
		padding-top: 0.15rem;
	}
	.theName{
		font-size: 1rem;
		line-height: 3.2rem;
	}
	.ifPd{
		width: calc(98% - 6rem);
	}
  li {
    list-style: none;
  }

  ul {
    margin: 0;
    padding: 0;
  }
  .fl {
    float: left;
  }

  .fr {
    float: right;
  }
  .clearfix:after {
    clear:both;
    content:'';
    display:block;
    height:0;
    visibility:hidden;
}
	.clearfix{
	    zoom: 1;
	}
</style>
