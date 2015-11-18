define([
  './queue',
  './view',
  './process',
  './url',
  './api'
], function(queue, View, process){

//$.VConfig.deferred = $.Deferred();
//var $container;

var Controller = function(config) {
  this.data = null;
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
  tpl: '',
  funcList: [],
  init: function() {
    this.$container = $('#' + ($.VConfig.container || 'id-valley-container'));
    this.conSelector = 'vbody-' + this.config.pageId;
    this.funcList = process(this);
    this._bind();
    //this.conSelector = '.vbody-%s .vcontainer'.replace('%s', this.config.pageId);
  },
  render: function() {
    var self = this;
    this.$container.prop({
      'class': 'valley-body vbody-' + this.config.pageId
    });
    queue(this.funcList);
//    queue([function(){
//      return self._beforeRequest();
//    }, function(){
//      return self._renderPage();
//    }, function(){
//      return self._afterRender();
//    }]);
  },
  _beforeRequest: function() {
    var self = this;
    var res = this.beforeRequest();
    return res;
  },
  beforeRequest: function() {
  },
  _renderPage: function() {
    var res = this.renderPage();
    return res;
  },
  renderPage: function() {
    return this.renderTestPage();
  },
  _afterRender: function() {
    var res = this.afterRender();
    return res;
  },
  afterRender: function() {
  },
  renderByUrl: function(url, params, tplId) {
    var self = this;
    var params = $.extend(params || {}, $.hashInfo().params);
    var pageId = this.config.pageId;
    return View.getPageView(pageId).then(function(tpl){
      return $.vget(url, params).then(function(data){
        var html = $.tpl(tpl, data);
        self.$container.html(html);
      });
    });
  },
  renderTestPage: function() {
    //console.log(this);
    console.log(this.config.pageId);
    console.log(JSON.stringify($.hashInfo()));
  },
  _bind: function(){
    $(document.body).delegates(this.config.eventObj, '.' + this.conSelector);
    this.bind();
  },
  bind: function() {
  }
});

/**
 * Controller.extend(config, prototypeObj);
 */
Controller.extend = function(config, prototypeObj) {
  //var config = config || {};
  var protoytpeObj = prototypeObj || {};
  var Child = function(config) {
    this.method = Controller;
    this.method.call(this, config || {});
    delete this.method;
  };
  var bridge = new Controller();
  Child.prototype = $.extend(bridge, prototypeObj);
  return Child;
};

Controller.init = function(config, prototypeObj, eventObj) {
  var Child = Controller.extend(config, prototypeObj);
  var config = $.extend(config || {}, {
    eventObj: eventObj
  });
  var child = new Child(config);
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
