define([
  './view',
  './process'
], function(View, process){

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
    $.queue(this.funcList);
  },
  beforeRequest: function() {
  },
  renderPage: function() {
    return this.renderSimplePage();
  },
  afterRender: function() {
  },
  renderTpl: function(tplId, data) {
    var self = this;
    var tplId = tplId || this.config.tplId || this.config.pageId;
    return View.getPageView(tplId).then(function(tpl){
      self.config.getPageInfo = self.getPageInfo;
      var html = $.tpl(tpl, data, self.config);
      self.$container.html(html);
    });
  },
  renderByUrl: function(url, params, tplId) {
    var self = this;
    var params = $.extend(params || {}, $.hashInfo().params);
    return $.vget(url, params).then(function(data){
      self.renderTpl(tplId, data);
    });
  },
  renderSimplePage: function(data) {
    var data = data || {};
    var tplId = tplId || this.config.tplId || this.config.pageId;
    return this.renderTpl(tplId, data);
  },
  renderTestPage: function() {
    //console.log(this);
    console.log(this.config.pageId);
    console.log(JSON.stringify($.hashInfo()));
  },
  setPageInfo: function(input) {
    var page = $.hashParams().page || 0;
    var obj = {};
    obj.pagestart = this.limit * page;
    obj.pagesize = this.limit;
    return obj;
  },
  getPageInfo: function(count){
    var limit = $.hashInfo().params.limit || 10;
    return {
      limit: limit,
      count: count,
      len: Math.ceil(count/limit)
    };
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
