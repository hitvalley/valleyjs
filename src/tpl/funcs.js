global.tpl = function(template, data, scope, isForAsyn) {
  var scope = scope || global;
  Valley.debug && (console.log('tpl.data', data));
  var html = runFunction(template, data, scope, isForAsyn);
  return html;
};

