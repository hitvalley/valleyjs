var Controller = function() {
};

/**
 * _data: 当前类使用的数据
 * data: 包含继承关系的数据，会被对应的tpl引用为this
 */

Valley.extend(Controller.prototype, {
  _rFunList: [],
  parent: {
    data: {
      defaultPageId: 'vcon'
    }
  },
  _prepareInit: function() {
    this.prepareInit && this.prepareInit();
  },
  _prepare: function() {
    this.pageId = this.data.pageId || this.data.defaultPageId;
    this.prepare && this.prepare();
  },
  init: function() {
    this.data = Valley.extend(this.parent && this.parent.data || {}, this._data || {});
    this.rFunList = Valley.initConProcess(Valley._processConfig, this);
    if (Valley.isInClient()) {
      this._bind();
    }
    this._prepareInit();
  },
  getViewId: function() {
    return this.data.tplId || this.getPageId();
  },
  getPageId: function() {
    return this.data.pageId || this.data.defaultPageId || Valley.route().path;
  },
  renderFailPage: function() {
    console.log('fail');
  },
  render: function() {
    var self = this;
    self._prepare();
    return Valley.process(this.rFunList, arguments, this).then(function(res){
      return res[0];
    }, function(reason){
      throw reason;
      return self.renderFailPage(reason);
    });
  },
  renderPage: function() {
    return this.renderSimplePage(this.getViewId());
  },
  renderSimplePage: function(tplName) {
    return this.renderTpl();
  },
  // prepareData
  // prepareTpl
  renderTpl: function(data, tplName) {
    var tplName = tplName || this.getViewId();
    var data = data || {};
    var scope = Valley.extend(Valley.dataObj, this.data);
    return Valley.initTplObj(tplName).then(function(){
      return Valley.tpl(tplName, data, scope);
    });
  },
  renderPageByUrl: function(path, params, tplName) {
    var tplName = tplName || this.getViewId();
    var params = Valley.extend(Valley.route().params, params);
    for (var i in params) {
      if (params[i] === null) {
        delete params[i];
      }
    }
    var tplPromise = Valley.initTplObj(tplName);
    var dataPromise = Valley.get(path, params);
    var con = this;
    return Promise.all([tplPromise, dataPromise]).then(function(res){
      var tpl = res[0];
      var data = res[1];
      data = data.data || data;
      // con.initPage(data.count);
      var scope = Valley.extend(Valley.dataObj, con.data);
      var html = Valley.tpl(tplName, (data.data || data), scope);
      return html;
    });
  },
  renderPageWithAsynData: function(mainConfig, asynConfig, tplName, container) {
    var tplName = tplName || this.getViewId();
    var con = this;
    var scope = Valley.extend(Valley.dataObj, con.data);
    return Valley.vtpl(tplName, mainConfig, asynConfig, scope, container).then(function(res){
      return res.html;
    });
  },
  afterRender: function(){
  },
  afterAsynRender: function(){
  },
  stop: function() {
    return Promise.reject('stop');
  },
  // _eventList: [],
  commonEventObj: {},
  containerEventObj: {},
  _bind: function() {
    var self = this;
    this.conSelector = '.vbody-' + this.getPageId();
    this.bind && this.bind();
    document.body.ons(this.eventObj, '', {
      containerNode: this.containerNode
    });
    document.body.ons(this.containerEventObj, this.conSelector, {
      containerNode: this.containerNode
    });
    this.containerNode.on('afterAsynRender', function(){
      self.afterAsynRender();
    });
  }
});

Controller.extend = function(prototypeObj, Parent) {
  var Parent = Parent || Controller;
  var prototypeObj = prototypeObj || {};
  var Child = function(config) {
    Parent.apply(this, arguments);
  };
  var tmpObj = {}, i;
  for (i in prototypeObj) {
    tmpObj[i] = prototypeObj[i] && prototypeObj[i].enumerable ? prototypeObj[i]: {
      value: prototypeObj[i],
      writable: true,
      confiurable: true,
      enumerable: true
    };
  }
  tmpObj.parent = Parent.prototype;
  Child.prototype = Object.create(Parent.prototype, tmpObj);
  return Child;
};

Valley.prototype.fn = function(prototypeObj, Parent) {
  var Child = Controller.extend(prototypeObj, Parent || Controller);
  var config = {};
  var child = new Child(config);
  child.init();
    // child.parent = child.__proto__;
  return child;
};

global.Controller = Controller;

