var Controller = Class.declare({
  el: null,
  data: {},
  request: null,
  tpl: null,

  elEventObj: {},
  documentEventObj: null,

  // _once: function() {
  //   if (this._mark) {
  //     return;
  //   }
  //   this._mark = 'VALLEY_' + Date.now() + '_' + Math.random();
  //   var con = this;
  //   con.prepareEl().then(function(element){
  //     con.documentEventObj && document.body.ons(con.documentEventObj, '', {
  //       el: element,
  //       con: con
  //     });
  //   });
  //   con.once && con.once();
  // },
  success: function(callback) {
    callback && callback();
  },
  init: function(data, events) {
    var con = this;
    this.data = Valley.extend({}, this.data || {}, data);
    this.data.tpl = this.data.tpl || this.tpl || this.id;
    this.data.el = this.data.el || this.el;
    events && (this.elEventObj = Valley.extend({}, this.elEventObj, events));
    this._unbind().then(function(){
      con._bind();
    });
  },
  requestData: function(url, data) {
    return Valley.get(url, data);
  },

  renderData: function(request, tpl, el, isAppend) {
    var con = this;
    var dataJob = this.prepareData(request);
    var tplJob = this.prepareTpl(tpl);
    var elJob = this.prepareEl(el);
    return Promise.all([dataJob, tplJob, elJob]).then(function(args){
      var data = args[0] || {};
      var tpl = args[1];
      var el = args[2];
      var html = con.renderHtml(tpl, data);
      var node;
      if (isAppend) {
        // con.data.node = Valley.htmlToNode(html);
        con.data.node = Valley.appendHtml(html, el);
      } else {
        el.innerHTML = html;
        con.data.node = el;
      }
      return data;
    }).then(function(data){
      con.afterRender && con.afterRender(data);
    }, function(reason){
      con.renderFailPage && con.renderFailPage(reason) || function(){
        throw(reason)
      }();
    }).then(function(data){
      con.success(data);
    });
  },
  renderHtml: function(tpl, data) {
    var scope = Valley.extend(Valley.dataObj, this.data);
    return Valley.tpl(tpl, data, scope);
  },
  render: function(request, tpl, el, isAppend) {
    return this.renderData(request, tpl, el, isAppend);
  },

  prepareEl: function(el) {
    var el = el || this.data.el || this.parent.data.el || Valley.dataObj.el;
    var container = this.data.container || document.body;
    var element = Valley.isString(el) ? container.querySelector(el) : (el || document.body);
    this.data.el = el;
    this.data.element = element;
    return Promise.resolve(element);
  },
  prepareTpl: function(tpl) {
    var tpl = tpl || this.data.tpl;
    return tpl && Valley.initTplObj(tpl).then(function(res){
      return res;
    }) || Promise.resolve('');
  },
  prepareData: function(data) {
    var promise;
    var req = data || this.request;
    if (!req) {
      return Promise.resolve({});
    }
    if (Valley.isFunction(req)) {
      req = req.call(this);
    }
    if (Valley.isString(req)) {
      promise = this.requestData(req);
    } else if (Valley.isPlainObject(req) && req.url && req.params && Valley.isPlainObject(req.params)) {
      promise = this.requestData(req.url, req.params);
    } else {
      promise = Promise.resolve(req);
    }
    return promise;
  },

  _unbind: function() {
    var con = this;
    return this.prepareEl().then(function(element){
      var data = {
        el: con.data.element,
        con: con
      };
      element && element.offs(con.elEventObj);
      con.unbind && con.unbind();
      return element;
    });
  },

  _bind: function() {
    var con = this;
    this.prepareEl().then(function(element){
      var data = {
        el: con.data.element,
        con: con
      };
      element && element.ons(con.elEventObj, '', data);
      con.bind && con.bind();
    });
  }
});

Controller.declare = function(initFunc, prototypeObj, Parent) {
  if (Valley.isPlainObject(initFunc)) {
    Parent = prototypeObj;
    prototypeObj = initFunc;
    initFunc = null;
  }
  return Class.declare(initFunc, prototypeObj, Parent || Controller);
};
