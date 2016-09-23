Valley.ajax = function(path, method, data, setting){
  if (!this._config.apiConfig) {
    throw "API config need to set.";
  }
  var apiConfig = this._config.apiConfig;
  var method = method || 'GET';
  var url = apiConfig.origin + path;
  var sendData = Valley.encodeURIJson(data || {});
  if (method === 'GET' && sendData) {
    url += '?' + sendData;
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
  if (method === 'POST' && data) {
    options.body = Valley.encodeURIJson(data);
    // var formData = new FormData();
    // for (var i in data) {
    //   formData.append(i, data[i]);
    // }
    // options.body = formData;
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
