define([], function(){

$.initScript = function(id, tpl, callback) {
  //var id = 'id-' + id + '-tpl';
  if ($('#' + id).length) {
    return true;
  }
  var $script = $('<script></script>');
  $script.attr({
    type: 'text/html',
    id: id
  });
  $script.text(tpl);
  $script.load(callback || function(){});
  $(document.body).append($script);
  return $script;
};

$.initScriptByUrl = function(id, url, callback) {
  if ($('#' + id).length) {
    callback && callback();
    return;
  }
  $.get(url).then(function(data){
    $.initScript(id, data);
    callback && callback();
  });
};

$.initView = function(name, url, callback) {
  $.initScriptByUrl('id-' + name + '-view', url, callback);
};

});
