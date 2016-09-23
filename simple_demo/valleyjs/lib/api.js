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

  Valley._apiConfig = {
    host: '127.0.0.1',
    port: '3007',
    protocol: 'http:',
    origin: ''
  };

  Valley.setOrigin = function() {
    this._apiConfig.origin = [
      this._apiConfig.protocol,
      '://',
      this._apiConfig.host,
      ':',
      this._apiConfig.port].join('');
    return this._apiConfig.origin;
  }

  Valley.setAjaxConfig = function(config) {
    this.apiConfig = this.extend(this.apiConfig, config || {});
    this.setOrigin();
  };

  Valley.post = function(path, data, setting){
    return this.ajax(path, 'POST', data, setting);
  };

  Valley.get = function(path, data, setting){
    return this.ajax(path, 'GET', data, setting);
  };
});