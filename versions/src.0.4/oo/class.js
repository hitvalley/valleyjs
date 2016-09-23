var Class = {
  __global_classes: {},
  create: function(constructor, prototypeObj) {
    if (arguments.length < 2) {
      throw "at least arguments.length >= 2";
    }
    var i;
    var prototypeObj = prototypeObj || {};
    for (i in prototypeObj) {
      constructor.prototype[i] = prototypeObj[i];
    }
    return constructor;
  },
  extend: function(constructor, prototypeObj, Parent, auto) {
    console.log(arguments.length)
    if (arguments.length < 3) {
      throw "at least arguments.length >= 3";
    }
    var auto = !auto;
    var Child = auto && function() {
      Parent.apply(this, arguments);
      constructor.apply(this, arguments);
    } || constructor;
    var i;
    var tmp = {};
    for (i in prototypeObj) {
      tmp[i] = {
        value: prototypeObj[i],
        writable: true,
        configurable: true,
        enumerable: true
      };
    }
    Child.prototype = Object.create(Parent.prototype, tmp);
    return Child;
  },
  declare: function(name, constructor, prototypeObj, Parent, auto) {
    if (arguments.length === 1) {
      return this.__global_classes[name];
    }
    var prototypeObj = prototypeObj || {};
    var Parent = typeof Parent === 'string' ? this.__global_classes[Parent] : Parent;
    var c;
    if (Parent) {
      c = this.extend(constructor, prototypeObj, Parent, auto);
    } else {
      c = this.create(constructor, prototypeObj);
    }
    this.__global_classes[name] = c;
    return c;
  },
  get: function(name) {
    return this.__global_classes[name];
  },
  init: function(name, args) {
    if (!this.__global_classes[name]) {
      return null;
    }
    var c = this.__global_classes[name];
    var obj = {};
    obj = Object.create(c.prototype);
    c.apply(obj, args);
    return obj;
  },
}
