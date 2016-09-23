function setAjaxConfig(input) {
  if (Valley.empty(input)) {
    return;
  }
  var info = [];
  var config = {
    host: input.host || '',
    port: input.port || '',
    protocol: input.protocol || 'http',
    mainPath: input.mainPath || '/',
    apiHost: input.apiHost
  };
  Valley._config.withConfigHost = true;
  if (config.apiHost) {
    Valley._config.apiHost = config.apiHost;
    return;
  }
  if (config.host) {
    info.push(config.protocol);
    info.push('://');
    info.push(config.host);
  }
  if (config.port && config.port !== '80') {
    info.push(':');
    info.push(config.port);
  }
  info.push(config.mainPath);
  Valley._config.apiHost = info.join('');
};

Valley.post = function(path, data, setting){
  return this.ajax(path, 'POST', data, setting);
};

Valley.get = function(path, data, setting){
  return this.ajax(path, 'GET', data, setting);
};

Valley.translateData = null;

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

Valley.__ajaxCacheObj = {};
Valley.getDataWithCache = function(url, params, cacheObj) {
  var url = Valley.analyzeHref(url);
  var params = params || {};
  var cacheObj = cacheObj || this.__ajaxCacheObj;
  var obj = {
    url: url,
    params: params
  };
  var key = getKey(obj);
  if (cacheObj[key]) {
    return Promise.resolve(cacheObj[key]);
  }
  return Valley.get(url, params).then(function(data){
    cacheObj[key] = Valley.translateData(data);
    return cacheObj[key];
  });
};

