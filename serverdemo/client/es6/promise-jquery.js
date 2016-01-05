Valley.define([
  '../third/jquery/jquery-1.8.3'
], function($){

function isPromise(promise) {
  return typeof promise === 'object'
        && typeof promise.then === 'function';
}

var Promise = function(callback) {
  var promise = this;
  promise._deferred = $.Deferred();
  function resolve(data) {
    if (isPromise(data)) {
      data.then(function(data){
        resolve(data);
      });
    } else {
      promise._deferred.resolve(data);
    }
  }
  function reject(reason) {
    if (isPromise(data)) {
      reason.catch(function(reason){
        reject(reason);
      });
    } else {
      promise._deferred.reject(reason);
    }
  }
  try {
    callback(resolve, reject);
  } catch(e) {
    reject(e);
  }
  // return promise;
};

Promise.prototype.then = function(success, fail) {
  var promise = this;
  var success = success || function(){};
  var fail = fail || function(){};
  return new Promise(function(resolve, reject){
    promise._deferred.then(function(data){
      try {
        var res = success(data);
        resolve(res);
      } catch(e) {
        reject(e);
      }
    }, function(reason){
      try {
        var res = fail(reason);
        resolve(res);
      } catch(e) {
        reject(e);
      }
    });
  });
};

Promise.prototype.catch = function(fail) {
  var promise = this;
  return new Promise(function(resolve, reject){
    promise._deferred.then(function(data){
      resolve(data);
    }, function(reason){
      fail(reason);
    });
  });
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

});