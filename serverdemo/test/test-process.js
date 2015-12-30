require('../server/valley');
require('../valleyjs/lib/process');

var mark = 0;

function f1() {
  console.log('f1.start', new Date(), arguments);
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      console.log('f1.end', new Date());
      resolve('f1' + (++mark));
    }, 2000);
  });
}

function f2() {
  console.log('f2', new Date(), arguments);
  return ('f2' + (++mark));
}

function f3() {
  console.log('f3.start', new Date(), arguments);
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      console.log('f3.end', new Date());
      resolve('f3' + (++mark));
    }, 500);
  });
}

function f4() {
  console.log('f4.start', new Date(), arguments);
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      console.log('f4.end', new Date());
      resolve('f4' + (++mark));
    }, 1000);
  })
}

var funcList = [
  [f1, f2, f3],
  f4
];

function queue(list) {
  var promise = Promise.resolve(1);
  list.forEach(function(func, index){
    promise = promise.then(function(){
      return func();
    });
  });
  return promise;
}

function parallel(list) {
  var resArr = [];
  list.forEach(function(func, index){
    var res = func();
    resArr.push(res);
  });
  return Promise.all(resArr);
}

function process(list) {
  var promise = Promise.resolve(1);
  list.forEach(function(func, index){
    promise = promise.then(function(){
      if (typeof func === 'function') {
        func = [func];
      }
      return parallel(func);
    });
  });
  return promise;
}

// parallel([f1, f2, f3]).then(function(data){
//   console.log('finished', new Date());
// });

// queue([f1, f2, f3]).then(function(data){
//   console.log('finished', new Date());
// });

// process(funcList).then(function(data){
//   console.log('finished', new Date());
// });
// var funcs = [];
// funcs.push(f1());
// funcs.push(f2());
// funcs.push(f3());
// Promise.all(funcs).then(function(data){
//   console.log(data);
// });

// Valley.process([f1, f2, f3], mark).then(function(data){
//   console.log('finish');
//   console.log(data, new Date());
// });

// Promise.all([f1(), f2(), f3()]).then(function(data){
//   console.log(data);
// });
// console.log('begin Promise.all');
// Promise.all(tmpFuncs).then(function(data){
//   console.log(data);
// });

Valley.process(funcList, 'test').then(function(data){
  console.log(data, new Date());
});