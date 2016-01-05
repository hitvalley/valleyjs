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
    if (Valley.isInClient()) {
      this._bind();
    }
  },
  renderFailPage: function() {
    console.log('fail');
  },
  render: function() {
    var self = this;
    return Valley.process(this.rFunList, arguments, this).then(function(res){
      return res[0];
    }, function(reason){
      return self.renderFailPage(reason);
    });
  },
  renderPage: function() {
    var tplName = tplName || this.pageId;
    return this.renderSimplePage()
    // return 'hello world : ' + JSON.stringify(this.params);
  },
  renderSimplePage: function(tplName) {
    var tplName = tplName || this.pageId;
    var scope = this;
    return Valley.getView(tplName);
  },
  renderTpl: function(data, tplName) {
    var tplName = tplName || this.pageId;
    var data = data || {};
    var scope = this;
    return Valley.getView(tplName).then(function(tpl){
      var html = Valley.tpl(tpl, data, scope);
      return html;
    });
  },
  renderPageByUrl: function(path, params, tplName) {
    var tplPromise = Valley.getView(tplName || this.pageId);
    var dataPromise = Valley.get(path, params);
    var con = this;
    return Promise.all([tplPromise, dataPromise]).then(function(res){
      var tpl = res[0];
      var data = res[1];
      var html = Valley.tpl(tpl, data, con);
      return html;
    });
  },
  afterRender: function(){
  },
  _bind: function() {
    this.bind && this.bind();
    this.conSelector = '.vbody-' + this.pageId;
    $(document.body).delegates(this.eventObj, this.conSelector);
  }
});

Controller.extendController = function(Controller, config, prototypeObj) {

};

Controller.extend = function(prototypeObj, Parent) {
  var Parent = Parent || Controller;
  var prototypeObj = prototypeObj || {};
  var Child = function(config) {
    this.method = Parent;
    this.method.call(this, config || {});
    delete this.method;
  };
  var bridge = new Parent();
  Child.prototype = Valley.extend(bridge, prototypeObj);
  return Child;
};

Controller.init = function(config, prototypeObj, eventObj, Parent) {
  var Parent = Parent || Controller;
  var Child = Controller.extend(prototypeObj, Parent);
  var config = Valley.extend(config, {
    eventObj: eventObj
  });
  var child = new Child(config);
  child.init();
  return child;
};

return Controller;

}, module);
