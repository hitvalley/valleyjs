;(function(){

function loadJs(src, callback) {
  var script = document.createElement('script');
  script.src = src;
  script.onload = function() {
    callback();
  };
  document.head.appendChild(script);
}

function loadCss(src) {
  var link = document.createElement('link');
  link.href = src;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

function loadTags(list, callback) {
  var mark = list.length;
  list.forEach(function(n, i){
    if (n.match(/\.css$/)) {
      loadCss(n);
      mark --;
    } else {
      loadJs(n, function(){
        mark --;
        if (mark <= 0) {
          callback && callback();
        }
      });
    }
  });
}

var Valley = {};
var containerNode;
window.module = 'ValleyJS on Browser';
window.global = window;

Valley._config = {
  root: '..',
};

Valley.define = function(deps, callback) {
  return define(deps, callback);
};

Valley.run = function() {
  require.config({
    baseUrl: '../',
  });
  require([
    'valleyjs/valley',
    'client/path'
  ], function(){
    containerNode = document.getElementById('id-container');
    Valley.init({
      root: ''
    });
    var rInfo = Valley.route();
    Valley.showPage(rInfo.path, rInfo.params);
  });
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

loadJs('../client/third/require/require.min.js', function(){
  Valley.run();
});

}());