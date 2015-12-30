Valley.define([
  '../lib/process',
  './controller-process'
], function(){

var Controller = function(config) {
  this.data = null;
  this.config = config || {};
  this.eventObj = this.config.eventObj || {};
};

Valley.extend(Controller.prototype, {
  rFunList: [],
  init: function() {
    this.pageId = this.config.pageId;
    this.rFunList = Valley.initConProcess(Valley._processConfig, this);
  },
  render: function() {
    return Valley.process(this.rFunList, arguments, this);
  },
  renderPage: function() {
    return 'hello world : ' + JSON.stringify(this.params);
  },
  renderTpl: function(data, tplName) {
    var tplName = tplName || this.pageId;
    var data = data || {};
    var scope = this;
    return new Promise(function(resolve, reject){
      Valley.getView(tplName).then(function(tpl){
        var html = Valley.tpl(tpl, data, scope);
        resolve(html);
      });
    });
  },
  _bind: function() {
    this.bind && this.bind();
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
