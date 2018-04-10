<template>
  <div class="supportAll">
    <div class="fixPos">
      <ul>
        <li class="list" :class="{ active: hascheck}" @click="ifHas">借记卡</li>
        <li class="list" :class="{ active: !hascheck}" @click="noHas">信用卡</li>
      </ul>
      <p class="textSupp">
        <input type="text" class="search" v-on:input="choose" v-model="search" placeholder="请输入关键字">
      </p>
    </div>
  	<div v-show="hascheck">
      <ul style="font-size: 0px;">
        <li class="ListSupp" v-for="item in bank">
          <img :src="item.img_url" class="suppImg" alt="item.bnk_no">
          <span style="vertical-align: top;">{{item.bnk_nm}}</span>
        </li>
      </ul>
      <div class="mb1">
      	<div class="ifShow ListSupp clearfix" @click="showOne">
      		<span class="fl">城农商行类</span>
      		<span class="fr">共{{firmNum}}家</span>
      	</div>
      	<ul style="font-size: 0px;" v-show="showOne1">
	        <li class="ListSupp" v-for="item in firm">
	          <img :src="item.img_url" class="suppImg" alt="no">
	          <span style="vertical-align: top;">{{item.bnk_nm}}</span>
	        </li>
      	</ul>
      </div>
      <div class="mb1">
      	<div class="ifShow ListSupp clearfix" @click="showtwo">
      		<span class="fl">信用社联合社类</span>
      		<span class="fr">共{{creditNum}}家</span>
      	</div>
      	<ul style="font-size: 0px;" v-show="showtwo1">
	        <li class="ListSupp" v-for="item in credit">
	          <img :src="item.img_url" class="suppImg" alt="no">
	          <span style="vertical-align: top;">{{item.bnk_nm}}</span>
	        </li>
      	</ul>
      </div>
      <div class="mb1">
      	<div class="ifShow ListSupp clearfix" @click="showthree">
      		<span class="fl">外资银行类</span>
      		<span class="fr">共{{foreignNum}}家</span>
      	</div>
      	<ul style="font-size: 0px;" v-show="showthree1">
	        <li class="ListSupp" v-for="item in foreign">
	          <img :src="item.img_url" class="suppImg" alt="no">
	          <span style="vertical-align: top;">{{item.bnk_nm}}</span>
	        </li>
      	</ul>
      </div>
    </div>
    <div v-show="!hascheck">
    	 <ul style="font-size: 0px;">
    	 	<li class="ListSupp" v-if="!supCredit">
          <span style="vertical-align: top;">一大波银行正在路上，我们在努力的接入更多银行。</span>
        </li>
        <li class="ListSupp" v-for="item in supCredit" v-else>
          <img :src="item.img_url" class="suppImg" alt="item.bnk_no">
          <span style="vertical-align: top;">{{item.bnk_nm}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { Spinner } from 'mint-ui';
import {Toast} from 'mint-ui'
export default{
  name: 'supportCard',
  data () {
    return {
      search: '',
      hascheck: true,
      bank: [],
      firm: [],
      firmNum: 0,
      credit: [],
      creditNum: 0,
      foreign: [],
      foreignNum: 0,
      showOne1: false,
      showtwo1: false,
      showthree1: false,
      supCredit: []//支持的信用卡
    }
  },
  activated: function () {
  	var _this = this
  	let params = {
  		crd_typ: '0',
  		cop_bus_typ: '03'
  	}
  	let params1 = {
  		crd_typ: '2',
  		cop_bus_typ: '03'
  	}
//	//银行
//	var bank = []
//	//城农商行
//	var firm = []
//	//信用社
//	var credit = []
//	//外资银行
//	var foreign = []
  	_this.$api.post('supBankQry.do', params, data =>{
//		console.log(data)
		//	//银行
			_this.bank = []
		//	//城农商行
			_this.firm = []
		//	//信用社
			_this.credit = []
		//	//外资银行
			_this.foreign = []
  		for (let i =0 ;i<data.data.length; i++) {
  			if (data.data[i].corg_typ == '0') {
  				_this.bank.push(data.data[i])
  			} else if (data.data[i].corg_typ == '2') {
  				_this.firm.push(data.data[i])
  				_this.firmNum = _this.firm.length
  			} else if (data.data[i].corg_typ == '4') {
  				_this.credit.push(data.data[i])
  				_this.creditNum = _this.credit.length
  			} else if (data.data[i].corg_typ == '5') {
  				_this.foreign.push(data.data[i])
  				_this.foreignNum = _this.foreign.length
  			}
  		}
//		console.log(_this.foreign)
  	})
_this.$api.post('supBankQry.do', params1, data =>{
		//支持的信用卡
			_this.supCredit = []
  		for (let i =0 ;i<data.data.length; i++) {
  				_this.supCredit.push(data.data[i])
  		}
  	})

  },
  computed: {},
  methods: {
    choose: function () {
      var _this = this
      if (this.search === '') {
        $(".ListSupp").show();
      } else {
        $(".ListSupp").hide();
        $(".ListSupp:contains("+_this.search+")").show();
//      console.log(pinYin.ConvertPinyin(_this.search))
//      $(".ListSupp:contains("+pinYin.ConvertPinyin(_this.search)+")").show();
      }
    },
    ifHas: function () {
      if (!this.hascheck) {
        this.hascheck = true
      }
    },
    noHas: function () {
      if (this.hascheck) {
        this.hascheck = false
      }
    },
    showOne: function () {
    	this.showOne1 = !this.showOne1
    },
    showtwo: function () {
    	this.showtwo1 = !this.showtwo1
    },
    showthree: function () {
    	this.showthree1 = !this.showthree1
    }
  }
}
</script>
<style scoped>
  .fixPos{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 5.125rem;
    background: #f4f6f7;
  }
  .list{
    display: inline-block;
    width: 48%;
    height: 2.18rem;
    line-height: 2.18rem;
    margin-bottom: 0.4rem;
    font-size: 0.75rem;
    text-align: center;
  }
  .active{
    color: #e7380c;
    border-bottom: 2px solid #e7380c;
  }
  .search{
    width: 100%;
    height: 2.15rem;
    margin: 0 auto;
    box-sizing: border-box;
    padding-left: 2.4rem;
    background: url("../../images/search.png") 0.8rem center no-repeat;
    background-size: 1rem 1rem;
    border: 1px solid #d1d1d1;
    border-radius: 0.3rem;
    outline: none;
  }
  .supportAll{
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
    padding-top: calc( 5.125rem );
  }
  .textSupp{
    /*height: 4.56rem;*/
    /*line-height: 1.2rem;*/
    width: 96%;
    margin: 0 auto 0;
    box-sizing: border-box;
    /*padding: 1.2rem 5% 0;*/
    /*text-indent: 2em;*/
    font-size: 0.84rem;
    color: black;
    /*margin-bottom: 1rem;*/
    background: #f7f7f7;
  }
  .ListSupp{
    width: 100%;
    height: 3.06rem;
    line-height: 3.06rem;
    box-sizing: border-box;
    padding: 0 5%;
    /*margin-bottom: 0.3rem;*/
    border-top: 1px solid #dfdfdf;
    font-size: 0.84rem;
    text-align: left;
  }
  .suppImg{
    width: 1rem;
    height: 1rem;
    padding-top: 1rem;
    vertical-align: top;
    line-height: 0.84rem;
  }
  .mb1{
  	margin-bottom: 1rem;
  }
  .ifShow{
  	width:100%;
  	box-sizing: border-box;
  	padding: 0 2%;
  	line-height: 3.06rem;
  	background: #d1d1d1;
  }
  .clearfix{
    overflow:hidden;
  }
  .fl {
    float: left;
  }
  .fr{
    float:right;
  }
  li{
    list-style:none;
  }
  ul{
    margin:0;
    padding: 0;
  }
</style>
