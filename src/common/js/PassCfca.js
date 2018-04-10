/***********密码控件工具包**************/
/***************H5密码默认参数******************/
// 输出密文类型
var outputTypeHash = false;
// 加密算法
var cipherTypeSM2 = false;
// 是否加密
var dencrypted = true;
// 随机数类型NONE、DIGITAL、ALL
var randomType = "NONE";
// 声明多个密码控件数组
var arraySIP = new Array();
// 公钥
var RSA_PUBLIC_KEY = "";
// 服务端随机因子
var serverRandom = "";
// 声明多个密码控件数组
var arrays = "";

import $ from 'jquery'
export default {
  data() {
    return {
      RSA_PUBLIC_KEY: '',
      serverRandom: '',
      arrays: ''
    }
  },
  /**
   * 初始化密码控件
   */
  initInput() {
    RSA_PUBLIC_KEY = this.RSA_PUBLIC_KEY;
    serverRandom = this.serverRandom;
    arrays = this.arrays;
    if (null == arrays || "" == arrays) {
      return;
    }
    for (var i = 0; i < arrays.length; i++) {
      var sipboxId = arrays[i].toString();
      var sipboxTyp = arrays[i].substr(arrays[i].lastIndexOf("_") + 1, this.arrays[i].length);
      initCompleteKeyboard(sipboxId, i, sipboxTyp);
    }
  },
  //只能输入数字字母等
//checkRegex(sipboxId) {
//  var sipInput = getSIPInput(sipboxId);
//  var matchRegex = $("#" + sipboxId).attr("matchRegex");
//  if (sipInput.checkMatchRegex(sipboxId, matchRegex)) {
//      return true;
//  } else {
//      return false;
//  }
//},
  /**
   * 监听触摸事件
   */
  //initSetUpEvent() {
  //  arrays = this.arrays;
  //  var _this = this
  //  setUpEvent(document, "touchstart", function (e) {
  //    var elem = e.srcElement || e.target;
  //    var noNeedHideIds = [];
  //      for (var i = 0; i < _this.arrays.length; i++) {
  //        noNeedHideIds.add("'" + _this.arrays[i].toString() + "'");
  //      }
  //    while (elem) {
  //      if (noNeedHideIds.indexOf(elem.id) !== -1) {
  //        return;
  //      }
  //      elem = elem.parentNode;
  //    }
  //    for (var i = 0; i < _this.arrays.length; i++) {
  //      _this.arrays[i].hideKeyboard();
  //    }
  //  })
  //},
  /**
   * 获取密文
   * @param sipboxId
   * @returns {{value: *, random: *}}
   */
  getEncrypt(sipboxId) {
    var keyboard = getKeyboard(sipboxId);
    var encryptedInputValue = keyboard.getEncryptedInputValue(sipboxId);
    var errorCode = keyboard.getErrorCode(sipboxId).toString(16);
    if (errorCode != CFCA_OK) {
      alert("加密异常：" + errorCode)
      // todo 需增加错误展示
      return;
    }
    var encryptedClientRandom = keyboard.getEncryptedClientRandom(sipboxId);
    errorCode = keyboard.getErrorCode(sipboxId).toString(16);
    if (errorCode != CFCA_OK) {
      alert("获取随机因子异常：" + errorCode)
      // todo 需增加错误展示
      return;
    }
    return {value: encryptedInputValue, random: encryptedClientRandom};
    this.arrays[i].hideKeyboard();
  },
  /**
   * 密码正则校验
   * @param sipboxId
   * @returns {boolean}
   */
  checkRegex(sipboxId) {
    var Keyboard = getKeyboard(sipboxId);
    var matchRegex = document.getElementById(sipboxId).getAttribute("matchRegex");
    if (Keyboard.checkMatchRegex(sipboxId, matchRegex)) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 密码比较
   * @param sipboxId1
   * @param sipboxId2
   * @returns {boolean}
   */
  checkEqual(sipboxId1, sipboxId2) {
    var Keyboard = getKeyboard(sipboxId1);
    if (Keyboard.checkInputValueMatch(sipboxId1, sipboxId2)) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * 监听键盘事件
 * @param elem
 * @param eventType
 * @param handler
 * @returns {null}
 */
function setUpEvent(elem, eventType, handler) {
  return (elem.attachEvent ? elem.attachEvent("on" + eventType, handler)
    : ((elem.addEventListener) ? elem.addEventListener(eventType, handler, false) : null));
}

/**
 * 键盘初始化
 * @param sipboxId
 * @param i
 * @param str
 */
function initCompleteKeyboard(sipboxId, i, str) {
//if (null == arraySIP[i] || undefined == arraySIP[i]) {
    if ("string" === str) {
      //非数字键盘初始化
      arraySIP[i] = new CFCAKeyboard(KEYBOARD_TYPE_COMPLETE);
    } else if ("number" === str) {
      //数字键盘初始化
      arraySIP[i] = new CFCAKeyboard(KEYBOARD_TYPE_NUMBER);

    }
//}

  arraySIP[i].bindInputBox(sipboxId);
  arraySIP[i].setInputChangeCallback(inputChangeCallback);
  arraySIP[i].hideKeyboard();
  var sipBox = document.getElementById(sipboxId);
  setUpEvent(sipBox, "focus", function (event) {
    sipBox.blur();
    arraySIP[i].bindInputBox(sipboxId);
    if (CFCA_OK != arraySIP[i].setServerRandom(serverRandom, sipboxId)) alert("setServerRandom error");
    if (CFCA_OK != arraySIP[i].setRSAPubKey(RSA_PUBLIC_KEY, sipboxId)) alert("setRSAPubKey error");
    for (var j = 0; j < arraySIP.length; j++) {
      if (arraySIP[i] != arraySIP[j]) {
//      if (arraySIP[j].isShowing()) {
          arraySIP[j].hideKeyboard();
//      }
      }
    }
    arraySIP[i].showKeyboard();
    setProperty(sipboxId)
  });
}

/**
 * 获取密码控件对象
 * @param sipboxId
 * @returns {*}
 */
function getKeyboard(sipboxId) {
  for (var i = 0; i < arrays.length; i++) {
    if (sipboxId == arrays[i]) {
      return arraySIP[i];
    }
  }
}

/**
 * 设置密码控件属性
 * @param sipboxId
 */
function setProperty(sipboxId) {
  var sipBoxIdDoc = document.getElementById(sipboxId);
  var keyboard = getKeyboard(sipboxId);
  keyboard.bindInputBox(sipboxId);
  keyboard.setSpaceKeyImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAqCAYAAACz+XvQAAABDWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGCSSCwoyGESYGDIzSspCnJ3UoiIjFJgf8TAyCDEIMigwKCYmFxc4BgQ4MMABDAaFXy7BlQNBJd1QWZhyuMFXCmpxclA+g8QpyQXFJUwMDAmANnK5SUFIHYLkC2SlA1mzwCxi4AOBLLXgNjpEPYBsBoI+wpYTUiQM5D9AsjmS4Kwf4DY6WA2EweIDbUX7AZHoLtTFYC+J9HxhEBJakUJiHbOL6gsykzPKFGA2OSZl6yno2BkYGjBwAAKb4jqz4HgcGQUO4MQQwCEWOVeYEwEMTCw7ESIhQH9t0afgUGWGSGmpsTAIFTPwLCxILm0qAxqDCPjWQYGQnwAaD9Ll9QFt1YAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAEWSURBVEgN1ZXBDsMgDENb/v+Htx0YEDuEndaYSlsvqSvxcJzSno/Xs57HvGq7VXQ5OqFdKH6T1SXC6gc8owdwtTiUO4X6WhvQ+9NgfXWpSI9MVc+WG51Q+Expn/KRmUDfmS6wHlPGUzxk29zkil5aZqtKvWPK5sejgL2sRob7oGHKojW0tA6FfYLtr8QFHU6K0fiKZKtlCGcOEfTaMlsTKoAbwoOJwiPMAajaHNLghuoZksX4snoAuXhHbUBiVG+23lsmTq0+5cqPKwxn9eKQELrM6AVIkFIHMOMkbhrX3+Mw7qbehykbimc5W5HhHlg30YA/f1IwBf/8i9oyRNsTajFk9F/8lxGaZ6dpO3ob3xwDNlO7mG8CqofQW4DrPAAAAABJRU5ErkJggg==", 120, 20);
  var outputType = outputTypeHash ? OUTPUT_TYPE_HASH : OUTPUT_TYPE_ORIGINAL;
  var cipherType = cipherTypeSM2 ? CIPHER_TYPE_SM2 : CIPHER_TYPE_RSA;
  var isEncrypted = dencrypted ? true : false;
  var minLength = parseInt(sipBoxIdDoc.getAttribute("minLength"));
  var maxLength = parseInt(sipBoxIdDoc.getAttribute("maxLength"));
  var matchRegex = sipBoxIdDoc.getAttribute("matchRegex");
  var randomtype;
  if (randomType == KEYBOARD_DISORDER_NONE) randomtype = KEYBOARD_DISORDER_NONE;
  if (randomType == KEYBOARD_DISORDER_ONLY_DIGITAL) randomtype = KEYBOARD_DISORDER_ONLY_DIGITAL;
  if (randomType == KEYBOARD_DISORDER_ALL) randomtype = KEYBOARD_DISORDER_ALL;
  if ("" != minLength && null != minLength && undefined != minLength) {
    if (CFCA_OK != keyboard.setMinLength(minLength, sipboxId)) alert("setMinLength error");
  }
  if ("" != maxLength && null != maxLength && undefined != maxLength) {
    if (CFCA_OK != keyboard.setMaxLength(maxLength, sipboxId)) alert("setMaxLength error");
  }
  if (CFCA_OK != keyboard.setOutputType(outputType, sipboxId)) alert("setOutputType error");
  if (CFCA_OK != keyboard.setEncryptState(isEncrypted, sipboxId)) alert("setEncryptState error");
  if (CFCA_OK != keyboard.setServerRandom(serverRandom, sipboxId)) alert("setServerRandom error");
  if (CFCA_OK != keyboard.setCipherType(cipherType, sipboxId)) alert("setCipherType error");
  if ("" != matchRegex && null != matchRegex && undefined != matchRegex) {
    if (CFCA_OK != keyboard.setMatchRegex(matchRegex, sipboxId)) alert("setMatchRegex error");
  }
  if (CFCA_OK != keyboard.setRSAPubKey(RSA_PUBLIC_KEY, sipboxId)) alert("setRSAPubKey error");
  if (CFCA_OK != keyboard.setRandomType(randomtype, sipboxId)) alert("setRandomType error");
}

 function inputChangeCallback(sipBoxId,type,length){
   var result = '<div class="li-item-dot"></div>';
   if(type == 1){
	   switch (sipBoxId) {
      case "paypswNum_number":
        if (length == 1) {
          $('#pay_box1 li:eq(0)').html('<div></div>')
          $('#pay_box1 li:eq(0)').removeClass('active')
          $('#pay_box1 li:eq(1)').addClass('active')
          $("#ifSend").val('')
        } else if(length == 2) {
          $('#pay_box1 li:eq(1)').html('<div></div>')
          $('#pay_box1 li:eq(1)').removeClass('active')
          $('#pay_box1 li:eq(2)').addClass('active')
          $("#ifSend").val('')
        } else if(length == 3) {
          $('#pay_box1 li:eq(2)').html('<div></div>')
          $('#pay_box1 li:eq(2)').removeClass('active')
          $('#pay_box1 li:eq(3)').addClass('active')
          $("#ifSend").val('')
        } else if(length == 4) {
          $('#pay_box1 li:eq(3)').html('<div></div>')
          $('#pay_box1 li:eq(3)').removeClass('active')
          $('#pay_box1 li:eq(4)').addClass('active')
          $("#ifSend").val('')
        } else if(length == 5) {
          $('#pay_box1 li:eq(4)').html('<div></div>')
          $('#pay_box1 li:eq(4)').removeClass('active')
          $('#pay_box1 li:eq(5)').addClass('active')
          $("#ifSend").val('')
        } else if(length == 6) {
          $('#pay_box1 li:eq(5)').removeClass('active')
          $('#pay_box1 li:eq(5)').html('<div></div>')
          $("#ifSend").val(6)
          $("#ifSend").focus()
          if($('#paypswNum_number').val().length == 6){
            $('#NumberKeyboard').css('display','none')
          }
        }
        break;
       case "forgetPsw_number":
         if (length == 1) {
           $('#forget_pay_box li:eq(0)').addClass('forgetDot')
           $('#forget_pay_box li:eq(0)').removeClass('active')
           $('#forget_pay_box li:eq(1)').addClass('active')
         } else if(length == 2) {
           $('#forget_pay_box li:eq(1)').addClass('forgetDot')
           $('#forget_pay_box li:eq(1)').removeClass('active')
           $('#forget_pay_box li:eq(2)').addClass('active')
         } else if(length == 3) {
           $('#forget_pay_box li:eq(2)').addClass('forgetDot')
           $('#forget_pay_box li:eq(2)').removeClass('active')
           $('#forget_pay_box li:eq(3)').addClass('active')
         } else if(length == 4) {
           $('#forget_pay_box li:eq(3)').addClass('forgetDot')
           $('#forget_pay_box li:eq(3)').removeClass('active')
           $('#forget_pay_box li:eq(4)').addClass('active')
         } else if(length == 5) {
           $('#forget_pay_box li:eq(4)').addClass('forgetDot')
           $('#forget_pay_box li:eq(4)').removeClass('active')
           $('#forget_pay_box li:eq(5)').addClass('active')
         } else if(length == 6) {
           $('#forget_pay_box li:eq(5)').removeClass('active')
           $('#forget_pay_box li:eq(5)').addClass('forgetDot')
           if($('#forgetPsw_number').val().length == 6){
            $('#NumberKeyboard').css('display','none')
          }
         }
         break;
         case "remember_number":
         if (length == 1) {
           $('#forget_pay_box li:eq(0)').addClass('forgetDot')
           $('#forget_pay_box li:eq(0)').removeClass('active')
           $('#forget_pay_box li:eq(1)').addClass('active')
         } else if(length == 2) {
           $('#forget_pay_box li:eq(1)').addClass('forgetDot')
           $('#forget_pay_box li:eq(1)').removeClass('active')
           $('#forget_pay_box li:eq(2)').addClass('active')
         } else if(length == 3) {
           $('#forget_pay_box li:eq(2)').addClass('forgetDot')
           $('#forget_pay_box li:eq(2)').removeClass('active')
           $('#forget_pay_box li:eq(3)').addClass('active')
         } else if(length == 4) {
           $('#forget_pay_box li:eq(3)').addClass('forgetDot')
           $('#forget_pay_box li:eq(3)').removeClass('active')
           $('#forget_pay_box li:eq(4)').addClass('active')
         } else if(length == 5) {
           $('#forget_pay_box li:eq(4)').addClass('forgetDot')
           $('#forget_pay_box li:eq(4)').removeClass('active')
           $('#forget_pay_box li:eq(5)').addClass('active')
         } else if(length == 6) {
           $('#forget_pay_box li:eq(5)').removeClass('active')
           $('#forget_pay_box li:eq(5)').addClass('forgetDot')
           $("#hidden").focus()
           if($('#remember_number').val().length == 6){
            $('#NumberKeyboard').css('display','none')
          }
         }
         break;
       case "forgetPsw55_number":
         if (length == 1) {
           $('#forget_pay_box1 li:eq(0)').addClass('forgetDot')
           $('#forget_pay_box1 li:eq(0)').removeClass('active')
           $('#forget_pay_box1 li:eq(1)').addClass('active')
         } else if(length == 2) {
           $('#forget_pay_box1 li:eq(1)').addClass('forgetDot')
           $('#forget_pay_box1 li:eq(1)').removeClass('active')
           $('#forget_pay_box1 li:eq(2)').addClass('active')
         } else if(length == 3) {
           $('#forget_pay_box1 li:eq(2)').addClass('forgetDot')
           $('#forget_pay_box1 li:eq(2)').removeClass('active')
           $('#forget_pay_box1 li:eq(3)').addClass('active')
         } else if(length == 4) {
           $('#forget_pay_box1 li:eq(3)').addClass('forgetDot')
           $('#forget_pay_box1 li:eq(3)').removeClass('active')
           $('#forget_pay_box1 li:eq(4)').addClass('active')
         } else if(length == 5) {
           $('#forget_pay_box1 li:eq(4)').addClass('forgetDot')
           $('#forget_pay_box1 li:eq(4)').removeClass('active')
           $('#forget_pay_box1 li:eq(5)').addClass('active')
         } else if(length == 6) {
           $('#forget_pay_box1 li:eq(5)').removeClass('active')
           $('#forget_pay_box1 li:eq(5)').addClass('forgetDot')
           if($('#forgetPsw55_number').val().length == 6){
            $('#NumberKeyboard').css('display','none')
          }
         }
         break;
      default:
        break;
		}
   } else {
     switch (sipBoxId) {
       case "paypswNum_number":
         if (length == 1) {
           $('#pay_box1 li:eq(0)').html('<div></div>')
           $('#pay_box1 li:eq(0)').removeClass('active')
           $('#pay_box1 li:eq(1)').html('')
           $('#pay_box1 li:eq(1)').addClass('active')
           $('#pay_box1 li:eq(2)').html('')
           $('#pay_box1 li:eq(2)').removeClass('active')
           $('#pay_box1 li:eq(3)').html('')
           $('#pay_box1 li:eq(3)').removeClass('active')
           $('#pay_box1 li:eq(4)').html('')
           $('#pay_box1 li:eq(4)').removeClass('active')
           $('#pay_box1 li:eq(5)').html('')
           $('#pay_box1 li:eq(5)').removeClass('active')
           $("#ifSend").val('')
         } else if(length == 2) {
           $('#pay_box1 li:eq(2)').html('')
           $('#pay_box1 li:eq(2)').addClass('active')
           $('#pay_box1 li:eq(3)').html('')
           $('#pay_box1 li:eq(3)').removeClass('active')
           $('#pay_box1 li:eq(4)').html('')
           $('#pay_box1 li:eq(4)').removeClass('active')
           $('#pay_box1 li:eq(5)').html('')
           $('#pay_box1 li:eq(5)').removeClass('active')
           $("#ifSend").val('')
         } else if(length == 3) {
           $('#pay_box1 li:eq(3)').html('')
           $('#pay_box1 li:eq(3)').addClass('active')
           $('#pay_box1 li:eq(4)').html('')
           $('#pay_box1 li:eq(4)').removeClass('active')
           $('#pay_box1 li:eq(5)').html('')
           $('#pay_box1 li:eq(5)').removeClass('active')
           $("#ifSend").val('')
         } else if(length == 4) {
           $('#pay_box1 li:eq(4)').html('')
           $('#pay_box1 li:eq(4)').addClass('active')
           $('#pay_box1 li:eq(5)').html('')
           $('#pay_box1 li:eq(5)').removeClass('active')
           $("#ifSend").val('')
         } else if(length == 5) {
           $('#pay_box1 li:eq(5)').html('')
           $('#pay_box1 li:eq(5)').addClass('active')
         } else if (length == 0) {
           $('#pay_box1 li:eq(0)').html('')
           $('#pay_box1 li:eq(0)').addClass('active')
           $('#pay_box1 li:eq(1)').html('')
           $('#pay_box1 li:eq(1)').removeClass('active')
           $('#pay_box1 li:eq(2)').html('')
           $('#pay_box1 li:eq(2)').removeClass('active')
           $('#pay_box1 li:eq(3)').html('')
           $('#pay_box1 li:eq(3)').removeClass('active')
           $('#pay_box1 li:eq(4)').html('')
           $('#pay_box1 li:eq(4)').removeClass('active')
           $('#pay_box1 li:eq(5)').html('')
           $('#pay_box1 li:eq(5)').removeClass('active')
         }
         break;
       case "forgetPsw_number":
         if (length == 1) {
           $('#forget_pay_box li:eq(0)').addClass('forgetDot')
           $('#forget_pay_box li:eq(0)').removeClass('active')
           $('#forget_pay_box li:eq(1)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(1)').addClass('active')
           $('#forget_pay_box li:eq(2)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(2)').removeClass('active')
           $('#forget_pay_box li:eq(3)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(3)').removeClass('active')
           $('#forget_pay_box li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(4)').removeClass('active')
           $('#forget_pay_box li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(5)').removeClass('active')
         } else if(length == 2) {
           $('#forget_pay_box li:eq(2)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(2)').addClass('active')
           $('#forget_pay_box li:eq(3)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(3)').removeClass('active')
           $('#forget_pay_box li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(4)').removeClass('active')
           $('#forget_pay_box li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(5)').removeClass('active')
         } else if(length == 3) {
           $('#forget_pay_box li:eq(3)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(3)').addClass('active')
           $('#forget_pay_box li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(4)').removeClass('active')
           $('#forget_pay_box li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(5)').removeClass('active')
         } else if(length == 4) {
           $('#forget_pay_box li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(4)').addClass('active')
           $('#forget_pay_box li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(5)').removeClass('active')
         } else if(length == 5) {
           $('#forget_pay_box li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(5)').addClass('active')
         } else if (length == 0) {
           $('#forget_pay_box li:eq(0)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(0)').addClass('active')
           $('#forget_pay_box li:eq(1)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(1)').removeClass('active')
           $('#forget_pay_box li:eq(2)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(2)').removeClass('active')
           $('#forget_pay_box li:eq(3)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(3)').removeClass('active')
           $('#forget_pay_box li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(4)').removeClass('active')
           $('#forget_pay_box li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(5)').removeClass('active')
         }
         break;
         case "remember_number":
         if (length == 1) {
           $('#forget_pay_box li:eq(0)').addClass('forgetDot')
           $('#forget_pay_box li:eq(0)').removeClass('active')
           $('#forget_pay_box li:eq(1)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(1)').addClass('active')
           $('#forget_pay_box li:eq(2)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(2)').removeClass('active')
           $('#forget_pay_box li:eq(3)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(3)').removeClass('active')
           $('#forget_pay_box li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(4)').removeClass('active')
           $('#forget_pay_box li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(5)').removeClass('active')
           $("#hidden").blur()
         } else if(length == 2) {
           $('#forget_pay_box li:eq(2)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(2)').addClass('active')
           $('#forget_pay_box li:eq(3)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(3)').removeClass('active')
           $('#forget_pay_box li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(4)').removeClass('active')
           $('#forget_pay_box li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(5)').removeClass('active')
           $("#hidden").blur()
         } else if(length == 3) {
           $('#forget_pay_box li:eq(3)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(3)').addClass('active')
           $('#forget_pay_box li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(4)').removeClass('active')
           $('#forget_pay_box li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(5)').removeClass('active')
           $("#hidden").blur()
         } else if(length == 4) {
           $('#forget_pay_box li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(4)').addClass('active')
           $('#forget_pay_box li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(5)').removeClass('active')
           $("#hidden").blur()
         } else if(length == 5) {
           $('#forget_pay_box li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(5)').addClass('active')
           $("#hidden").blur()
         } else if (length == 0) {
           $('#forget_pay_box li:eq(0)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(0)').addClass('active')
           $('#forget_pay_box li:eq(1)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(1)').removeClass('active')
           $('#forget_pay_box li:eq(2)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(2)').removeClass('active')
           $('#forget_pay_box li:eq(3)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(3)').removeClass('active')
           $('#forget_pay_box li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(4)').removeClass('active')
           $('#forget_pay_box li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box li:eq(5)').removeClass('active')
           $("#hidden").blur()
         }
         break;
       case "forgetPsw55_number":
         if (length == 1) {
           $('#forget_pay_box1 li:eq(0)').addClass('forgetDot')
           $('#forget_pay_box1 li:eq(0)').removeClass('active')
           $('#forget_pay_box1 li:eq(1)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(1)').addClass('active')
           $('#forget_pay_box1 li:eq(2)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(2)').removeClass('active')
           $('#forget_pay_box1 li:eq(3)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(3)').removeClass('active')
           $('#forget_pay_box1 li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(4)').removeClass('active')
           $('#forget_pay_box1 li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(5)').removeClass('active')
         } else if(length == 2) {
           $('#forget_pay_box1 li:eq(2)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(2)').addClass('active')
           $('#forget_pay_box1 li:eq(3)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(3)').removeClass('active')
           $('#forget_pay_box1 li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(4)').removeClass('active')
           $('#forget_pay_box1 li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(5)').removeClass('active')
         } else if(length == 3) {
           $('#forget_pay_box1 li:eq(3)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(3)').addClass('active')
           $('#forget_pay_box1 li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(4)').removeClass('active')
           $('#forget_pay_box1 li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(5)').removeClass('active')
         } else if(length == 4) {
           $('#forget_pay_box1 li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(4)').addClass('active')
           $('#forget_pay_box1 li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(5)').removeClass('active')
         } else if(length == 5) {
           $('#forget_pay_box1 li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(5)').addClass('active')
         } else if (length == 0) {
           $('#forget_pay_box1 li:eq(0)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(0)').addClass('active')
           $('#forget_pay_box1 li:eq(1)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(1)').removeClass('active')
           $('#forget_pay_box1 li:eq(2)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(2)').removeClass('active')
           $('#forget_pay_box1 li:eq(3)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(3)').removeClass('active')
           $('#forget_pay_box1 li:eq(4)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(4)').removeClass('active')
           $('#forget_pay_box1 li:eq(5)').removeClass('forgetDot')
           $('#forget_pay_box1 li:eq(5)').removeClass('active')
         }
         break;
       default:
         break;
     }
   }
 }
