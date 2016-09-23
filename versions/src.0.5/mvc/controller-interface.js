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
Valley.declare = function(prototypeObj, parentPath, requires) {
  var requires = requires || [];
  var parentPath = getConPath(parentPath);
  requires.unshift(parentPath);
  Valley.define(requires, function(Parent){
    var Parent = Parent || Controller;
    var parent = Parent.prototype;
    var args = array_slice.call(arguments, 1);
    var inputs = [].concat(parent).concat(args);
    if (Valley.isFunction(prototypeObj)) {
      prototypeObj = prototypeObj.apply(parent, inputs);
    }
    prototypeObj.requires = args;
    var Child = Controller.declare(prototypeObj, Parent);
    return Child;
  });
};

Valley.prototype.fn = function(controllerName, initObj, requires, callback) {
  if (Valley.isPlainObject(controllerName)) {
    callback = requires;
    requires = initObj;
    initObj = controllerName;
    controllerName = false;
  }
  var conPath = getConPath(controllerName);
  var requires = requires || [];
  requires.unshift(conPath);
  this.controllerName = controllerName;
  this._promise = new Promise(function(resolve){
    Valley.require(requires, function(Con){
      var Con = Controller.delcare(initObj || {}, Con || Controller);
      var con = new Con();
      con.id = controllerName;
      // con = Valley.extend(con, initObj);
      callback && callback.apply(con, array_slice.call(arguments, 1));
      resolve(con);
    });
  });
  return this;
};

Valley.prototype.getPromise = function() {
  return this._promise;
};

window.clist = {};

Valley.prototype.init = function() {
  this._promise = this._promise.then(function(con) {
    Valley.debug && (clist[Valley.getRand()] = con);
    con.init();
    return con;
  });
  return this;
};

Valley.prototype.render = function(data, callback) {
  var data = data || {};
  if (Valley.isFunction(data)) {
    callback = data;
    data = {};
  }
  this._promise = this._promise.then(function(con){
    con.data = Valley.extend({}, con.data, data);
    con.run().then(function(data) {
      callback && callback.call(con, data);
    });
    return con;
  });
  return this;
};

var instantiationList = [];
Valley.prototype.run = function(callback) {
  if (instantiationList[this.controllerName]) {
    return instantiationList[this.controllerName].render(callback);
  }
  instantiationList[this.controllerName] = this;
  return this.init().render(callback);
};

Valley.prototype.bind = function(eventObj, selector) {
  if (!eventObj) {
    return;
  }
  var selector = selector || '';
};
