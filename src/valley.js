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
    if (n.endsWith('.css')) {
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

Valley.run = function(config){
  var config = config || {};
  var baseUrl = config.baseUrl || '';
  var basicPlugins = [
    baseUrl + '/valleyjs/third/jquery/jquery-2.1.0.min.js',
    baseUrl + '/valleyjs/third/require/require.js'
  ];
  var thirdLib = config.thirdLib || 'jquery';
  loadTags(basicPlugins, function(){
    loadTags(config.plugins || []);
    require.config({
      baseUrl: baseUrl
    });
    require([
      'valleyjs/main',
      'valleyjs/' + thirdLib + 'lib/include'
    ], function(main){
      main(config);
    });
  });
};

Valley.showPage = function(){
  $(window).trigger('renderPage');
};

window.Valley = Valley;

}());
