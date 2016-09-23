Valley.define = function(deps, callback, module) {
  var define = require('amdefine')(module);
  var realDeps = [];
  deps.forEach(function(n, i){
    var name = n.endsWith('.js') ? n : (n + '.js');
    var path = name.startsWith('.') ? name : (Valley._config.root + '/' + name);
    realDeps.push(path);
  });
  return define(realDeps, callback);
};