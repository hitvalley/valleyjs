define([], function() {

$.isPromiseRes = function (res) {
  return $.type(res) === 'object'
      && $.type(res.always) === 'function';
}

$.runAsPromise = function (func, obj, args){
  var deferred = $.Deferred();
  var func = func || function(){};
  var args = args || [];
  res = func.apply(obj, args);
  if ($.isPromiseRes(res)) {
    res.always(function(data){
      deferred.resolve(data);
    });
  } else {
    deferred.resolve(res);
  }
  return deferred.promise();
}

$.queue = function(list, obj, inputs){
  var list = list || [];
  var inputs = inputs || [];
  var args = [];
  var mainDeferred = $.Deferred();
  var promise = $.runAsPromise();
  list.forEach(function(func, index){
    promise.always(function(data){
      promise = $.runAsPromise(func, obj, [data, inputs[index]]);
      if (index > 0) {
        args.push(data);
      }
      if (index === list.length - 1) {
        promise.always(function(data){
          args.push(data);
          mainDeferred.resolve(args);
        });
      }
    });
  });
  return mainDeferred.promise();
};

$.parallel = function(list, obj, inputs) {
  var list = list || [];
  var mark = list.length;
  var args = [];
  var deferred = $.Deferred();
  list.forEach(function(func, index){
    $.runAsPromise(func, obj, inputs[index]).always(function(data){
      mark --;
      args[index] = data;
      if (mark < 0) {
        deferred.resolve(args);
      }
    });
  });
  return deferred.promise();
};

});
