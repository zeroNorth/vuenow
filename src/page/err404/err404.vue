<template>
	<div class="content">
		<img src="../../images/404.png" alt="" />
		<div class="sorry">
			<span>抱歉！</span>您所访问的页面不存在。
		</div>
		<button class="backback" @click="back">返&nbsp;回</button>
	</div>
</template>

<script>
	export default {
		data () {},
		methods: {
			back : function () {
				this.$router.push('/');
        //在微信里关闭页面
        WeixinJSBridge.call('closeWindow');
			}
		}
	}
</script>

<style scoped>
	.content{
		padding-top: 12.5rem;
	}
	.content img{
		display: block;
		width: 7.5rem;
		margin: auto;
	}
	.sorry{
		text-align: center;
	}
	.sorry span{
		font-size: 1.375rem;
    color: #666666;
	}
	.backback{
		display: block;
		margin: 0 auto;
		    margin-top: 1.25rem;
    width: 7.5rem;
    height: 2.5rem;
    border: 1px solid #e7380c;
    background-color: #fff;
    color: #e7380c;
    border-radius: 0.25rem;
    font-size: 1.125rem;
	}
</style>
