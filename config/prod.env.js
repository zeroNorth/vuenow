// 根据package.json中的启动脚本名打包不同环境参数
const TARGET = process.env.npm_lifecycle_event;
if ("dev" === TARGET) {
  var obj = {
    NODE_ENV: '"production"',
    API_ROOT: '"https://dev.piccfu.com.cn:8088/mhp"'
  }
} else if ("sit" === TARGET) {
  var obj = {
    NODE_ENV: '"production"',
    API_ROOT: '"https://uat.piccfu.com.cn/mhp"'
  }
} else if ("uat" === TARGET) {
  var obj = {
    NODE_ENV: '"production"',
    API_ROOT: '"https://uat.piccfu.com.cn/mhp"'
  }
} else if ("uat3" === TARGET) {
  var obj = {
    NODE_ENV: '"production"',
    API_ROOT: '"https://www.piccuat.murongtech.com/mhp"'
  }
} else if ("prd" === TARGET) {
  var obj = {
    NODE_ENV: '"production"',
    API_ROOT: '"https://www.piccfu.com/mhp"'
  }
}
module.exports = obj
