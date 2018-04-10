<template>
	<div class="PayList">
		<div>
			<div class="pos"></div>
			<div class="theList">
				<h1 class="theTit">
					<span class="el-icon-close theClose" @click="closeList"></span>
					选择支付方式
				</h1>
				<div class="listDetail" @click="chooseAcc">
						<div class="notImg sureImg" id="notImg">

						</div>
						<div style="display: inline-block;vertical-align: top;">
							<img src="../../images/account.png" alt="" style="width: 1.5rem;height: 1.5rem;vertical-align: top;padding-top: 0.775rem;margin-right: 0.775rem;margin-left: 0.15rem"/>
							<div class="hasSize">
								<p class="payListText" style="margin-top: 0.3rem">账户余额</p>
								<p class="payListText">当前可用余额:{{account}}元</p>
							</div>
						</div>
				</div>
				<ul id="titleCard">
					<li class="listDetail" v-for="(item , index) in cardList" @click="cardItem(index)">
						<div class="notImg thisHasImg">

						</div>
						<div style="display:inline-block;vertical-align: top;">
							<img :src="item.img_url" alt="" class="payListImg"/>
							<div class="hasSize">
								<p class="payListText" style="margin-top: 0.3rem">{{item.bnk_nm}} 储蓄卡 {{item.crd_no_last}}</p>
								<p class="payListText">单笔限额{{(Number(item.stok_amt_limit)/100).toFixed(2)}}元,单日限额{{(Number(item.day_amt_limit)/100).toFixed(2)}}元</p>
							</div>
						</div>
					</li>
				</ul>
				<router-link tag="div" class="listDetail1" to="/addBankCard">
					添加银行卡
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
  import $ from 'jquery'
  import { Toast } from 'mint-ui'
  import store from '../../store/store.js'

  export default {
    name: 'payList',
    data() {
      return {
      	account: '100000000.00',
      	cardList: [],
      	checked: true
      }
    },
    computed: {},
    activated: function () {
    	var _this = this
    	let params = {
    		'qry_typ': '8'
    	}
    	_this.$api.post('payTypListQry.do',params,data=>{
    		//余额
    		if (data.scene.act_bal_support == 'Y') {
    			_this.account = (Number(data.account_inf.bal)/100).toFixed(2)
    			//判断默认支付方式
    			if (data.account_inf.is_default_pay == '1') {
    				this.$store.state.is_default_pay = '使用账户余额付款，'
    				$("#notImg").addClass('sureImg')
    			} else {
    				//银行卡
		    		if (data.data) {
		    			_this.cardList = data.data
		    			//判断是否是默认支付方式
		    			for (var i=0;i<data.data.length;i++) {
		    				if (data.data[i].is_default_pay =='1') {
		    					$("#notImg").removeClass('sureImg')
		    					$("#titleCard .listDetail .thisHasImg").eq(i).addClass('sureImg')
		    					this.$store.state.payType = '01'
		    					this.$store.state.redagr_no= this.cardList[i].agr_no
		    					this.$store.state.is_default_pay = '使用' + data.data[i].bnk_nm + '储蓄卡 (' + data.data[i].crd_no_last + ')付款，'
		    				}
		    			}
		
		    		}
    			}
    		}
    		

    	})
    },
    components: {},
    created: function () {

    },
    mounted: function () {
    },
    methods: {
    	cardItem: function (index) {
			this.$store.state.is_default_pay = '使用' + this.cardList[index].bnk_nm + '储蓄卡 (' + this.cardList[index].crd_no_last + ')付款，'
    		this.$store.state.cardItem = index
    		this.$store.state.payType = '01'
    		this.$store.state.ifList = false
    		this.$store.state.redagr_no= this.cardList[index].agr_no
    		$("#notImg").removeClass('sureImg')
    		$("#titleCard .listDetail .thisHasImg").removeClass('sureImg').eq(index).addClass('sureImg')
    	},
    	closeList: function () {
    		this.$store.state.ifList = false

    	},
    	chooseAcc: function () {
    		this.$store.state.payType = '02'
    		this.$store.state.is_default_pay = '使用账户余额付款，'
    		this.$store.state.ifList = false
    		$("#notImg").addClass('sureImg')
    		$("#titleCard .listDetail .thisHasImg").removeClass('sureImg')
    	}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.thisHasImg{
		display: inline-block;
	}
	.pos{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: black;
		opacity: 0.3;
		z-index: 2;
	}
	.theList{
		position: absolute;
		left: 0;
		top: 14rem;
		width: 100%;
		height: calc( 100% - 14rem);
		background: white;
		z-index: 3;
	}
	.theTit{
		position: relative;
		left: 0;
		top: 0;
		width: 100%;
		height: 2.6rem;
		line-height: 2.6rem;
		text-align: center;
		font-size: 1rem;
		border-bottom: 1px solid #ddd2;
	}
	.theClose{
		position: absolute;
		left: 3%;
		top: 50%;
		width: 1rem;
		height: 1rem;
		margin-top: -0.5rem;
		color: #d1d1d1;
	}
	.listDetail{
		width: 100%;
		height: 3rem;
		padding: 0 0 0 3%;
		box-sizing: border-box;
		font-size: 0;
		border-bottom: 1px solid #ddd2;
	}
	.listDetail1{
		width: 100%;
		height: 3rem;
		line-height: 3rem;
		padding: 0 3%;
		box-sizing: border-box;
		font-size: 0.875rem;
		background: url(../../images/arrow@2x.png) no-repeat 96% center;
		background-size: 0.5rem 1rem;
		border-bottom: 1px solid #ddd2;
	}
	.hasSize{
		display: inline-block;
		font-size: 0.875rem;
		color: black;
	}
	.thebox{
		background: #ccc !important;
	}
	.payListText{
		line-height: 1.3rem;
    font-size: 0.875rem;
	}
	.payListText:last-child {
		color: #ccc;
	}
	.payListImg{
		width: 1.875rem;
		height: 1.875rem;
		vertical-align: top;
    	padding-top: 0.475rem;
	    margin-right: 0.5rem;
	}
	.notImg{
		display: inline-block;
		width: 1.25rem;
		height: 100%;
		background: url(../../images/not.png) no-repeat center center;
		background-size: 0.9rem 0.9rem;
		margin-right: 0.3rem;
	}
	.sureImg{
		display: inline-block;
		width: 1.25rem;
		height: 100%;
		background: url(../../images/sure.png) no-repeat center center;
		background-size: 0.9rem 0.9rem;
		margin-right: 0.3rem;
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
