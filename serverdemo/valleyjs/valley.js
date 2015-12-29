Valley.define([
  './valley-lib'
], function(){

Valley._config = {
  //global config for server
  root: '',
  webPath: '',
  vjsPath: '',
};

Valley.setConfig = function(config) {
  var i;
  for (i in config) {
    this._config[i] = config[i];
  }
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