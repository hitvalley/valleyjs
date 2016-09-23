function Class() {
}

Class.prototype = {
  parent: null,
  pmethod: function(name) {
    var args = Array.prototype.slice.call(arguments, 1);
    return this.parent && this.parent[name] && this.parent[name].apply(this, args);
  }
};

Class.declare = function(initFunc, properties, Parent) {
  if (Valley.isPlainObject(initFunc)) {
    Parent = properties;
    properties = initFunc;
    initFunc = null;
  }
  var Parent = Parent || Class;
  var properties = properties || {};
  function Child() {
    var args = Valley.core_slice.call(arguments);
    if (initFunc) {
      args.push(Parent);
      return initFunc.apply(this, args);
    } else {
      return Parent.apply(this, args);
    }
  }
  var tmpObj = Class.setProperties({}, properties);
  var parentPrototype = Parent.prototype;
  Child.prototype = Object.create(parentPrototype, tmpObj);
  Child.prototype.parent = parentPrototype;
  Child.prototype.pmethod = function(name) {
    var args = Array.prototype.slice.call(arguments, 1);
    var proto = Parent.prototype;
    var before = proto[name];
    var now = this[name];
    while (now && before && now === before) {
      proto = proto.parent;
      before = proto[name];
    }
    if (typeof before === 'function') {
      return before.apply(this, args);
    } else {
      return before;
    }
  };
  return Child;
};

Class.setProperties = function(con, properties) {
  if (!con || !properties) {
    return;
  }
  var i, item;
  var tmp = {};
  for (i in properties) {
    if (typeof properties[i] === 'undefined' || Valley.type(properties[i]) === 'null') {
      continue;
    }
    tmp[i] = typeof properties[i] === 'object' && properties[i].enumerable ? properties[i] : {
      value: properties[i],
      writable: true,
      confiurable: true,
      enumerable: true
    };
  }
  Object.defineProperties(con, tmp);
  return tmp;
};