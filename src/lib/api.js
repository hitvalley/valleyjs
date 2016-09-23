global.setOrigin = function() {
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

global.setAjaxConfig = function(config) {
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

global.post = function(path, data, setting){
  return this.ajax(path, 'POST', data, setting);
};

global.get = function(path, data, setting){
  return this.ajax(path, 'GET', data, setting);
};

function getKey(obj) {
  var key;
  var url = obj.url;
  var params = obj.params;
  if (url.indexOf('?') >= 0) {
    key = url + '&' + global.encodeURIJson(params);
  } else {
    key = url + '?' + global.encodeURIJson(params);
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

global.__ajaxCacheObj = {};
global.translateData = function(data) {
  return data;
};
global.__specialDataConfigs = {};
global.setSpecialDataConfig = function(name, value) {
  var key;
  if (name && name.url) {
    key = getSKey(name);
  } else {
    key = name;
  }
  this.__specialDataConfigs[key] = value;
};
global.getDataWithCache = function(url, params, cacheObj) {
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
  if (global.__specialDataConfigs[skey]) {
    var special = global.__specialDataConfigs[skey];
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
  return global.get(url, params).then(function(data){
    cacheObj[key] = global.translateData(data);
    return cacheObj[key];
  });
};

