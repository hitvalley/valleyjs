global.tpl = function(template, data, scope, isForAsyn) {
  var scope = scope || global;
  // var funcStr = tplToFuncStr(template, isForAsyn);
  // var html = runTplAsFunction(funcStr, data, scope);
  Valley.debug && (console.log('tpl.data', data));
  var html = runFunction(template, data, scope, isForAsyn);
  return html;
};

