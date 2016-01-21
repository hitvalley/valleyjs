(function(){

var containerNode;

Valley.showPage = function(path, params) {
  var path = path || this._config.urlRules[path] || '';
  // var containerNode = this.containerNode;
  require([
    Valley._config.conPath + path + '.js'
  ], function(con){
    con.reqUrl = (location.hash || '#').substr(1);
    var data = con.render().then(function(html){
      containerNode.className = 'vbody-' + con.pageId;
      containerNode.innerHTML = html;
      con.afterRender();
    });
  });
};

Valley.route = function(url) {
  var url = url || (location.hash || '#').substr(1);
  return this.parseURL(url);
};

Valley.prepares = function() {
  require.config({
    baseUrl: Valley._config.root
  });
};

Valley.run = function() {
  containerNode = this._config.client.containerNode || document.body;
  require([
    'valleyjs/vlib'
  ], function(){
    var urlInfo = Valley.route();
    Valley.showPage(urlInfo.path, urlInfo.params);
  });
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
  var info = this.hashInfo();
  var path = path || info.path;
  var params = params || info.params;
  if (typeof path === 'object') {
    params = path;
    path = info.path;
  }
  var newParams = this.extend(info.params, params);
  $.setHash(path, newParams);
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
    }, 100);
  };
}

bindChangeEvent();

}());