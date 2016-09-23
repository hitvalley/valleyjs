var Interface = {
  __global_interfaces: {},
  /**
   * name: interface name
   * methods: the list of method name
   */
  declare: function(name, methods, parent) {
    if (!name || !methods) {
      throw 'need name or methods';
    }
    if (this.__global_interfaces[name]) {
      return this.__global_interfaces[name];
    }
    if (typeof parent === 'string') {
      parent = this.__global_interfaces[parent];
    }
    var tmp = {};
    methods.forEach(function(method, i){
      tmp[method] = {
        value: true,
        writable: true,
        enumerable: true
      };
    });
    var interface = Object.create(parent || {}, tmp);
    this.__global_interfaces[name] = interface;
    return this.__global_interfaces[name];
  },
  getMethods: function(name) {
    var interface = this.__global_interfaces[name];
    var methods = [];
    var i;
    for (i in interface) {
      interface[i] && methods.push(i);
    }
    return methods;
  },
  implements: function(Class, interfaces) {
    var methods = [];
    var self = this;
    if (typeof interfaces === 'string') {
      interfaces = interfaces.split(/,/);
    }
    interfaces.forEach(function(interfaceName){
      var mtmp = self.getMethods(interfaceName);
      methods = methods.concat(mtmp);
    });
    var proto = Class.prototype;
    methods.forEach(function(method){
      if (!proto[method]) {
        Class.prototype[method] = function(){};
      }
    });
  }
};