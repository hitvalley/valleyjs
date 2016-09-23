Valley.showPage = function(path, params) {
  var path = this._config.urlRules[path] || path || '';
  // var conPath = Valley._config.conPath + path + '.js';
  // var params = Valley.route().params;
  var page = Valley(path).init().render().then(function(con){
    var cname = ' vbody-' + con.id;
    con.prepareEl().then(function(element){
      var className = element.className;
      className = className.replace(/\s*vbody-\w+\s*/g, '');
      element.className = className + cname;
    })
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

Valley.analyzeHref = function(href, isNew) {
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
  if (!isNew) {
    params = Valley.extend(true, nowRoute.params, params);
  }
  var str = this.encodeURIJson(params);
  if (path) {
    return path + (str ? ('?' + str) : '');
  } else {
    return str;
  }
};

Valley.setUrl = function(url, byAnalyzed) {
  if (byAnalyzed) {
    url = this.analyzeHref(url);
  }
  location.hash = url;
}

Valley.setHash = function(path, params) {
  var str = this.encodeURIJson(params);
  if (path) {
    this.setUrl(path + (str ? ('?' + str) : ''));
  } else {
    this.setUrl(str);
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

