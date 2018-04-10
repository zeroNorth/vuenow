<template>
	<div class="vipRecord">
		<div>
			<ul class="title">
				<li class="clearfix list">
					<span class="fl">红包金额</span>
					<span class="fr">{{redDetail.bon_amt}}元</span>
				</li>
				<li class="clearfix list">
					<span class="fl">红包识别码</span>
					<span class="fr">{{redDetail.chk_no}}</span>
				</li>
				<li class="clearfix list">
					<span class="fl">红包状态</span>
					<span class="fr">{{redDetail.bon_sts_des}}</span>
				</li>
				<li class="clearfix list">
					<span class="fl">发放人账号</span>
					<span class="fr">{{redDetail.iss_mbl_no}}{{redDetail.iss_cus_nm}}</span>
				</li>
				<li class="clearfix list">
					<span class="fl">使用期限</span>
					<span class="fr">{{redDetail.eff_dt}}至{{redDetail.exp_dt}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
  import $ from 'jquery'
  import { Toast } from 'mint-ui'
  import store from '../../store/store.js'

  export default {
    name: 'detail',
    data() {
      return {
      	redindex: this.$route.query.redindex,
      	redDetail: ''
      }
    },
    computed: {},
    activated: function () {},
    components: {},
    created: function () {
    	var _this = this
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
    	let params = {
    		'bon_id': _this.redindex
    	}
    	_this.$api.post('redBonDetailQry.do',params,msg=>{
    		_this.redDetail = msg
    		_this.redDetail.eff_dt = msg.eff_dt.substring(0,4)+'-'+msg.eff_dt.substring(4,6)+'-'+msg.eff_dt.substring(6)
    		_this.redDetail.exp_dt = msg.exp_dt.substring(0,4)+'-'+msg.exp_dt.substring(4,6)+'-'+msg.exp_dt.substring(6)
    		if (msg.iss_cus_nm) {
    			_this.redDetail.iss_cus_nm = '('+msg.iss_cus_nm+')'
    		}
    		_this.redDetail.bon_amt = toThousands(msg.bon_amt)
    	})
    },
    mounted: function () {
    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.title{
		background: white;
		font-size: 0.75rem;
		color: #666;
		border-bottom: 1px solid #ddd;
	}
	.list{
		height: 3rem;
		line-height: 3rem;
		padding: 0 5%;
		box-sizing: border-box;
		background: white;
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
