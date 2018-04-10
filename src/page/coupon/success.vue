<template>
	<div>
		<div style="text-align: center;padding-top: 3rem;background: white;margin-bottom: 2rem;">
			<img src="../../images/succ.png" alt="" style="width: 14rem;height:11.75rem;margin-right: 1.5rem;"/>
			<p class="sendSucc">发放成功</p>
			<p>{{$store.state.sucTime}}</p>
		</div>
		<div>
			<button class="succ-btn" @click="complete">完成</button>
		</div>
		<router-link to="redRecord" class="router-red">
			<img src="../../images/red.png" alt="coupon" class="coupon-img"/>
			红包记录
		</router-link>
	</div>
</template>

<script>
  import $ from 'jquery'
  import { Toast } from 'mint-ui'
  import store from '../../store/store.js'

  export default {
    name: 'success',
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
    },
    components: {},
    created: function () {

    },
    mounted: function () {
    },
    methods: {
      complete:function(){
        //在微信里关闭页面
        WeixinJSBridge.call('closeWindow');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .succ-btn {
  	display: block;
  	border: none;
  	outline: none;
  	box-sizing: border-box;
  	width: 90%;
  	height: 2.75rem;
  	line-height: 2.75rem;
  	margin: 0 auto 0.625rem;
  	background: #e84f47;
  	color: white;
  	font-size: 1rem;
  	border-radius: 0.3rem;
  }
  .router-red{
		display: block;
		text-align: center;
		font-size: 0.625rem;
		color: #e84f47;
	}
	.coupon-img {
		width: 0.6rem;
		height: 0.7rem;
		vertical-align: top;
		padding-top: 0.15rem;
	}
	.sendSucc{
		color: #ff5858;
    	padding: 1.25rem 0 1rem;
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
