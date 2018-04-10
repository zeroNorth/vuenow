<template>
  <div class="div-info" >
    <ul >
      <div class="mp detial-bg">
        <div class="answer">
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;麦保付金融服务平台（简称“麦保付”）是由人保金融服务有限公司提供的互联网金融服务平台。人保金融服务有限公司是世界五百强企业--中国人民保险集团（2017年财富世界500强位列第114名）旗下全资子公司，注册资本金10亿元人民币，总部办公地点设在北京。麦保付是以支付服务为触点，以综合账户服务为入口、以数据运营为创新驱动力的互联网金融基础平台。 </span>
        </div>
      </div>
    </ul>
  </div>

</template>

<script>
  export default {
    name:'questionDetail',
    data() {
      return {
      }
    },
    activated: function () {
      this.initData()
    },
    methods: {
      initData: function () {
      }
    }
  }
</script>

<style scoped>
  .detial-bg{
    position: absolute;
    left:0;
    top:0;
    width: 100%;
    background: #fff;
    align-items:left;
    height: 100%;
  }


  .answer {
    color: #939393;
    margin:0rem 1rem;
    padding-top: 1rem;
    font-size: 1rem;
  }

  .mp{
    width: 100%;
  }


</style>
