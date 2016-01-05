;(function(){

window.Valley = {};
window.module = 'test';
window.global = window;

function loadJs(src, success, fail) {
  var script = document.createElement('script');
  script.src = src;
  script.onload = function() {
    success && success();
  };
  script.onerror = function() {
    fail && fail();
  };
  document.head.appendChild(script);
}

Valley.define = function(deps, callback) {
  return define(deps, callback);
};

Valley.testList = [];

Valley.test = function(callback) {
  this.testList.push(callback);
};

loadJs('../third/require/require.js', function(){
  Valley.testList.forEach(function(fun, index){
    fun();
  });
});

}());