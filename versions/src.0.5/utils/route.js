/**
 * url -> controller / action / params
 */

function queryUrl(url, key) {
  var url = url || '';
  url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //去除网址与hash信息
  var json = {};
  url.replace(/(^|&)([^&=]+)(?:=([^&]*))?/g, function(a, b, key, value) {
    try {
      key = decodeURIComponent(key);
      value = typeof value === 'undefined' ? undefined : decodeURIComponent(value);
    } catch (e) {}
    if (!(key in json)) {
      json[key] = /\[\]$/.test(key) ? [value] : value;
    } else if (json[key] instanceof Array) {
      json[key].push(value);
    } else {
      json[key] = [json[key], value];
    }
  });
  return key ? json[key] : json;
};

function getHashUrl() {
  return (location.hash || '#').substr(1);
}

function getPathInfo(url) {
  var index = url.indexOf('?');
  var path, paramstr, params = {};
  if (index >= 0) {
    path = url.substring(0, index);
    paramstr = url.substring(index + 1);
  } else if (url.indexOf('=') >= 0) {
    path = '';
    paramstr = url;
  } else {
    path = url;
    paramstr = '';
  }
  params = queryUrl(paramstr);
  return {
    path: path,
    params: params
  };
}

Valley.queryUrl = queryUrl;

Valley.route = function(url) {
  var url = url || getHashUrl();
  var routeInfo = getPathInfo(url);
  return routeInfo;
};

Valley.getParams

Valley.urlRules = {
  '': 'index',
  '*': 'error'
};

Valley.routeToCon = function(url, callback) {
  var route = this.route(url);
  var path = route.path;
  var conPath = this.urlRules[path] || path;
  var callback = callback || function(){
    var cname = ' vbody-' + this.pageId;
    var className = this._el.className;
    className = className.replace(/\s*vbody-\w+\s*/g, '');
    this.el.className = className + cname;
  };
  return Valley(conPath).run(callback);
};

