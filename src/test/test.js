(function(){

Valley = {};

function isArray(input) {
  if (typeof input === 'object') {
    return Object.prototype.toString.call(input).toLowerCase() === '[object array]';
  }
  return false;
}

Valley.addFile = function(src, callback) {
  var id = encodeURIComponent(src);
  var script = document.getElementById(id);
  if (script) {
    callback && callback();
    return;
  }
  script = document.createElement('script');
  script.src = src.match(/\.js$/) ? src : (src + '.js');
  script.onload = function() {
    callback && callback();
  };
  document.body.appendChild(script);
  script.id = id;
};

Valley.test = function(funcName, args, notlog) {
  if (!isArray(args)) {
    args = [args];
  }
  var res = Valley[funcName].apply(Valley, args);
  notlog || console.log(funcName, args, typeof res === 'object' ? JSON.stringify(res) : res);
  return res;
};

Valley.checkValue = function(funcName, args, expect) {
  var res = this.test(funcName, args, 1);
  console.log(funcName, expect === res, args, res);
};

}());