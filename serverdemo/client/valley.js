;(function(){

function loadJs(src, success, fail) {
  var script = document.createElement('script');
  script.src = src;
  script.onload = function() {
    success && success();
  };
  script.onerror = function() {
    fail && fail();
  };
  if (document.body) {
    document.body.appendChild(script);
  } else {
    window.onload = function() {
      document.body.appendChild(script);
    };
  }
}

function bindChangeEvent() {
  var mark = null;
  window.onhashchange = function(){
    if (mark) {
      window.clearTimeout(mark);
      mark = null;
    }
    mark = window.setTimeout(function(){
      var rInfo = Valley.route();
      Valley.showPage(rInfo.path, rInfo.params);
    }, 100);
  };
}

function clientRun(config) {
  require.config({
    baseUrl: Valley._config.root
  });
  var basicDeps = [
    'valleyjs/valley',
    'client/es6/es6',
    'client/path',
    'client/api',
    'client/jquerylib/lib'
  ];
  var deps = basicDeps.concat(basicDeps, config.client.plugins || []);
  require(deps, function(){
    containerNode = document.getElementById('id-container');
    Valley.init(config);
    var rInfo = Valley.route();
    Valley.showPage(rInfo.path, rInfo.params);
  });
  bindChangeEvent();
};

window.onerror = function(errMsg, jsFile, line, num, err) {
  // 处理没有controller的页面
  var rInfo = Valley.route();
  var pageId = rInfo.path || 'default';
  require([
    'valleyjs/mvc/controller'
  ], function(Controller){
    var con = Controller.init({
      pageId: pageId
    });
    con.render().then(function(html){
      con.containerNode = containerNode;
      containerNode.innerHTML = html;
    });
  });
};

window.global = window;
global.Valley = {};
global.module = 'ValleyJsOnBrowser';
var containerNode;

Valley._config = {
  root: '/'
};

Valley.define = function(deps, callback) {
  return define(deps, callback);
};

Valley.run = function(config) {
  this._config.root = config.client.root || '/';
  loadJs('../client/third/require/require.js', function(){
    clientRun(config);
  });
};

Valley.showPage = function(path, params){
  var path = path || this._config.urlRules[path] || '';
  require([
    'web/controllers/' + path
  ], function(con){
    con.reqUrl = (location.hash || '#').substr(1);
    var data = con.render().then(function(html){
      containerNode.className = 'vbody-' + con.pageId;
      containerNode.innerHTML = html;
      con.afterRender();
    });
  });
};

Valley.route = function(rUrl) {
  return this.hashInfo(rUrl);
};

}());
