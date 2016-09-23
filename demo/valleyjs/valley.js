(function(){

function loadJs(src, success) {
  if (Valley.isInClient()) {
    var script = document.createElement('script');
    script.src = src + '.js';
    // Valley._config.client + src + '.js';
    script.onload = function() {
      success && success();
    };
    if (document.body) {
      document.body.appendChild(script);
    } else {
      window.onload = function() {
        document.body.appendChild(script);
      };
    }
  } else {
    // require(Valley._config.server + src);
    require(src);
    success && success();
  }
};

function loadJsList(list, success){
  var mark = list.length;
  list.forEach(function(src, index) {
    var src = Valley._config.endPath + src;
    loadJs(src, function(){
      mark --;
      if (mark <= 0) {
        success && success();
      }
    });
  });
};

var Valley = function(config, prototypeConfig, Parent) {
  return this.fn(config, prototypeConfig, Parent);
};

Valley._config = {
};

Valley.isInClient = function(){
  return global === global.window;
};

String.prototype.toConf = function() {
  return this.replace(/\[(\w+)\]|\<(\w+)\>/, function($0, $1, $2){
    if ($1) {
      return Valley._config[$1];
    } else {
      return global[$2];
    }
  });
};

Valley.setConfig = function(config) {
  var i;
  var pathConfig = config.pathConfig || {};
  var basicConfig = config.basicConfig || {};
  if (this.isInClient()) {
    this._config.root = (config.client || {}).root.toConf();
    this._config.plugins = (config.client || {}).plugins;
  } else {
    this._config.root = (config.server || {}).root.toConf();
  }
  for (i in pathConfig) {
    this._config[i] = pathConfig[i].toConf();
  }
  for (i in basicConfig) {
    this._config[i] = basicConfig[i].toConf();
  }
  this._config.urlRules = config.urlRules || {};
  this._config.containerNode = config.containerNode;
};

Valley.prepares = function() {
};

Valley.init = function(config) {
  config && Valley.setConfig(config);
  console.log(this._config);
  if (!this._config.root) {
    if (this.isInClient()) {
      this._config.root = '/';
    } else {
      this._config.root = __dirname + '/';
    }
  }
  if (!this._config.webPath) {
    this._config.webPath = this._config.root + 'web/';
  }
  if (!this._config.conPath) {
    this._config.conPath = this._config.webPath + 'controllers/';
  }
  if (!this._config.viewPath) {
    this._config.viewPath = this._config.webPath + 'views/';
  }
  if (!this._config.vjsPath) {
    this._config.vjsPath = this._config.root + 'valleyjs/';
  }
  if (!this._config.client) {
    this._config.client = this._config.vjsPath + 'client/';
  }
  if (!this._config.server) {
    this._config.server = this._config.vjsPath + 'server/';
  }
  if (!this._config.viewExt) {
    this._config.viewExt = '.html';
  }
  if (!this._config.fileEncoding) {
    this._config.fileEncoding = 'utf8';
  }

  if (this.isInClient()) {
    this._config.endPath = this._config.client;
    global.module = 'ValleyJsOnBrowser';
  } else {
    this._config.endPath = this._config.server;
  }

  loadJsList(['define', 'page'], function(){
    Valley.prepares();
    Valley.run();
  });
};

global = this;
global.Valley = Valley;

}());