// 常用工具文件


  var result
  var randomNum

  export default {
    data () {
      return {
        result:''
      }
    },
    getResult() {
      getNowFormatDate()
      return result
    },
    getRandomNum() {
      getRandomNum()
      return randomNum
    },
    goodTime (str) {
      let now = new Date().getTime()
      let oldTime = new Date(str).getTime()
      let difference = now - oldTime
      let result = ''
      let minute = 1000 * 60
      let hour = minute * 60
      let day = hour * 24
      let month = day * 30
      let year = month * 12
      let _year = difference / year
      let _month = difference / month
      let _week = difference / (7 * day)
      let _day = difference / day
      let _hour = difference / hour
      let _min = difference / minute

      if (_year >= 1) {
        result = '发表于 ' + ~~(_year) + ' 年前'
      } else if (_month >= 1) {
        result = '发表于 ' + ~~(_month) + ' 个月前'
      } else if (_week >= 1) {
        result = '发表于 ' + ~~(_week) + ' 周前'
      } else if (_day >= 1) {
        result = '发表于 ' + ~~(_day) + ' 天前'
      } else if (_hour >= 1) {
        result = '发表于 ' + ~~(_hour) + ' 个小时前'
      } else if (_min >= 1) {
        result = '发表于 ' + ~~(_min) + ' 分钟前'
      } else {
        result = '刚刚'
      }
      return result
    }
  }


function getRandomNum() {
  var num  = "";
  for (var i = 0; i<10 ;i ++){
    num += Math.floor(Math.random() * 10 )
  }
  randomNum = num;
}


