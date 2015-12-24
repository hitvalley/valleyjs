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
window.module = 'ValleyJS on Browser';

Valley._config = {
  basePath: "./",
  valleyJsPath: "../valleyjs/",
  basicPlugins: [],
  conPath: "controllers",
  viewPath: "viewPath"
};

Valley.define = function(deps, callback) {
  return define(deps, callback);
};

Valley.config = function(config) {
  this._config = Valley.extend(this._config, config);
};

Valley.route = function() {
  var hash = Valley.hashInfo();
  // console.log(hash);
  return hash;
};

Valley.run = function() {
  require.config({
    baseUrl: '../',
  });
  require([
    'valleyjs/valley-lib',
    'valleyjs/valley-events',
  ], function(){
    var rInfo = Valley.route();
    // console.log(rInfo);
    Valley.showPage(rInfo.path, rInfo.params);
  });
};

Valley.showPage = function(path, params){
  require([
    'web/controllers/' + path
  ], function(con){
    // con.params = params;
    var data = con.render();
    // console.log(data);
    document.getElementById('id-container').innerHTML = data;
  });
};

window.Valley = Valley;

loadJs('../client/third/require/require.min.js', function(){
  Valley.run();
});

}());