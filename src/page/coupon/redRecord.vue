<template>
	<div class="vipRecord" id="vipRecord">
		<div class="record-pos" v-show="showOp" @click="showOp1"></div>
		<div class="fixTop">
			<ul class="record-title">
				<li class="redcord-list" :class="{ redActive : redActive}" @click="redType">红包类型<img v-if="redActive" class="imgArrow" src="../../images/red_arrow.png" :class="{ turn : showOp}"/><img v-else class="imgArrow" src="../../images/gray_arrow.png"/></li>
				<li class="redcord-list" @click="redState" :class="{ redActive : State}">红包状态<img v-if="State" class="imgArrow" src="../../images/red_arrow.png" :class="{ turn : showOp}"/><img v-else class="imgArrow" src="../../images/gray_arrow.png"/></li>
			</ul>
			<div class="toType" id="toType">
				<ul v-show="showOp&&redActive">
					<li class="toTypList" v-for="(item, index) in grant" @click="listAvt(index)" :class="{oneChoose: !index}">{{item}}</li>
				</ul>
				<ul v-show="showOp&&State">
					<li class="toTypList" v-for="(item, index) in hasUse" @click="listTAvt(index)" :class="{oneChoose: !index}">{{item}}</li>
				</ul>
			</div>
		</div>
			<!--<div style="min-height: 100%;">-->
			<v-loadmore @top-status-change="handleTopChange"  :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
				
				<ul class="titleLi">
					<li class="listLi clearfix" :class="{listList1 : type1 == 'A'}" @click="showDetail(index,item.prd_typ)" v-for="(item ,index) in redList">
						<div class="fl" style="line-height: 5rem;">
							<img src="../../images/redicon.png" alt="" style="width: 2rem;height:2rem;" v-show="item.prd_typ != '0'"/>
							<img src="../../images/normalRed.png" alt="" style="width: 1.7rem;height:2rem;" v-show="item.prd_typ== '0'"/>
						</div>
						<div class="fl center-red">
							<p class="vipDis">{{item.bon_nm}}</p>
							<p class="vipDate">使用期限:{{item.eff_dt}}-{{item.exp_dt}}</p>
						</div>
						<span class="fr red-account">￥{{item.bon_amt}}</span>
						<div class="isGone" v-show="type1 == 'E' || type1 == 'U'">
							<img src="../../images/isGone.png" alt="" class="isGoneImg" v-show="type1 == 'E'"/>
							<img src="../../images/isUse.png" alt="" class="isGoneImg" v-show="type1 == 'U'"/>
						</div>
					</li>
					<!--<li class="listLi clearfix">
						<div class="fl">
							<img src="../../images/redicon.png" alt="" style="width: 2rem;height:2rem;"/>
						</div>
						<div class="fl center-red">
							<p class="vipDis">VIP专属红包 YX20178787C</p>
							<p class="vipDate">使用期限:2017.12.7-2017.12.27</p>
						</div>
						<span class="fr red-account">￥600</span>
					</li>-->
				</ul>
				<div v-show="noData" style="text-align: center;color: #e84f47;">没有更多了</div>
				<div slot="top" class="mint-loadmore-top">
					<span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓下拉刷新</span>
					<span v-show="topStatus === 'loading'">Loading...</span>
				</div>
				<div v-show="!noData"  class="mint-loadmore-bottom" slot='bottom' @click="handleBottomChange" style="margin-bottom: 0;">
					加载更多
				</div>
			</v-loadmore>
			<!--</div>-->
	</div>
</template>

<script>
  import $ from 'jquery'
  import { Loadmore,Toast } from 'mint-ui'
  import store from '../../store/store.js'

  export default {
    name: 'redRecord',
    data() {
      return {
      	topStatus: '',
      	bottomShow: '',
      	pageStart: 1,
      	totPage: '',
      	loadingText: '加载中...',
		scrollMode: "auto", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
		allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      	redActive: true,
      	State: false,
      	showOp: false,
      	redList: [],
      	type1: 'A',
      	noData: false,
      	getOrsend: '0',
      	grant: ['我发放的','我领取的'],
      	hasUse: ['未使用','已使用','已过期']
      }
    },
    computed: {},
    activated: function () {},
    components: {
    	'v-loadmore': Loadmore
    },
    created: function () {
    	var _this = this
    	let params = {
    		'pag_no': '1',
    		'prd_typ': '0',
    		'bon_sts': _this.type1//a是未使用，u是已经使用，e已过期，d待使用
    	}
    	var toThousands = function (num) {
			var result = '', counter = 0,dat = '';
			if (Number(num).toFixed(2).toString().indexOf('.')) {
				dat = Number(num).toFixed(2).toString().substring(Number(num).toFixed(2).toString().indexOf('.'))
			}
			num = (parseInt(num) || 0).toString();
			for (var i = num.length - 1; i >= 0; i--) {
				counter++;
				result = num.charAt(i) + result;
				if (!(counter % 3) && i != 0) { result = ',' + result; }
			}
			return result+dat;
		}
    	_this.$api.post('redBonsGrantQry.do',params,msg=>{
    		_this.redList = []
    		_this.redList = msg.rec1
    		if (msg.red_bon_num !== '0') {
    			_this.noData = false
    			for (var i=0;i<_this.redList.length;i++) {
    			_this.redList[i].exp_dt = msg.rec1[i].exp_dt.substring(0,4)+''+msg.rec1[i].exp_dt.substring(4,6)+'.'+msg.rec1[i].exp_dt.substring(6)
    			_this.redList[i].eff_dt = msg.rec1[i].eff_dt.substring(0,4)+'.'+msg.rec1[i].eff_dt.substring(4,6)+'.'+msg.rec1[i].eff_dt.substring(6)
    			_this.redList[i].bon_amt = toThousands(msg.rec1[i].bon_amt)
    			}
    		}
    		else {
    			_this.noData = true
    		}
    		
    	})
    },
    mounted: function () {
    },
    methods: {
    	loadTop: function (){},
    	loadBottom: function (){},
		handleTopChange(status) {
			this.topStatus = status;
			if(this.topStatus == 'drop') {
				$(".mint-loadmore-top").show()
			} else if(this.topStatus == 'loading') {
				this.pageStart = 1;
				this.ManafeAccountInfo();
				//下拉加载
				//				this.loadPageList();
				this.$refs.loadmore.onTopLoaded();
			} else if(this.topStatus == 'pull') {

			}
		},
		handleBottomChange(status) {
//			console.log(status)
//			this.bottomShow = status;
//			$(".mint-loadmore-bottom").show()
//			$(".mint-loadmore-bottom").html('加载更多');
//			if(this.bottomShow == 'drop') {
//				console.log('88')
//
//			} else if(this.bottomShow == 'loading') {
//				console.log('77')
				if(this.totPage > this.pageStart) {
					//									alert('加载更多');
					this.pageStart++;
					//				this.more(); // 上拉触发的分页查询
					this.ManafeAccountInfo();
					this.$refs.loadmore.onBottomLoaded(); // 固定方法，查询完要调用一次，用于重新定位
				} 
				else {
					this.pageStart = 1;
					this.noData = true
					//				this.more(); // 上拉触发的分页查询
					this.ManafeAccountInfo();
					this.$refs.loadmore.onBottomLoaded();

				}
//			} else {
//				if(this.totPage <= this.pageStart) {
//				$(".mint-loadmore-bottom").html('加载完毕');
//				}
//				$(".mint-loadmore-bottom").hide();
//				this.$refs.loadmore.onBottomLoaded();
//			}

		},
		//请求明细数据
			ManafeAccountInfo: function() {
				var _this = this
				var toThousands = function (num) {
			var result = '', counter = 0,dat = '';
			if (Number(num).toFixed(2).toString().indexOf('.')) {
				dat = Number(num).toFixed(2).toString().substring(Number(num).toFixed(2).toString().indexOf('.'))
			}
			num = (parseInt(num) || 0).toString();
			for (var i = num.length - 1; i >= 0; i--) {
				counter++;
				result = num.charAt(i) + result;
				if (!(counter % 3) && i != 0) { result = ',' + result; }
			}
			return result+dat;
		}
				
				if (_this.getOrsend == 0) {
	    		let params = {
	    		'pag_no': _this.pageStart,
	    		'prd_typ': '0',
	    		'bon_sts': _this.type1//a是未使用，u是已经使用，e已过期，d待使用
		    	}
		    	_this.$api.post('redBonsGrantQry.do',params,msg=>{
//		    		_this.redList = []
					var arr31 = msg.rec1
		    		for (var j=0;j<arr3.length;j++) {
		    			arr31[j].exp_dt = msg.rec1[j].exp_dt.substring(0,4)+'.'+msg.rec1[j].exp_dt.substring(4,6)+'.'+msg.rec1[j].exp_dt.substring(6)
		    			arr31[j].eff_dt = msg.rec1[j].eff_dt.substring(0,4)+'.'+msg.rec1[j].eff_dt.substring(4,6)+'.'+msg.rec1[j].eff_dt.substring(6)
		    			arr31[j].bon_amt = toThousands(msg.rec1[j].bon_amt)
	    			}
		    		_this.redList = _this.redList.concat(arr31)
		    		if (Number(msg.tot_pag) >= 2) {
		    				_this.noData = false
		    			} else {
		    				_this.noData = true
		    			}
//		    		if (msg.red_bon_num != '0') {
////		    			_this.noData = false
//		    			
////		    			for (var i=0;i<_this.redList.length;i++) {
////		    			_this.redList[i].exp_dt = msg.rec1[i].exp_dt.substring(0,4)+'.'+msg.rec1[i].exp_dt.substring(4,6)+'.'+msg.rec1[i].exp_dt.substring(6)
////		    			_this.redList[i].eff_dt = msg.rec1[i].eff_dt.substring(0,4)+'.'+msg.rec1[i].eff_dt.substring(4,6)+'.'+msg.rec1[i].eff_dt.substring(6)
////		    			_this.redList[i].bon_amt = toThousands(msg.rec1[i].bon_amt)
////		    			}
//		    		}
//		    		else {
//		    			_this.noData = true
//		    		}
		    		
		    	})
    		} else {
	    		let params = {
	    		'pag_no': _this.pageStart,
	    		'prd_typ': '0',
	    		'bon_sts': _this.type1//a是未使用，u是已经使用，e已过期，d待使用
		    	}
		    	_this.$api.post('redBonsRecQry.do',params,msg=>{
		    		
		    		var arr3 = msg.rec1
		    		for (var j=0;j<arr3.length;j++) {
		    			arr3[j].exp_dt = msg.rec1[j].exp_dt.substring(0,4)+'.'+msg.rec1[j].exp_dt.substring(4,6)+'.'+msg.rec1[j].exp_dt.substring(6)
		    			arr3[j].eff_dt = msg.rec1[j].eff_dt.substring(0,4)+'.'+msg.rec1[j].eff_dt.substring(4,6)+'.'+msg.rec1[j].eff_dt.substring(6)
		    			arr3[j].bon_amt = toThousands(msg.rec1[j].bon_amt)
	    			}
		    		_this.redList = _this.redList.concat(arr3)
		    		if (Number(msg.tot_pag) >= 2) {
		    				_this.noData = false
		    			} else {
		    				_this.noData = true
		    			}
//		    		if (msg.red_bon_num != '0') {
//		    			_this.noData = false
//		    			if (Number(msg.tot_pag) >= 2) {
//		    				_this.noData = false
//		    			} else {
//		    				_this.noData = true
//		    			}
////		    			for (var j=0;j<_this.redList.length;j++) {
////		    			_this.redList[j].exp_dt = msg.rec1[j].exp_dt.substring(0,4)+'.'+msg.rec1[j].exp_dt.substring(4,6)+'.'+msg.rec1[j].exp_dt.substring(6)
////		    			_this.redList[j].eff_dt = msg.rec1[j].eff_dt.substring(0,4)+'.'+msg.rec1[j].eff_dt.substring(4,6)+'.'+msg.rec1[j].eff_dt.substring(6)
////		    			_this.redList[j].bon_amt = toThousands(_this.redList[j].bon_amt)
////		    			}
//		    		}
//		    		else {
//		    			_this.noData = true
//		    		}
		    		
		    	})
    		}
			},
			
			
    	redType: function () {
    	  if(!this.showOp){
	          this.showOp = true
	          $("#vipRecord").addClass('isHid')
	        }else{
	          this.showOp = false
	          $("#vipRecord").removeClass('isHid')
	        }
    		this.State = false
    		if (!this.redActive) {
    			this.redActive = true
    		} else {
    			this.redActive = true
    		}
    	},
    	redState: function () {
	        if(!this.showOp){
	          this.showOp = true
	          $("#vipRecord").addClass('isHid')
	        }else{
	          this.showOp = false
	           $("#vipRecord").removeClass('isHid')
	        }
    		this.redActive = false
    		if (!this.State) {
    			this.State = true
    		} else {
    			this.State = true
    		}
    	},
    	showOp1: function () {
    		this.showOp = false
    		$("#vipRecord").removeClass('isHid')
    	},
    	listAvt: function (index) {
    		$("#toType ul:eq(0) li").removeClass('oneChoose').eq(index).addClass('oneChoose')
    		$("#vipRecord").removeClass('isHid')
    		this.showOp = false
    		var _this = this
    		var toThousands = function (num) {
			var result = '', counter = 0,dat = '';
			if (Number(num).toFixed(2).toString().indexOf('.')) {
				dat = Number(num).toFixed(2).toString().substring(Number(num).toFixed(2).toString().indexOf('.'))
			}
			num = (parseInt(num) || 0).toString();
			for (var i = num.length - 1; i >= 0; i--) {
				counter++;
				result = num.charAt(i) + result;
				if (!(counter % 3) && i != 0) { result = ',' + result; }
			}
			return result+dat;
		}
    		_this.getOrsend = index
    		if (_this.getOrsend == 0) {
	    		let params = {
	    		'pag_no': '1',
	    		'prd_typ': '0',
	    		'bon_sts': _this.type1//a是未使用，u是已经使用，e已过期，d待使用
		    	}
		    	_this.$api.post('redBonsGrantQry.do',params,msg=>{
		    		_this.redList = []
		    		_this.redList = msg.rec1
		    		_this.totPage = msg.tot_pag
		    		if (msg.red_bon_num !== '0') {
		    			_this.noData = false
		    			for (var i=0;i<_this.redList.length;i++) {
		    			_this.redList[i].exp_dt = msg.rec1[i].exp_dt.substring(0,4)+'.'+msg.rec1[i].exp_dt.substring(4,6)+'.'+msg.rec1[i].exp_dt.substring(6)
		    			_this.redList[i].eff_dt = msg.rec1[i].eff_dt.substring(0,4)+'.'+msg.rec1[i].eff_dt.substring(4,6)+'.'+msg.rec1[i].eff_dt.substring(6)
		    			_this.redList[i].bon_amt = toThousands(msg.rec1[i].bon_amt)
		    			}
		    		}
		    		else {
		    			_this.noData = true
		    		}
		    		
		    	})
    		} else {
	    		let params = {
	    		'pag_no': '1',
	    		'prd_typ': '0',
	    		'bon_sts': _this.type1//a是未使用，u是已经使用，e已过期，d待使用
		    	}
		    	_this.$api.post('redBonsRecQry.do',params,msg=>{
		    		_this.redList = []
		    		_this.redList = msg.rec1
		    		_this.totPage = msg.tot_pag
		    		if (msg.red_bon_num !== '0') {
		    			_this.noData = false
		    			for (var j=0;j<_this.redList.length;j++) {
		    			_this.redList[j].exp_dt = msg.rec1[j].exp_dt.substring(0,4)+'.'+msg.rec1[j].exp_dt.substring(4,6)+'.'+msg.rec1[j].exp_dt.substring(6)
		    			_this.redList[j].eff_dt = msg.rec1[j].eff_dt.substring(0,4)+'.'+msg.rec1[j].eff_dt.substring(4,6)+'.'+msg.rec1[j].eff_dt.substring(6)
		    			_this.redList[j].bon_amt = toThousands(msg.rec1[j].bon_amt)
		    			}
		    		}
		    		else {
		    			_this.noData = true
		    		}
		    		
		    	})
    		}
    	},
    	listTAvt: function (index) {
    		$("#toType ul:eq(1) li").removeClass('oneChoose').eq(index).addClass('oneChoose')
    		$("#vipRecord").removeClass('isHid')
    		this.showOp = false
//  		if (index == 0) {
//  			this.type1 = 'D'
//  		} else
    		if (index == 0) {
    			this.type1 = 'A'
    		} else if (index == 1) {
    			this.type1 = 'U'
    		}else if (index == 2) {
    			this.type1 = 'E'
    		}
    		var toThousands = function (num) {
			var result1 = '', counter1 = 0,dat1 = '';
			if (Number(num).toFixed(2).toString().indexOf('.')) {
				dat1 = Number(num).toFixed(2).toString().substring(Number(num).toFixed(2).toString().indexOf('.'))
			}
			num = (parseInt(num) || 0).toString();
			for (var i = num.length - 1; i >= 0; i--) {
				counter1++;
				result1 = num.charAt(i) + result1;
				if (!(counter1 % 3) && i != 0) { result1 = ',' + result1; }
			}
			return result1+dat1;
		}
    		var _this = this
    		if (_this.getOrsend == 0) {
	    		let params = {
	    		'pag_no': '1',
	    		'prd_typ': '0',
	    		'bon_sts': _this.type1//a是未使用，u是已经使用，e已过期，d待使用
		    	}
		    	_this.$api.post('redBonsGrantQry.do',params,msg=>{
		    		_this.redList = []
		    		_this.redList = msg.rec1
		    		_this.totPage = msg.tot_pag
		    		if (msg.red_bon_num !== '0') {
		    			_this.noData = false
		    			for (var i=0;i<_this.redList.length;i++) {
		    			_this.redList[i].exp_dt = msg.rec1[i].exp_dt.substring(0,4)+'.'+msg.rec1[i].exp_dt.substring(4,6)+'.'+msg.rec1[i].exp_dt.substring(6)
		    			_this.redList[i].eff_dt = msg.rec1[i].eff_dt.substring(0,4)+'.'+msg.rec1[i].eff_dt.substring(4,6)+'.'+msg.rec1[i].eff_dt.substring(6)
		    			_this.redList[i].bon_amt = toThousands(msg.rec1[i].bon_amt)
		    			}
		    		}
		    		else {
		    			_this.noData = true
		    		}
		    		
		    	})
    		} else {
	    		let params = {
	    		'pag_no': '1',
	    		'prd_typ': '0',
	    		'bon_sts': _this.type1//a是未使用，u是已经使用，e已过期，d待使用
		    	}
		    	_this.$api.post('redBonsRecQry.do',params,msg=>{
		    		_this.redList = []
		    		_this.redList = msg.rec1
		    		_this.totPage = msg.tot_pag
		    		if (msg.red_bon_num !== '0') {
		    			_this.noData = false
		    			for (var i=0;i<_this.redList.length;i++) {
		    			_this.redList[i].exp_dt = msg.rec1[i].exp_dt.substring(0,4)+'.'+msg.rec1[i].exp_dt.substring(4,6)+'.'+msg.rec1[i].exp_dt.substring(6)
		    			_this.redList[i].eff_dt = msg.rec1[i].eff_dt.substring(0,4)+'.'+msg.rec1[i].eff_dt.substring(4,6)+'.'+msg.rec1[i].eff_dt.substring(6)
		    			_this.redList[i].bon_amt = toThousands(msg.rec1[i].bon_amt)
		    			}
		    		}
		    		else {
		    			_this.noData = true
		    		}
		    		
		    	})
    		}
    	},
    	showDetail: function (index,item) {
    		if (item == '5') {
    			let theid = this.redList[index].bon_id
    			this.$router.push({path:'/Detail',query:{redindex:theid}})
    		}
    	}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .vipRecord{
	height: 100%;
	padding-top: 3.06rem;
	box-sizing: border-box;
  }
  .fixTop{
  	position: fixed;
  	left: 0;
  	top: 0;
  	width: 100%;
    z-index: 10;
  	/*min-height: calc( 100% - 3.03rem );*/
  }
  .record-pos{
  	position: fixed;
  	left: 0;
  	top: 0;
  	width: 100%;
  	min-height: 100%;
  	background: black;
  	opacity: 0.3;
    z-index: 5;
  }
  .record-title{
  	position: absolute;
  	left: 0;
  	top: 0;
  	width: 100%;
  	font-size: 0;
  	background: white;
  }
  .redcord-list{
  	display: inline-block;
  	box-sizing: border-box;
  	width: 50%;
  	height: 3.06rem;
  	line-height: 3.06rem;
  	font-size: 0.875rem;
  	color: #999;
  	text-align: center;
  	border-bottom: 1px solid #e5e5e5;
  }
  .redcord-list:first-child {
  	border-right: 1px solid #eee;
  }
  .redActive{
  	color: #e84f47;
  }
  .toType{
  	position: absolute;
  	left: 0;
  	top: calc( 3.06rem + 1px );
  	width: 100%;
  	background: white;
  }
  .toTypList{
  	width: 88.5%;
  	height: 2.6rem;
  	line-height: 2.6rem;
  	margin: 0 auto;
  	font-size: 0.75rem;
  	border-bottom: 1px solid #ddd;
  }
  .toTypList:last-child {
  	border: none;
  }
  /*.toTypList:first-child{
  	color: #e7380d;
  	background: url(../../images/icons_home_pay_chosed@2x.png) no-repeat right center;
  	background-size: 1.4rem;
  }*/
  .listActi{
  	color: red;
  }
  .titleLi{
  	padding-top: 2rem;
  }
  .listLi{
  	position: relative;
  	width: 94%;
  	height: 5rem;
  	padding-left: 4%;
  	box-sizing: border-box;
  	background: url('../../images/background0.png') no-repeat center center white;
  	background-size: 100% 100%;
  	border-radius: 0.3rem;
  	margin: 0 auto 1rem;
  }
  .listList1{
  	background: url('../../images/background1.png') no-repeat center center white;
  	background-size: 100% 100%;
  }
  .center-red{
  	padding-left: 0.3rem;
  }
  .vipDis{
  	font-size: 0.75rem;
  	color: #666;
  	padding: 1.3rem 0 0.3rem 0;
  }
  .vipDate{
  	font-size: 0.625rem;
  	color: #999;
  }
  .red-account{
  	width: 30%;
  	height: 5rem;
  	line-height: 5rem;
  	text-align: center;
  	font-size: 1rem;
  	color: white;
  }
  .oneChoose {
  	color: #e7380d;
  	background: url(../../images/icons_home_pay_chosed@2x.png) no-repeat right center;
    background-size: 1.4rem;
  }
  .isGone {
    position: absolute;
    right: 18%;
    top: 50%;
    margin-top: -1.548rem;
  }
  .isGoneImg{
  	width: 4rem;
  	height: 3.168rem;
  }
  .isHid{
  	overflow: hidden;
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

  .imgArrow{
    width: 1rem;
    height: 0.6rem;
    margin-bottom: 0.2rem;
    margin-left: 0.4rem;
  }

  .turn{
    transform:rotate(-180deg);
  }

</style>
