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
  document.head.appendChild(script);
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
      containerNode.innerHTML = html;
    });
  });
};

var Valley = {};
var containerNode;
window.module = 'ValleyJsOnBrowser';
window.global = window;

Valley._config = {
  root: '..',
};

Valley.define = function(deps, callback) {
  return define(deps, callback);
};

Valley.run = function() {
  require.config({
    baseUrl: Valley._config.root,
  });
  require([
    'valleyjs/valley',
    'client/path',
    'client/api'
  ], function(){
    containerNode = document.getElementById('id-container');
    Valley.init({
      root: '..'
    });
    var rInfo = Valley.route();
    Valley.showPage(rInfo.path, rInfo.params);
  });
  bindChangeEvent();
};

Valley.route = function() {
  return this.hashInfo();
};

Valley.showPage = function(path, params){
  require([
    'web/controllers/' + path
  ], function(con){
    con.reqUrl = (location.hash || '#').substr(1);
    var data = con.render().then(function(html){
      containerNode.innerHTML = html;
      con.afterRender();
    });
  });
};

window.Valley = Valley;

loadJs('../client/third/require/require.js', function(){
  Valley.run();
});

}());