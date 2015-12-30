Valley.define([], function(){

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

}, module);