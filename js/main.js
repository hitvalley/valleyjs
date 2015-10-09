define([
  'config/default-config',
  'mlib/mlib'
], function(defaultConfig){

var config = {};

function showPage() {
  var hinfo = $.hashInfo();
  var name = config.urlRules[hinfo.path] || hinfo.path;
  var rarr = config.preloads || [];
  rarr.unshift(config.conPath + name + '.js');
  require(rarr, function(controller){
    if (controller) {
      var vurl = config.viewPath + '/' + controller.tplId + '.html';
      $.initView(controller.tplId, vurl, function(){
        controller.render();
      });
    }
  });
};

function bind() {
  $(document.body).on('renderPage', function(){
    showPage();
  });
}

function loadTpls() {
  var tpls = config.tpls || {};
  var name, tpl;
  for (name in tpls) {
    tpl = tpls[name];
    $.initScriptByUrl('id-' + name + '-tpl', tpls[name]);
  }
}

var main = function(inputConfig) {
  $.VConfig = config = $.extend(defaultConfig, inputConfig || {});
  loadTpls();
  showPage();
  bind();
};

return main;

});
