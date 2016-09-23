Node.prototype.one = function(types, selector, data, fn) {
  this.on(types, selector, data, fn, 1);
};

Node.prototype.ons = function(configs, psel, data) {
  var name, value, obj;
  var psel = psel ? (psel + ' ') : '';
  var data = data || {};
  var event, eventFun;
  for (name in configs) {
    value = configs[name];
    if (typeof value === 'function') {
      obj = {
        click: value
      };
    } else {
      obj = value;
    }
    for (event in obj) {
      eventFun = obj[event];
      this.on(event, psel + name, data, function(){
        data.con && (this.con = data.con);
        data.el && (this.el = data.el);
        eventFun.call(this, arguments);
      });
    }
  }
};

NodeList.prototype.on = function(types, selector, data, fn, one) {
  this.forEach(function(node, index){
    node.on(types, selector, data, fn, one);
  });
};

NodeList.prototype.off = function(types, selector, fn) {
  this.forEach(function(node, index){
    node.off(types, selector, fn);
  });
};

NodeList.prototype.one = function(types, selector, data, fn, one) {
  this.forEach(function(node, index){
    node.on(types, selector, data, fn, 1);
  });
};

