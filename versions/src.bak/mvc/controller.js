Valley.define([
  './controller-process',
  '../lib/process',
  '../lib/extend'
], function(){

var Controller = function(config) {
  this._data = {};
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
    return this.renderSimplePage(tplName);
    // return 'hello world : ' + JSON.stringify(this.params);
  },
  renderSimplePage: function(tplName) {
    var tplName = tplName || this.pageId;
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
    var tplName = tplName || this.pageId;
    var tplPromise = Valley.initTplObj(tplName);
    var dataPromise = Valley.get(path, params);
    var con = this;
    return Promise.all([tplPromise, dataPromise]).then(function(res){
      var tpl = res[0];
      var data = res[1];
      var html = Valley.vtpl(tplName, data, con._data);
      return html;
    });
  },
  afterRender: function(){
  },
  _bind: function() {
    this.bind && this.bind();
    this.conSelector = '.vbody-' + this.pageId;
    // $(document.body).delegates(this.eventObj, this.conSelector);
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

Valley.prototype.fn = function(config, prototypeObj, Parent) {
  var Parent = Parent || Controller;
  var Child = Controller.extend(prototypeObj, Parent);
  var child = new Child(config);
  child.init();
  return child;
};

global.Controller = Controller;

// Valley.prototypte.fn = function(config, prototypeObj, Parent) {
//   return Controller.init(config, prototypeObj, Parent);
// }
}, module);
