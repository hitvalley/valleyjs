Valley.define([
  './controller'
], function(Controller){

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

});