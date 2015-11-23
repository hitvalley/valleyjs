define([
  'valleyjs/config/default-config',
  //'valleyjs/jquerylib/include',
  'valleyjs/lib/common-events'
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
