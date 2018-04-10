<template>
	<div class="content">
		<img src="../../images/500.png" alt="" />
		<div class="sorry">
			<span>服务器执行请求时遇到了意外情况</span>
		</div>
		<button class="newpage">刷&nbsp;新</button>
	</div>
</template>

<script>
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
		margin-top: 1.25rem;
	}
	.sorry span{
		font-size: 1rem;
    color: #666666;
	}
	.newpage{
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
