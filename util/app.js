export const serverUrl = "http://localhost:8088"

export function getUrlParam(paramName) {
    var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");    //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);            //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null;             //返回参数值
}

export function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        // console.log(c)
        while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1){
                return c.substring(name.length, c.length);
            }
        }
    return "";
}