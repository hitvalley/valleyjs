Valley.define([
  './valley-lib'
], function(){

// Valley._config = {
//   //global config for server
//   root: '',
//   webPath: '',
//   vjsPath: '',
// };

Valley.setConfig = function(config) {
  var i;
  var pathConfig = config.pathConfig || {};
  var basicConfig = config.basicConfig || {};
  for (i in pathConfig) {
    this._config[i] = pathConfig[i].replace(/\[(\w+)\]/, function($0, $1){
      return Valley._config[$1];
    });
  }
  for (i in basicConfig) {
    this._config[i] = basicConfig[i].replace(/\[(\w+)\]/, function($0, $1){
      return Valley._config[$1];
    });
  }
  this._config.urlRules = config.urlRules || {};
};

Valley.init = function(config) {
  if (config) {
    Valley.setConfig(config);
  }
  if (!this._config.webPath) {
    this._config.webPath = this._config.root + '/web';
  }
  if (!this._config.conPath) {
    this._config.conPath = this._config.webPath + '/controllers';
  }
  if (!this._config.viewPath) {
    this._config.viewPath = this._config.webPath + '/views';
  }
  if (!this._config.viewExt) {
    this._config.viewExt = '.html';
  }
  if (!this._config.fileEncoding) {
    this._config.fileEncoding = 'utf8';
  }
};

}, module);
