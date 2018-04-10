var MobileDetect = require('mobile-detect')
var md = new MobileDetect(window.navigator.userAgent)
var opSys = md.os()
//var opSysVer = md.versionStr('Version')
var requestId = new Date().getTime()
if (opSys === 'iOS'){
	var autuCode = 'ios_wap_001'
	var opSysVerinfo = md.ua.substring(md.ua.indexOf("(")+1,md.ua.indexOf(")"))
	var opSysVer =opSysVerinfo.substring(opSysVerinfo.lastIndexOf("iPhone")+9,opSysVerinfo.indexOf("like"));
}else if (opSys === 'AndroidOS'){
	var autuCode = 'and_wap_001'
	var opSysVerinfo = md.ua.substring(md.ua.indexOf("Android"),md.ua.indexOf(")"))
	var opSysVer =opSysVerinfo.substring(8,opSysVerinfo.indexOf(";"));
}
//var clientIP = returnCitySN["cip"]
var params = ({
            "charset": '00',
            "version": 'v1.1.1',
            "service": 'dow',
            "requestId": requestId,
            "opSys": opSys,
            "opSysVer": opSysVer,
            "reqTyp": "WH5",
            "payApp": "01",
            "ccy": "CNY",
            "authCode": autuCode
        });
export default params
