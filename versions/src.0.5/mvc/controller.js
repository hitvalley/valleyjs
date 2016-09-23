function Controller() {
  this.construct && this.construct();
}

function setConfig(item) {
  if (Valley.isString(item)) {
    return {
      url: item,
      params: {}
    };
  } else if ((Valley.isPlainObject(item) && item.url)
      || Valley.isFunction(item)) {
    return item;
  }
  return false;
}

Valley.extend(Controller.prototype, {

  data: {},
  el: null,
  tpl: null,
  request: null,

  requires: [],

  id: null,

  // for event
  commonEventObj: {},
  elEventObj: {},

  construct: function() {
    // var tmp = this.data || {};
    // this.tpl = tmp.tpl || this.tpl;
    // this.el = this.prepareEl(tmp.el || this.el || document.body);
  },

  init: function() {
    var tmp = this.data || {};
    // this.pageId = this.pageId || tmp.pageId || this.defaultId || Valley.route().path;
    this.tpl = this.tpl || tmp.tpl;
    this.el = this.prepareEl(tmp.el || document.body);
    this.data = Valley.extend({}, this.data || {}, {
      tpl: this.tpl,
      element: this.el
    });
    this._bind();
  },
  prepareEl: function(el) {
    return Valley.isString(el) ? document.querySelector(el) : (el || document.body);
  },

  _bind: function() {
    var self = this;
    this.bind && this.bind();
    var data = {
      el: this.el,
      con: this
    };
    document.body.ons(this.eventObj, '', data);
  },
  requestData: function(url, params) {
    return Valley.get(url, params || {});
  },

  prepareRender: null,
  prepareData: function() {
    var promise;
    var req = this.request;
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
  prepareTpl: function() {
    return Valley.initTplObj(this.tpl);
  },
  renderData: function(dataObj, tpl, el) {
    var dataObj = dataObj || {};
    var scope = Valley.extend(Valley.dataObj, this.data);
    var html = Valley.tpl(tpl, dataObj, scope);
    el.innerHTML = html;
    return dataObj;
  },

  render: function() {
    var con = this;
    var dataJob = this.prepareData();
    var tplJob = this.prepareTpl();
    var elJob = this.prepareEl();
    var promise;
    if (this.prepareRender) {
      promise = this.prepare().then(function(){
        return Promise.all([dataJob, tplJob, elJob]);
      });
    } else {
      promise = Promise.all([dataJob, tplJob, elJob]);
    }
    return promise.then(function(args){
      var dataObj = args[0];
      var tplId = con.tpl;
      var el = args[2];
      return con.renderData(dataObj, tplId, el);
    }).then(function(data){
      con.afterRender && con.afterRender(data)
    }, function(reason){
      con.renderFailPage && con.renderFailPage(reason) || function(){
        throw(reason)
      }();
    });
  },

  // renderData: function() {
  // },
  // afterRender: function() {
  // },
  // renderFailPage: function() {
  // },

  run: function() {
    var data = {
      el: this.el,
      con: this
    };
    this.el.ons(this.elEventObj, '', data);
    return this.render();
  }

});

Controller.declare = function(prototypeObj, Parent) {
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

// window.Controller = Controller;

