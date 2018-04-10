import Vue from 'vue'
import Router from 'vue-router'
import myBankCard from '@/page/bankcardManager/myBankCard'
import bankCardDetail from '@/page/bankcardManager/bankCardDetail'
import addBankCard from '@/page/bankcardManager/addBankCard'
import supportCard from '@/page/bankcardManager/supportCard'
import inputCardMsg from '@/page/bankcardManager/inputCardMsg'
import queryError from '@/page/qryError/queryError'
import forget from '@/page/password/forget'
import forgetPsw from '@/page/password/forgetPsw'
import loginPsw from '@/page/password/loginPsw'
import password from '@/page/password/password'
import payPsw from '@/page/password/payPsw'
import remember from '@/page/password/remember'
import forgetlogin from '@/page/password/forgetlogin'
import forgetloginPsw from '@/page/password/forgetloginPsw'
import forPassword from '@/page/password/forPassword'
import oldOrNew from '@/page/password/oldOrNew'
import loginNumber from '@/page/password/loginNumber'
import err404 from '@/page/err404/err404'
import err500 from '@/page/err500/err500'
import recharge from '@/page/recharge/recharge'
import selectBankcard from '@/page/selectBankcard/selectBankcard'
import withdraw from '@/page/withdraw/withdraw'
import account from '@/page/account/account'
import inputSmsCode from '@/page/bankcardManager/inputSmsCode'
import VipRed from '@/page/coupon/VipRed'
import redRecord from '@/page/coupon/redRecord'
import Detail from '@/page/coupon/detail'
import payList from '@/page/coupon/payList'
import success from '@/page/coupon/success'
import aboutUs from '@/page/account/aboutUs'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/inputSmsCode',
      name: 'inputSmsCode',
      meta: {
        title: '填写验证码'
      },
      component: inputSmsCode
    },
    {
      path: '/addBankCard',
      name: 'addBankCard',
      meta: {
        title: '添加银行卡',
        keepAlive: true
      },
      component: addBankCard
    },
    {
      path: '/supportCard',
      name: 'supportCard',
      meta: {
        title: '支持的银行',
        keepAlive: true
      },
      component: supportCard
    },
    {
      path: '/myBankCard',
      name: 'myBankCard',
      meta: {
        title: '我的银行卡',
      },
      component: myBankCard
    },
    {
      path: '/bankCardDetail',
      name: 'bankCardDetail',
      meta: {
        title: '银行卡详情',
        keepAlive: true
      },
      component: bankCardDetail
    },
    {
      path: '/inputCardMsg',
      name: 'inputCardMsg',
      meta: {
        title: '添加银行卡',
        keepAlive: true
      },
      component: inputCardMsg
    },
    {
      path: '/err404',
      name: 'err404',
      component: err404
    },
    {
      path: '/err500',
      name: 'err500',
      component: err500
    },
    {
      path: '/queryError',
      name: 'queryError',
      component: queryError
    },
    {
      path: '/recharge',
      name: 'recharge',
      meta: {
        title: '充值'
      },
      component: recharge
    },
    {
      path: '/selectBankcard',
      name: 'selectBankcard',
      meta: {
        title: '选择银行卡'
      },
      component: selectBankcard
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      meta: {
        title: '提现'
      },
      component: withdraw
    },
    {
      path: '/VipRed',
      name: 'VipRed',
      meta: {
        title: 'VIP专属红包',
        keepAlive: true
      },
      component: VipRed
    },
    {
      path: '/success',
      name: 'success',
      meta: {
        title: 'VIP专属红包'
      },
      component: success
    },
    {
      path: '/payList',
      name: 'payList',
      meta: {
        title: 'VIP专属红包',
        keepAlive: true
      },
      component: payList
    },
    {
      path: '/redRecord',
      name: 'redRecord',
      meta: {
        title: 'VIP专属红包'
      },
      component: redRecord
    },
    {
      path: '/Detail',
      name: 'Detail',
      meta: {
        title: 'VIP专属红包'
      },
      component: Detail
    },
    {
      path: '/forget',
      name: 'forget',
      meta: {
        title: '重置支付密码',
        keepAlive: true
      },
      component: forget
    },
    {
      path: '/forgetPsw',
      name: 'forgetPsw',
      meta: {
        title: '设置支付密码'
      },
      component: forgetPsw
    },
    {
      path: '/loginPsw',
      name: 'loginPsw',
      meta: {
        title: '修改登录密码'
      },
      component: loginPsw
    },
    {
      path: '/password',
      name: 'password',
      meta: {
        title: '密码管理'
      },
      component: password
    },
    {
      path: '/payPsw',
      name: 'payPsw',
      meta: {
        title: '重置支付密码'
      },
      component: payPsw
    },
    {
      path: '/remember',
      name: 'remember',
      meta: {
        title: '重置支付密码'
      },
      component: remember
    },
    {
      path: '/forgetlogin',
      name: 'forgetlogin',
      meta: {
        title: '忘记登录密码'
      },
      component: forgetlogin
    },
    {
      path: '/forgetloginPsw',
      name: 'forgetloginPsw',
      meta: {
        title: '忘记登录密码',
        keepAlive: true
      },
      component: forgetloginPsw
    },
    {
      path: '/forPassword',
      name: 'forPassword',
      meta: {
        title: '校验支付密码'
      },
      component: forPassword
    },
    {
      path: '/loginNumber',
      name: 'loginNumber',
      meta: {
        title: '忘记登录密码'
      },
      component: loginNumber
    },
    {
      path: '/oldOrNew',
      name: 'oldOrNew',
      meta: {
        title: '忘记登录密码'
      },
      component: oldOrNew
    },
    {
      path: '/account',
      name: 'account',
      meta: {
        title: '账户'
      },
      component: account
    },
    {
      path: '/aboutUs',
      name: 'aboutUs',
      meta: {
        title: '关于我们'
      },
      component: aboutUs
    },
  ]
})
