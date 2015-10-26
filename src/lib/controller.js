define([
  './url'
], function(){

var Controller = function() {

};

$.extend(Controller.prototype, {
  init: function() {
    //this.conSelector = '.vbody-%s .vcontainer'.replace('%s', this.config.pageId);
  },
  render: function() {
    this.renderSimplePage();
  },
  renderSimplePage: function() {
    console.log(this);
  }
});

/**
 * Controller.extend(config, prototypeObj);
 */
Controller.extend = function(config, prototypeObj) {
  var config = config || {};
  var protoytpeObj = prototypeObj || {};
  var Child = function() {
    this.method = Controller;
    this.method.call(this, config);
    delete this.method;
  };
  var bridge = new Controller();
  Child.prototype = $.extend(bridge, prototypeObj);
  return Child;
};

Controller.init = function(config, prototypeObj) {
  var Child = Controller.extend(config, prototypeObj);
  var child = new Child();
  child.init();
  return child;
}

Controller.run = function(path) {
  var config = $.VConfig;
  var name = config.urlRules[path] || path;
  var rarr = [];
  rarr.unshift(config.conPath + name + '.js');
  require(rarr, function(controller){
    if (controller) {
      controller.render();
    }
  });
};

return Controller;

});
