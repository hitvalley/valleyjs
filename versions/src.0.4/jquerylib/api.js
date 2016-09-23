Valley.ajax = function(path, method, data, setting) {
  if (!this._config.apiConfig) {
    throw "API config need to set.";
  }
  var apiConfig = this._config.apiConfig;
  var method = method || 'GET';
  var url = (apiConfig.origin || '') + path;
  var options = $.extend(true, setting, {
    method: method || 'GET',
    data: data || {}
  });
  return new Promise(function(resolve, reject){
    $.ajax(url, options).then(function(data){
      if (Valley.type(data) === 'string') {
        data = JSON.parse(data);
      }
      resolve(data);
    }, function(reason){
      reject(reason);
    });
  });
};

