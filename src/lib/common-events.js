define([
  './controller',
  './utils'
], function(Controller){

if ($.VConfig && $.VConfig.autoRunController) {
  $(window).on('hashchange', function(){
    var urlInfo = $.hashInfo();
    var path = urlInfo.path;
    //var params = urlInfo.params;
    Controller.run(path);
  });
}

});
