Valley.define([
  './core'
], function(){

var class2type = {};
[
  'Boolean',
  'Number',
  'String',
  'Function',
  'Array',
  'Date',
  'RegExp',
  'Object'
].forEach(function(name, i){
  class2type["[object " + name + "]"] = name.toLowerCase();
});

Valley.isWindow = function(obj) {
  if (module) {
    return false;
  }
  return obj != null && obj == obj.window;
}

Valley.isNumeric = function(obj) {
  return !isNaN(parseFloat(obj)) && isFinite(obj);
};

Valley.type = function(obj) {
  return obj == null ?
    String(obj) :
    class2type[Valley.core_toString.call(obj)] || "object";
};

Valley.isString = function(obj) {
  return Valley.type(obj) === 'string';
};

Valley.isArray = function(obj) {
  return Valley.type(obj) === 'array';
};

Valley.isFunction = function(obj) {
  return Valley.type(obj) === 'function';
}

Valley.isPlainObject = function(obj) {
  if (!obj
      || Valley.type(obj) !== 'object'
      || obj.nodeType
      || Valley.isWindow(obj)) {
    return false;
  }
  try {
    if (obj.constructor
        && !Valley.core_hasOwn.call(obj, "constructor")
        && !Valley.core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
      return false;
    }
  } catch(e) {
    return false;
  }
  var key;
  for (key in obj) {}

  return key === undefined || Valley.core_hasOwn.call(obj, key);
};

Valley.isEmptyObject = function(obj) {
  var name;
  for (name in obj) {
    return false;
  }
  return true;
};

Valley.isInClient = function() {
  return module === 'ValleyJsOnBrowser';
};

}, module);
