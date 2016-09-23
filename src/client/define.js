Valley.define = function(deps, callback, name){
  if (name) {
    return define(name, deps, callback);
  } else {
    return define(deps, callback);
  }
};

Valley.require = function(deps, callback) {
  return require(deps, callback);
};

function insertJs(src) {
  var script = document.createElement('script');
  script.src = src;
  return new Promise(function(resolve, reject){
    script.onload = function(){
      resolve('js.success:' + src);
    };
    script.onerror = function(){
      reject('js.fail:' + src);
    };
    document.head.appendChild(script);
  })
}

function insertCss(src) {
  var link = document.createElement('link');
  link.href = src;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
  return Promise.resolve('src.success:' + src);
}

function insertTag(src) {
  var res = src.match(/\.(\w+)$/);
  if (res && res[1]) {
    switch(res[1]) {
    case 'css':
      return insertCss(src);
    case 'js':
    default:
      return insertJs(src);
    }
  }
  return insertJs(src + '.js');
}

Valley.initTags = function(list) {
  var list = list || [];
  var jobs = [];
  list.forEach(function(src){
    jobs.push(insertTag(src.toConf()));
  });
  return Promise.all(jobs);
};

