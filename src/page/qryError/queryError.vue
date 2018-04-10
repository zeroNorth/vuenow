<template>

	<div class="content">
		<img src="../../images/500.png" alt="" />
		<div class="sorry">
			<span>错误信息：{{errormsg}}</span>
		</div>
		<button class="newpage" @click="back">返&nbsp;回</button>
	</div>

</template>

<script>
import $ from 'jquery'
export default {
        data() {
            return {
               errormsg:''
            }
        },
        created: function () {
            let self = this
            this.$api.post('errorInfQuery.do',null, data=>{
                    self.errormsg = data.err_msg
            })
        },
        method: {
        	back: function () {
        		this.$router.push('/');
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
		/*text-align: center;*/
		padding-left: 5.125rem;
	}
	.sorry span{
		font-size: 1.375rem;
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
