define([], function(){

/**
 * 解析uri里的参数
 * @param  {[type]} url [description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
$.queryUrl = function(url, key) {
    url = url || "";
    url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //去除网址与hash信息
    var json = {};
    //考虑到key中可能有特殊符号如“[].”等，而[]却有是否被编码的可能，所以，牺牲效率以求严谨，就算传了key参数，也是全部解析url。
    url.replace(/(^|&)([^&=]+)=([^&]*)/g, function(a, b, key, value) {
        //对url这样不可信的内容进行decode，可能会抛异常，try一下；另外为了得到最合适的结果，这里要分别try
        try {
            key = decodeURIComponent(key);
        } catch (e) {}

        try {
            value = decodeURIComponent(value);
        } catch (e) {}

        if (!(key in json)) {
            json[key] = /\[\]$/.test(key) ? [value] : value; //如果参数名以[]结尾，则当作数组
        } else if (json[key] instanceof Array) {
            json[key].push(value);
        } else {
            json[key] = [json[key], value];
        }
    });
    return key ? json[key] : json;
};

/**
 * 将json变为uri参数
 * @param  {[type]} json [description]
 * @return {[type]}      [description]
 */
$.encodeURIJson = function(json) {
    var s = [];
    for (var p in json) {
        if (json[p] == null) continue;
        if (json[p] instanceof Array) {
            for (var i = 0; i < json[p].length; i++) s.push(encodeURIComponent(p) + '=' + encodeURIComponent(json[p][i]));
        } else
            s.push((p) + '=' + encodeURIComponent(json[p]));
    }
    return s.join('&');
};

/**
 * 修改URL的hash
 * @param  {[type]} json [description]
 * @return {[type]}      [description]
 */
$.changeHash = function(json) {
    var hash = (location.hash || "#").substr(1);
    var obj = $.queryUrl(hash);
    if (!json) {
        return obj;
    };
    json = json || {};
    obj = $.extend(obj, json);
    for(var name in obj){
        if (obj[name] === null) {
            delete obj[name];
        };
    }
    var hash = $.encodeURIJson(obj);
    location.hash = hash;
    return obj;
};

$.setHash = function(obj) {
    var obj = obj || {};
    var name;
    for (name in obj) {
        if (obj[name] === null) {
            delete obj[name];
        };
    }
    var hash = $.encodeURIJson(obj);
    location.hash = hash;
    return obj;
};

});
