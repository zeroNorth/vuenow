<template>
  <div v-wechat-title="$route.meta.title" v-show="false" id="headCom" img-set="/static/images/logo.png">
    <div class="headCom">
      <button class="btn" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        返回
      </button>
      <h4 class="cashier-title">{{ $route.meta.title }}</h4>
    </div>
  </div>
</template>

<script>
	import $ from 'jquery'
export default {
  name: 'headCom',
  data() {
  	return {
  	}
  },
methods: {
  goBack: function () {
    this.$router.go(-1)
  }
}
}
</script>

<style scope>
.headCom{
  position:relative;
  left: 0;
  top: 0;

  border-bottom:1px solid #e3e3e3;
  background: white;
}
.btn{
  position:absolute;
  left: 0.625rem;
  top: 50% ;
  margin-top: -0.75rem;
  height: 1.5rem;
  border:none;
  outline:none;
  background:none;
  cursor:pointer;
  font-size: 1.125rem;
  color: #fff;
}
.cashier-title{
  font-size: 1.125rem;
  text-align:center;
  margin:0;
  color:#fff;
  height: 3.125rem;
  line-height:3.125rem;
  background:#e7380c;
}
.complete{
	  position: absolute;
    right: 0.625rem;
    top: 0.9375rem;
    height: 1.5rem;
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
    font-size: 1.125rem;
    color:#e7380c;
}
</style>
