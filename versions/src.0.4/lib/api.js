Valley.setOrigin = function() {
  var origins = [];
  if (this._config.apiConfig.host) {
    origins.push(this._config.apiConfig.protocol);
    origins.push('://');
    origins.push(this._config.apiConfig.host);
  }
  if (this._config.apiConfig.port && this._config.apiConfig.port !== '80') {
    origins.push(':');
    origins.push(this._config.apiConfig.port);
  }
  origins.push(this._config.apiConfig.mainPath);
  this._config.apiConfig.origin = origins.join('');
  // return this._config.apiConfig.origin;
}

Valley.setAjaxConfig = function(config) {
  var config = config || {};
  this._config.apiConfig = {
    host: config.host || '',
    port: config.port || '',
    protocol: config.protocol || 'http',
    mainPath: config.mainPath || '/',
    origin: config.origin
  };
  config.origin || this.setOrigin();
};

Valley.post = function(path, data, setting){
  return this.ajax(path, 'POST', data, setting);
};

Valley.get = function(path, data, setting){
  return this.ajax(path, 'GET', data, setting);
};

function getKey(obj) {
  var key;
  var url = obj.url;
  var params = obj.params;
  if (url.indexOf('?') >= 0) {
    key = url + '&' + Valley.encodeURIJson(params);
  } else {
    key = url + '?' + Valley.encodeURIJson(params);
  }
  return key;
}
function getSKey(obj) {
  var key;
  var url = obj.url;
  var params = obj.params;
  var keys = [];
  for (var i in obj.params) {
    keys.push(i);
  }
  if (keys.length <= 0) {
    return url;
  }
  if (url.indexOf('?') >= 0) {
    key = url + '&' + keys.join('&');
  } else {
    key = url + '?' + keys.join('&');
  }
  return key;
}

Valley.__ajaxCacheObj = {};
Valley.translateData = function(data) {
  return data;
};
Valley.__specialDataConfigs = {};
Valley.setSpecialDataConfig = function(name, value) {
  var key, ptype, list = [];
  if (name && name.url) {
    if (Valley.isArray(name.params)) {
      list = name.params
    } else if (Valley.isPlainObject(name.params)){
      list = Object.keys(name.params);
    }
    if (list.length) {
      if (name.url.indexOf('?') >= 0) {
        key = name.url + '&' + list.join('&');
      } else {
        key = name.url + '?' + list.join('&');
      }
    } else {
      key = name.url;
    }
  } else {
    key = name;
  }
  this.__specialDataConfigs[key] = value;
};
Valley.getDataWithCache = function(url, params, cacheObj) {
  var params = params || {};
  var cacheObj = cacheObj || this.__ajaxCacheObj;
  var obj = {
    url: url,
    params: params
  };
  var key = getKey(obj);
  var skey = getSKey(obj);
  if (cacheObj[key]) {
    return Promise.resolve(cacheObj[key]);
  }
  if (Valley.__specialDataConfigs[skey]) {
    var special = Valley.__specialDataConfigs[skey];
    var res = typeof special === 'function' ? special() : special;
    if (res.then) {
      return res.then(function(data){
        cacheObj[key] = data;
        return cacheObj[key];
      });
    } else {
      cacheObj[key] = res;
      return Promise.resolve(cacheObj[key]);
    }
  }
  return Valley.get(url, params).then(function(data){
    cacheObj[key] = Valley.translateData(data);
    return cacheObj[key];
  });
};

