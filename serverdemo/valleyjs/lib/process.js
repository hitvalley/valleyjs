Valley.define([
  './type'
], function(){

Valley.queue = function(list, data, scope){
  var scope = scope || global;
  var promise = Promise.resolve(data || {});
  list.forEach(function(func, index){
    promise = promise.then(function(data){
      return func.call(scope, data, index);
    });
  });
  return promise;
};

Valley.parallel = function(list, data, scope){
  var scope = scope || global;
  var promise = Promise.resolve(data || {});
  var resArr = [];
  list.forEach(function(func, index){
    var res = func.call(scope, data, index);
    resArr.push(res);
  });
  return Promise.all(resArr);
}

Valley.process = function(list, data, scope){
  var self = this;
  var scope = scope || global;
  var promise = Promise.resolve(data || {});
  list.forEach(function(func, index){
    promise = promise.then(function(data){
      if (self.isFunction(func)) {
        func = [func];
      }
      return self.parallel(func, data, scope);
    });
  });
  return promise;
};

}, module);