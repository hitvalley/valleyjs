var http = require('http');
var qs = require('querystring');

Valley.ajax = function(path, method, data, setting){
  var apiConfig = this._apiConfig;
  var method = method || 'GET';
  var sendData = Valley.encodeURIJson(data || {});
  if (method === 'GET' && sendData) {
    path += '?' + sendData;
  }
  var options = this.extend({
    host: apiConfig.host,
    port: apiConfig.port,
    protocol: apiConfig.protocol,
    path: path,
    method: method || 'GET',
    dataType: 'json',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Content-Length': method === 'GET' ? 0 : sendData.length
    }
  }, setting || {});
  // console.log(options);
  return new Promise(function(resolve, reject){
    var req = http.request(options, function(res){
      var httpResult;
      res.on('data', function(data){
        httpResult = data.toString();
      });
      res.on('end', function(){
        if (options.dataType === 'json') {
          var json = JSON.parse(httpResult);
          resolve(json);
        } else {
          resolve(httpResult);
        }
      });
    });
    req.on('error', function(err){
      reject(err);
    });
    if (method === 'POST') {
      req.write(sendData);
    }
    req.end();
  });
};