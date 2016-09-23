Valley.queryUrl = function(url, key) {
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

Valley.encodeURIJson = function(json) {
  var s = [];
  for (var p in json) {
    if (json[p] == null) {
      continue;
    }
    if (json[p] instanceof Array) {
      for (var i = 0; i < json[p].length; i++) {
        s.push(encodeURIComponent(p)
            + '[]='
            + encodeURIComponent(json[p][i]));
      }
    } else {
      s.push((p) + '=' + encodeURIComponent(json[p]));
    }
  }
  return s.join('&');
};

/**
 * Parse url
 *    path?params1&params2
 *    path
 *    param1&param2
 */
Valley.parseURL = function(url) {
  var queryIndex = url.indexOf('?');
  var path, paramsStr;
  if (queryIndex >= 0) {
    path = url.substring(0, queryIndex);
    paramStr = url.substring(queryIndex + 1);
  } else if (url.match(/[=#]/)) {
    path = '';
    paramStr = url;
  } else {
    path = url;
    paramStr = '';
  }
  return {
    path: path,
    params: this.queryUrl(paramStr)
  };
};

