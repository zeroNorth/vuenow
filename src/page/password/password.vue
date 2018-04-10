<template>
  <div class="content">
    <ul>
      <li>
        <router-link to="/loginPsw" tag="div" class="clearfix list">
          <span class="fl">重置登录密码</span>
          <span class="fr">
            <i class="el-icon-arrow-right"></i>
          </span>
        </router-link>
      </li>
      <li>
        <router-link to="/payPsw" tag="div" class="list clearfix">
          <span class="fl">重置支付密码</span>
          <span class="fr">
          <i class="el-icon-arrow-right"></i>
        </span>
        </router-link>
      </li>
      <!--<li>-->
        <!--<router-link to="/forget" tag="div" class="list clearfix">-->
          <!--<span class="fl">找回密码</span>-->
          <!--<span class="fr">-->
          <!--<i class="el-icon-arrow-right"></i>-->
        <!--</span>-->
        <!--</router-link>-->
      <!--</li>-->
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'password',
    methods: {}
  }
</script>

<style scoped>
  li {
    list-style: none;
  }
  .content{
  	background: white;
  }
  .list{
    height: 3.2rem;
    line-height: 3.2rem;
    padding: 0 2%;
    font-size: 1rem;
    border-bottom: 1px solid #d1d1d1;
  }
  .clearfix {
    overflow: hidden;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }
</style>
