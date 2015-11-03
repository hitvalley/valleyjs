define([
  'config/default-config',
  'lib/common-events'
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

function showPage() {
  $(window).trigger('renderPage');
}

function main(inputConfig) {
  $.VConfig = config = $.extend(defaultConfig, inputConfig || {});
  loadTpls();
  showPage();
}

return main;

});
