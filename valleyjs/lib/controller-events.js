define([
  './controller',
  './utils'
], function(Controller){

function run() {
  var urlInfo = $.hashInfo();
  var path = urlInfo.path;
  Controller.run(path);
};

if ($.VConfig && $.VConfig.autoRunController) {
  var mark = null;
  $(window).on('hashchange', function(){
    if (mark) {
      window.clearTimeout(mark);
      mark = null;
    }
    mark = window.setTimeout(function(){
      $(window).trigger('renderPage');
    }, 100);
  });
}

$(window).on('renderPage', function(){
  run();
});

});
