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

});
