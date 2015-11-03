define([], function(){

$.fn.delegates = function(configs, psel) {
  var $root = $(this[0]);
  var name, value, obj;
  var psel = psel ? (psel + ' ') : '';
  var event;
  for (name in configs) {
    value = configs[name];
    if (typeof value === 'function') {
      obj = {
        click: value
      };
    } else {
      obj = value;
    }
    for (event in obj) {
      $root.on(event, psel + name, obj[event]);
    }
  }
};

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
