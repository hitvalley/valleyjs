Valley.define([], function(){

Valley.process = function(list, scope, data){
  var scope = scope || Valley;
  var promise = Promise.resolve(data || 1);
  list.forEach(function(func, index){
    promise = promise.then(function(data){
      return func.call(scope, data);
    });
  });
  return promise;
};

}, module);