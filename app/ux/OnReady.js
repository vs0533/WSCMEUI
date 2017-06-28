/**
 * Created by byron on 2017/6/28.
 */
var Cookies = {};
Cookies.get = function(name, defaultValue) {
    var cookies = document.cookie.split('; ');
    var i = cookies.length, cookie, value = null;
    while (i--) {
        cookie = cookies[i].split('=');
        if (cookie[0] === name) {
            value = unescape(cookie[1]);
        }
    }
    return value || defaultValue;
};

Cookies.set = function(name, value, expiredays) {
    var exdate = new Date();
    if (!expiredays)
        expiredays = 360;
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = name + '=' + escape(value)
        + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
};

Cookies.remove = function(name) {
    Cookies.set(name, null, -1);
};
function getContextPath() {
    var contextPath = document.location.pathname;
    var index = contextPath.substr(1).indexOf("/");
    contextPath = contextPath.substr(0, index + 1);
    delete index;
    return contextPath;
};