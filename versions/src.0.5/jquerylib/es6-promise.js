window.Promise || (function(){

function isPromise(promise) {
  return typeof promise === 'object'
        && typeof promise.then === 'function';
}

var Promise = function(callback) {
  var deferred = $.Deferred();
  function resolve(data) {
    deferred.resolve(data);
  }
  function reject(reason) {
    deferred.reject(reason);
  }
  try {
    callback(resolve, reject);
  } catch(e) {
    reject(e);
  }
  return deferred.promise();
};

function runAsPromise(promise, success, fail) {
  if (isPromise(promise)) {
    promise.then(function(data){
      success(data);
    }, function(reason){
      fail(reason);
    });
  } else {
    success(promise);
  }
}

Promise.all = function(arr) {
  var promiseList = Array.prototype.slice.call(arr);
  var len = promiseList.length;
  if (len === 0) {
    return Promise.resolve([]);
  }
  return new Promise(function(resolve, reject){
    var inputs = [];
    promiseList.forEach(function(promise, index){
      runAsPromise(promise, function(data){
        inputs[index] = data;
        len --;
        if (len <= 0) {
          resolve(inputs);
        }
      }, function(reason){
        reject(reason);
      });
    });
  });
};

Promise.race = function(arr) {
  var promiseList = Array.prototype.slice.call(arr);
  if (len === 0) {
    return Promise.resolve([]);
  }
  return new Promise(function(resolve, reject){
    promiseList.forEach(function(promise, index){
      runAsPromise(promise, function(data){
        resolve(data);
      }, function(reason){
        reject(reason);
      });
    });
  })
};

Promise.resolve = function(data) {
  return new Promise(function(resolve){
    resolve(data);
  });
};

Promise.reject = function(reason) {
  return new Promise(function(resolve, reject){
    reject(reason);
  });
}

window.Promise = Promise;

}());

