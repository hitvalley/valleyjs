define([
], function(){

$.error = function() {
  $('#' + $.VConfig.container).html('<h1>错误页面</h1>');
};

});
