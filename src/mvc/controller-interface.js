var array_slice = Array.prototype.slice;

function getConPath(path) {
  if (!path) {
    return '';
  }
  if (!path.match(/\.js$/)) {
    path += '.js';
  }
  if (!path.match(/!^\//)) {
    path = '/' + path;
  }
  return Valley._config.conPath + path;
}

var mark = 0;
var pluginList = [];

Valley.declare = function(name, prototypeObj, parentPath, requires) {
  if (Valley.isPlainObject(name)) {
    requires = parentPath;
    parentPath = prototypeObj;
    prototypeObj = name;
    name = null;
  }
  requires = requires || [];
  if (pluginList.indexOf(name) < 0) {
    parentPath = getConPath(parentPath);
    if (parentPath) {
      requires.unshift(parentPath);
    }
  }
  return Valley.define(requires, function(Parent){
    var Parent = Parent || Controller;
    var parent = Parent.prototype;
    var args = array_slice.call(arguments, 1);
    var inputs = [].concat(parent).concat(args);
    if (Valley.isFunction(prototypeObj)) {
      prototypeObj = prototypeObj.apply(parent, inputs);
    }
    prototypeObj.requires = args;
    var Child = Controller.declare(prototypeObj, Parent);
    var cpro = Child.prototype;
    if (cpro.documentEventObj) {
      document.body.ons(cpro.documentEventObj, '', cpro);
      delete cpro.documentEventObj;
    }
    return Child;
  }, name);
};

Valley.plugin = function(name, prototypeObj, parentPath, requires) {
  pluginList.push(name);
  return this.declare(name, prototypeObj, parentPath, requires);
};

function toController(Controller, controllerName, properties, v) {
  var con = new Controller();
  con.id = controllerName;
  properties && Class.setProperties(con, properties);
  if (Valley.isPlainObject(con.interfaces)) {
    var key, func;
    for (key in con.interfaces) {
      func = con.interfaces[key];
      func = Valley.isFunction(func) ? func : (con[func] || function(){});
      v[key] = func.bind(con);
    }
  }
  return con;
}

Valley.prototype.fn = function(controllerName, properties) {
  if (Valley.isPlainObject(controllerName)) {
    prototypeObj = controllerName;
    controllerName = false;
  }
  var v = this;
  var conPath = pluginList.indexOf(controllerName) < 0 ? getConPath(controllerName) : controllerName;
  this.controllerName = controllerName;
  if (controllerName) {
    this._promise = new Promise(function(resolve){
      Valley.require([conPath], function(Con){
        var con = toController(Con, controllerName, properties, v);
        resolve(con);
      });
    });
  } else {
    this._promise = new Promise(function(resolve){
      var con = toController(Con, controllerName, properties, v);
      resolve(con);
    });
  }
  return this;
};

Valley.prototype.getPromise = function() {
  return this._promise;
};

Valley.prototype.init = function(data) {
  this._promise = this._promise.then(function(con) {
    con.init(data);
    return con;
  });
  return this;
};

Valley.prototype.render = function(request, tpl, el, isAppend) {
  this._promise = this._promise.then(function(con){
    con.render(request, tpl, el, isAppend);
    return con;
  });
  return this;
};

var instantiationList = {};
Valley.prototype.run = function(config) {
  var v = this;
  config = config || {};
  if (!instantiationList[this.controllerName]) {
    instantiationList[this.controllerName] = v.init(config.data);
  }
  instantiationList[this.controllerName].render(config.request, config.tpl, config.el, config.isAppend);
  return this;
};

Valley.prototype.then = function(callback) {
  return this._promise.then(callback);
};

Valley.prototype.bind = function(eventObj, selector) {
  if (!eventObj) {
    return;
  }
  var selector = selector || '';
};

// Valley.prototype.method
