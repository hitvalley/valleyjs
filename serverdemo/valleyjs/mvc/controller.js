Valley.define([
  // './view',
  // './process'
], function(View, Process){

var Controller = function(config) {
  this.data = null;
  this.config = config || {};
};

Valley.extend(Controller.prototype, {
  init: function() {
    // console.log('init');
    this.params = Valley.route();
    // console.log(rInfo);
  },
  render: function() {
    return 'hello world : ' + JSON.stringify(this.params);
  }
});

Controller.extend = function(config, prototypeObj) {
  var prototypeObj = prototypeObj || {};
  var Child = function(config) {
    this.method = Controller;
    this.method.call(this, config || {});
    delete this.method;
  };
  var bridge = new Controller();
  Child.prototype = Valley.extend(bridge, prototypeObj);
  return Child;
};

Controller.init = function(config, prototypeObj, eventObj) {
  var Child = Controller.extend(config, prototypeObj);
  var config = Valley.extend(config, {
    eventObj: eventObj
  });
  var child = new Child(config);
  child.init();
  return child;
};

return Controller;

}, module);