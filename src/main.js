define([
  'valleyjs/config/default-config',
  'valleyjs/lib/common-events',
  'valleyjs/utils/utils'
], function(defaultConfig){

var config = {};

function loadTpls() {
  var tpls = config.tpls || {};
  var name, tpl;
  for (name in tpls) {
    tpl = tpls[name];
    $.initScriptByUrl('id-' + name + '-tpl', tpls[name]);
  }
}

Valley.showPage = function() {
  $(window).trigger('renderPage');
};

function main(inputConfig) {
  $.VConfig = config = $.extend(defaultConfig, inputConfig || {});
  var scripts = $.VConfig.scripts || {};
  var prepares = scripts.prepares;
  if (!prepares) {
    prepares = [];
  } else if ($.type(prepares) === 'string') {
    prepares = [prepares];
  }
  loadTpls();
  require(prepares, function(){
    Valley.showPage();
  });
}

return main;

});
