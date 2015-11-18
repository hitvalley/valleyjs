define([
  'valleyjs/third/underscore/underscore'
], function(){

var processConfig = null;
var funcNames = null;

function getProcessConfig(pConf, isAppend) {
  if (!processConfig) {
    processConfig = $.VConfig.processConfig;
  }
  if (pConf) {
    processConfig = isAppend ? $.extend(processConfig, pConf) : pConf;
  }
  return processConfig;
}

function getFnameList(pConf) {
  var list = _.sortBy(pConf, 'zIndex');
  var funs = {};
  list.forEach(function(n, i){
    var zIndex = n.zIndex || 0;
    if (funs[zIndex]) {
      funs[zIndex].push(n.name);
    } else {
      funs[zIndex] = [n.name];
    }
  });
  return funs;
}

function multiCall(list, callback){
  var mark = list.length;
  var deferred = $.Deferred();
  if (mark <= 0) {
    deferred.resolve('resolve');
  }
  function runCallback() {
    mark --;
    if (mark <= 0) {
      deferred.resolve('resolve');
      return true;
    }
    return false;
  }
  list.forEach(function(fun, index){
    var res = fun();
    if (res && res.always) {
      res.always(function(){
        runCallback();
      });
    } else {
      runCallback();
    }
  });
  return deferred.promise();
}

function process(con, pConf, isAppend){
  var proConfig = getProcessConfig(pConf, isAppend);
  var funsList = getFnameList(proConfig);
  var funs = [];
  var tmp;
  for (var i in funsList) {
    tmp = [];
    funsList[i].forEach(function(fname, index){
      if (con[fname]) {
        var fun = con[fname].bind(con);
        tmp.push(fun);
      }
    });
    funs.push(multiCall.bind(this, tmp));
  }
  //queue(funs);
  return funs;
}

return process;

});
