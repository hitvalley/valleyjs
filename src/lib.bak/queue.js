define([], function(){

/**
 * list -> [
 *    item: function() {}
 * ]
 */
function promiseQueue(list){
  var promise = Promise.resolve([]);
  list.forEach(function(func, index){
    promise = promise.then(function(){
      return new Promise(function(done, fail){
        return func(done, fail);
      });
    });
  });
  return promise;
}

function queue(list) {
  var args = [];
  function runItem(func){
    var deferred = $.Deferred();
    res = func && func();
    if ($.type(res) === 'object' && $.type(res.always) === 'function') {
      res.always(function(data){
        deferred.resolve(data);
      });
    } else {
      deferred.resolve(res);
    }
    return deferred.promise();
  }
  var mainDeferred = $.Deferred();
  var promise = runItem();
  list.forEach(function(func, index){
    promise.always(function(data){
      promise = runItem(func);
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
}

return queue;

});
