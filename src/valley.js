;(function(){

function loadJs(src, callback) {
  var script = document.createElement('script');
  script.src = src;
  script.onload = function() {
    callback();
  };
  document.head.appendChild(script);
}

function loadScripts(list, callback) {
  var mark = list.length;
  list.forEach(function(n, i){
    loadJs(n, function(){
      mark --;
      if (mark <= 0) {
        callback();
      }
    });
  });
}

window.Valley = {};

Valley.run = function(config){
  var config = config || {};
  var baseUrl = config.baseUrl || '';
  loadScripts([
    baseUrl + '/valleyjs/third/jquery/jquery-2.1.0.min.js',
    baseUrl + '/valleyjs/third/require/require.js'
  ], function(){
    require.config({
      baseUrl: baseUrl
    });
    require([
      'valleyjs/main'
    ], function(main){
      main(config);
    });
  });
};

}());
