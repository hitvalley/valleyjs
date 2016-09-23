Valley.showPage = function(path, params) {
  var path = this._config.urlRules[path] || path || '';
  // var conPath = Valley._config.conPath + path + '.js';
  return Valley(path).run(function(){
    var cname = ' vbody-' + this.pageId;
    var className = this._el.className;
    className = className.replace(/\s*vbody-\w+\s*/g, '');
    this.el.className = className + cname;
  });
};

Valley.run = function() {
  var urlInfo = Valley.route();
  Valley.showPage(urlInfo.path, urlInfo.params);
};

Valley.route = function(url) {
  var url = url || (location.hash || '#').substr(1);
  var obj = this.parseURL(url);
  obj.path = this._config.urlRules[obj.path] || obj.path;
  return obj;
};

Valley.analyzeHref = function(href) {
  if (!href) {
    return href;
  }
  var route = Valley.route(href);
  var nowRoute = Valley.route();
  var path = route.path;
  var params = {};
  var i, item;
  for (i in route.params) {
    item = route.params[i];
    params[i] = typeof item === 'undefined' ? nowRoute.params[i] : item;
  }
  var str = this.encodeURIJson(params);
  if (path) {
    return path + (str ? ('?' + str) : '');
  } else {
    return str;
  }
};

Valley.setHash = function(path, params) {
  var str = this.encodeURIJson(params);
  if (path) {
    location.hash = path + (str ? ('?' + str) : '');
  } else {
    location.hash = str;
  }
};

Valley.changeHash = function(path, params) {
  var info = this.route();
  var path = path || info.path;
  var params = params || info.params;
  if (typeof path === 'object') {
    params = path;
    path = info.path;
  }
  var newParams = this.extend(info.params, params);
  this.setHash(path, newParams);
  return newParams;
};

function bindChangeEvent() {
  var mark = null;
  window.onhashchange = function(){
    if (mark) {
      window.clearTimeout(mark);
      mark = null;
    }
    mark = window.setTimeout(function(){
      Valley.run();
    }, 180);
  };
}

bindChangeEvent();

