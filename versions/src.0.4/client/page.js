Valley.showPage = function(path, params) {
  // var path = this._config.urlRules[path] || path || '';
  require([
    Valley._config.conPath + path + '.js'
  ], function(con){
    if (!con) {
      return ;
    }
    con.reqUrl = (location.hash || '#').substr(1);
    con.data.defaultPageId = path;
    var containerNode = con.containerNode || Valley._config.containerNode;
    var data = con.render().then(function(html){
      containerNode.className += ' vbody-' + con.pageId;
      if (html) {
        containerNode.innerHTML = html;
      }
      con.afterRender();
    });
  });
};

Valley.route = function(url) {
  var url = url || (location.hash || '#').substr(1);
  var obj = this.parseURL(url);
  obj.path = this._config.urlRules[obj.path] || obj.path;
  return obj;
};

Valley.run = function() {
  var urlInfo = Valley.route();
  Valley.showPage(urlInfo.path, urlInfo.params);
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

