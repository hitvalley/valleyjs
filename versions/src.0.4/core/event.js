Node.prototype.one = function(types, selector, data, fn) {
  this.on(types, selector, data, fn, 1);
};

Node.prototype.ons = function(configs, psel, data) {
  var name, value, obj;
  var psel = psel ? (psel + ' ') : '';
  var data = data || {};
  var event;
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
      this.on(event, psel + name, data, obj[event]);
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

