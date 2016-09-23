(function(){

global = this;

function Valley(config, Parent) {
  if (!(this instanceof Valley)) {
    return new Valley(config, Parent);
  }
  return this.fn(config, Parent);
}

Valley._config = {};
Valley.dataObj = {};

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

function explainObj(object, globalData) {
  var newObj = {};
  var i, item;
  for (i in object) {
    item = object[i];
    if (Valley.isString(item)) {
      newObj[i] = item.replace(/\[(\w+)\]|\<(\w+)\>/g, function($0, $1, $2){
        if ($1) {
          return object[$1];
        } else if ($2) {
          return globalData[$2];
        }
      })
    } else if (Valley.isPlainObject(item)) {
      newObj[i] = explainObj(item, globalData);
    } else {
      newObj[i] = item;
    }
  }
  return newObj;
}

/**
 * config:
 *  root
 *  webPath
 *  conPath
 *  viewPath
 *  viewExt
 *  fileEncoding
 */
function setDefaultConfig(config) {
  if (Valley.isString(config.root)) {
    config.root = config.root.toConf();
  } else {
    config.root = '/';
  }
  if (Valley.isString(config.webPath)) {
    config.webPath = config.webPath.toConf();
  } else {
    config.webPath = config.root + 'web/';
  }
  if (Valley.isString(config.conPath)) {
    config.conPath = config.conPath.toConf();
  } else {
    config.conPath = config.webPath + 'controllers/';
  }
  if (Valley.isString(config.viewPath)) {
    config.viewPath = config.viewPath.toConf();
  } else {
    config.viewPath = config.webPath + 'views/';
  }
  config.viewExt = config.viewExt || '.html';
  config.fileEncoding = config.fileEncoding || 'utf8';

  Valley.setAjaxConfig(config.apiConfig);

  config.urlRules = config.urlRules || {};
  config.containerNode = config.containerNode || document.body;
}

Valley.init = function(input, callback) {
  var input = input || {};
  var config = input;
  var globalData = Valley.extend({}, config.globalData || {}, input.data || {});
  this._config = explainObj(config, globalData);
  this.dataObj = globalData;

  this.initTags(input.plugins || []);
  setDefaultConfig(this._config);

  if (callback) {
    input = callback(this._config, this.dataObj, input);
  }

  require.config({
    baseUrl: Valley._config.root
  });
  var preList = [];
  (input.prepares || []).forEach(function(pre, index){
    if (!pre.match(/^http(?:\:)?:\/\//)) {
      pre = Valley._config.webPath + '/' + pre;
    }
    preList.push(pre);
  });

  delete this._config.globalData;
  delete this._config.data;
  delete this._config.prepares;
  delete this._config.plugins;

  require(preList, function(args){
    args && Promise.all(args).then(function(){
      Valley.run();
    }) || (Valley.run());
  });
};

Valley.setServerConfig = function(config) {
  //set for server config
};

