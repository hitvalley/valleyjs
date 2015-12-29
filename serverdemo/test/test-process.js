require('../server/valley');
require('../valleyjs/lib/process');

var mark = 0;

function f1() {
  var args = arguments;
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      console.log(1, args, new Date());
      resolve(++mark);
    }, 1000);
  });
}

function f2() {
  console.log(2, arguments, new Date());
  return ++mark;
}

function f3() {
  var args = arguments;
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      console.log(3, args, new Date());
      resolve(++mark);
    }, 500);
  });
}

Valley.process([f1, f2, f3], mark).then(function(data){
  console.log('finish');
  console.log(data, new Date());
});

Promise.all([f1, f2, f3]);