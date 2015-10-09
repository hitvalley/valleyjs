define([
  'lib/tpl',
  'lib/api',
  'mlib/url',
  'mlib/common-events'
], function(){

var $container = $($.VConfig.container || '#id-container');

var Controller = function(config) {
  if (config) {
    //$.pageConfig = {};
    $.pageConfig = config;
    //console.log($.pageConfig);
    this.config = config;
    this.tplId = config.tplId || config.pageId;
  }
};

$.extend(Controller.prototype, {
  limit: 10,
  conSelector: '',
  init: function(){
    //this.viewId = 'id-' +  + '-view';
    this.conSelector = '.sgas-body-%s .sgas-container'.replace('%s', this.config.pageId);
    this.prepare && this.prepare();
    this._bind();
  },
  /**
   * 1. beforeRequest
   * 2. beforeRender
   * 3. renderPage || renderByUrl
   * 4. afterRender
   */
  _afterRender: function() {
  },
  render: function(){
    var i;
    var prepareObj = $.PrepareObj;
    $('.sgas-body').prop({
      'class': 'sgas-body sgas-body-' + this.config.pageId
    });
    for (i in prepareObj) {
      if (typeof prepareObj[i] === 'function') {
        prepareObj[i]();
      }
    }
    $.pageConfig = this.config;
    this.beforeRequest && this.beforeRequest();
    this.renderPage();
  },
  renderPage: function(data, tplId) {
    var data = data || {};
    var tplId = 'id-' + this.tplId + '-view';
    var tpl = $('#' + tplId).html();
    var html = $.tpl.tmpl(tpl, data);
    $container.html(html);
    $(document.body).trigger('afterRender', [data]);
  },
  renderByUrl: function(url, params, tplId, crossDomain){
    var params = $.extend($.hashInfo().params, params || {});
    //var tplId = tplId || ('id-' + $.pageConfig.pageId + '-view');
    var tplId = 'id-' + this.tplId + '-view';
    var tpl = $('#' + tplId).html();
    var html = '';
    var self = this;
    function success(data) {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      data = data.data;
      if (typeof data === 'string') {
        data = JSON.parse(data) || {
          count: 0,
          list: []
        };
      }
      //if (data.count) {
      data.pinfo = self.getPageInfo(data.count);
      //}
      self.beforeRender && self.beforeRender(data);
      html = $.tpl.tmpl(tpl, data);
      $container.html(html);
    }
    params = $.extend(params, self.setPageInfo());
    if (crossDomain) {
      $.vget(url, params).then(success).always(function(data) {
        //self.afterRender && self.afterRender(data);
        $(document.body).trigger('afterRender', [data]);
      });
    } else {
      $.getInfo(url, params, function(data){
        success(data);
        //self.afterRender && self.afterRender(data);
        $(document.body).trigger('afterRender', [data]);
      });
    }
  },
  setPageInfo: function(input) {
    var page = $.hashParams().page || 0;
    var obj = {};
    //if (page) {
    obj.pagestart = this.limit * page;
    obj.pagesize = this.limit;
    //}
    return obj;
  },
  getPageInfo: function(count){
    var limit = $.hashParams().limit || 10;
    return {
      limit: limit,
      count: count,
      len: Math.ceil(count/limit)
    };
  },
  _bind: function() {
    var self = this;
    this.bind();
    $(document.body).on('afterRender', function(event, data){
      self.afterRender && self.afterRender(data);
    });
  },
  bind: function(){
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

return Controller;

});
