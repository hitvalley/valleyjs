define([
  './controller',
  './utils'
], function(Controller){

function run() {
  var urlInfo = $.hashInfo();
  var path = urlInfo.path;
  Controller.run(path);
};

function bindChangeEvent() {
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
bindChangeEvent();

$(window).on('renderPage', function(){
  run();
});

});
