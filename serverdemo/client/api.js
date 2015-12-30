Valley.define([], function(){

Valley.ajax = function(path, method, data, setting){
  var apiConfig = this._apiConfig;
  var method = method || 'GET';
  var url = apiConfig.origin + path;
  var sendData = Valley.encodeURIJson(data || {});
  if (method === 'GET' && sendData) {
    path += '?' + sendData;
  }
  var options = this.extend({
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Content-Length': method === 'GET' ? 0 : sendData.length
    },
    dataType: 'json',
    credentials: 'include',
    mode: 'cors'
  }, setting || {});
  if (method === 'POST' && sendData) {
    options.body = sendData;
  }
  return fetch(url, options).then(function(res){
    if (options.dataType === 'json') {
      var json = res.json();
      return Promise.resolve(json);
    } else {
      return res.text();
    }
  });
};

});