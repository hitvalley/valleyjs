define([
  'lib/hash'
], function() {

var urlRegExp = /^(?:([\w\/]*)\?)?(.*)$/;

/**
 * 解析hash中的uri
 */
$.hashInfo = function(url) {
  var url = url || (location.hash || '#').substr(1);
  if (url.indexOf('?') < 0 && url.indexOf('=') < 0) {
    return {
      path: url,
      params: {}
    };
  } else if (url.indexOf('?') < 0 && url.indexOf('=') >= 0) {
    return {
      path: '',
      params: $.queryUrl(url)
    };
  } else if (url.indexOf('?') === 0) {
    return {
      path: '',
      params: $.queryUrl(url.substr(1))
    };
  }
  var res = url.split('?');
  var path = res && res.shift() || '';
  var params = res && res.pop() || '';
  params = $.queryUrl(params);
  return {
    path: path,
    params: params
  };
};

$.hashParams = function(path, obj) {
  var info = $.hashInfo();
  if (typeof path === 'object') {
    obj = path;
    path = info.path;
  }
  var params = $.extend(info.params || {}, obj);
  var pstr = $.encodeURIJson(params);
  if (obj) {
    if (pstr) {
      location.hash = path + '?' + pstr;
    } else {
      location.hash = path;
    }
  }
  return params;
};

$.hashPath = function(path) {
  var info = $.hashInfo();
  var pstr = $.encodeURIJson(info.params);
  location.hash = path + '?' + pstr;
};

});
