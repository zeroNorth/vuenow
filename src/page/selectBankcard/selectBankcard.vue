<template>
  <div class="content">
    <div class="all_cards">
    <ul class="list_bottom">
      <li v-for="(item, index) in bindCardList" class="listItem" @click="changeCard(index)">
        <!-- 选中的对号 -->
        <div class="fr rightIcon" v-if="index==currentIndex">
          <img src="../../images/click_ic_tick_sel.png" class="img-selected"/>
        </div>
        <div class="fr rightIcon" v-else>
          <img src="../../images/click_ic_tick_nor.png" class="img-selected"/>
        </div>

        <!-- item前面的银行卡图标 -->
        <div class="fl other-pic1" >
          <img :src="item.img_url"  class="img-wh"/>
        </div>

        <!-- item的内容 银行卡 -->
        <div class="fl">
          <p class="otherP">{{item.bnk_nm}} {{'0'==item.crd_typ?'储蓄卡':'信用卡'}} {{item.crdno_last}}</p>

          <p class="shadoww" v-if="selectType=='0'">单笔限额{{item.stokAmtLimitFomart}}元 单日限额{{item.dayAmtLimitFomart}}元</p>
          <p class="shadoww" v-else>单笔限额{{item.wdcAmtLimitFomart}}元</p>
        </div>
      </li>
    </ul>
    </div>
    <div class="addButton" @click="addBankCard">
      <span>添加银行卡</span>
    </div>
  </div>

</template>
<script>

  import numeral from 'numeral'
  import store from '../../store/store.js'

export default {
  name: 'selectBankcard',
  data () {
    return {

      bindCardList:[],
      currentIndex:-1,
      //selectType 0 充值 1 提现
      selectType:'0',
    }
  },
  created: function () {
    this.selectType = this.$store.state.select_type;
    //查询绑定银行卡
    this.qryBindCrdInfo();
  },
  methods: {

    //选择方式后，设置item数据
    setCurrentData: function (index) {
      var _this = this
      if(_this.bindCardList.length>0){
        _this.currentIndex = index;
        if('0'==this.selectType){
          this.$router.push({
            name: 'recharge',
            params: {listSelected: _this.bindCardList[index]}
          })
        }else{
          this.$router.push({
            name: 'withdraw',
            params: {listSelected: _this.bindCardList[index]}
          })
        }

      }
    },

    qryBindCrdInfo:function(){
      var _this = this

      let param = {
        //查询类型 	0：借记卡  1：信用卡 2：全部
        'qry_typ':'0',
      }

      _this.$api.post('bindCardsQry.do', param, data => {
        _this.bindCardList = data.data;
        for (var i=0;i<_this.bindCardList.length;i++)
        {
          _this.bindCardList[i].stokAmtLimitFomart = numeral(parseFloat(_this.bindCardList[i].stok_amt_limit)/100).format('0,0.00')
          _this.bindCardList[i].dayAmtLimitFomart = numeral(parseFloat(_this.bindCardList[i].day_amt_limit)/100).format('0,0.00')
          _this.bindCardList[i].wdcAmtLimitFomart = numeral(parseFloat(_this.bindCardList[i].wdc_amt_limit)/100).format('0,0.00')
        }

      }, fail => {
      })
    },
    changeCard: function (index) {
      this.setCurrentData(index);
    },
    addBankCard: function (){
      this.$router.push({
        name:'addBankCard',
        //selectType 0 充值 1 提现
        params: {selectType: this.selectType}
      })
    }
  },

}
</script>

<style scoped>
ul {
  list-style-type: none;
}

.addButton {
  background: #E84F47;
  color: white;
  width: 100%;
  font-size: 1rem;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  position: fixed;
  bottom: 0rem;
}

.other-pic1 {
  height: 4.5rem;
  line-height: 4.5rem;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.img-selected {
  width: 1rem;
  height: 1rem;
  vertical-align: middle;
  margin-top: 1.5rem;
}

.img-wh {
  width: 1.875rem;
  height: 1.875rem;
  vertical-align: middle;
}

.otherP {
  height: 1.06rem;
  line-height: 1.06rem;
  margin-left: 0.5rem;
  color: #666666;
  text-align: left;
  margin-top: 1rem;
  font-weight: bold;
  font-size: 0.875rem;
}

.shadoww {
  margin-left: 0.5rem;
  margin-top: 0.3125rem;
  color: #939393;
  font-size: 0.875rem;
}

.all_cards {
  /*margin-top: 1.5rem;*/
  font-size: 0.75rem;
  overflow: scroll;
}

.listItem {
  padding-left: 1rem;
  height: 4.5rem;
  background-color: white;
  margin-top: 1px;
}

.rightIcon {
  height: 4.5rem;
  position: absolute;
  right: 1rem;
}

.list_bottom {
  padding-bottom: 3rem;
}

</style>

