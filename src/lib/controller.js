define([
  './url',
  './api'
], function(){

var $container = $($.VConfig.container || '#id-container');

var Controller = function(config) {
  this.config = config || {};
};

/**
 * 请求顺序如下:
 * prepare -> render
 * render:
 *        1. beforeRender
 *        2. renderPage
 *        3. afterRender
 */
$.extend(Controller.prototype, {
  init: function() {
    //this.conSelector = '.vbody-%s .vcontainer'.replace('%s', this.config.pageId);
  },
  render: function() {
    this.renderPage();
  },
  renderPage: function() {
    this.renderTestPage();
  },
  renderByUrl: function(url, params, tplId) {
    var params = $.extend(params || {}, $.hashInfo().params);
    var tplId = tplId || ('id-' + this.tplId + '-view');
    var tpl = $('#' + tplId).html();
    $.getInfo(url, params, function(data){
      var html = $.tpl(tpl, data);
      $container.html(html);
    });
  },
  renderTestPage: function() {
    //console.log(this);
    console.log(this.config.pageId);
    console.log(JSON.stringify($.hashInfo()));
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
