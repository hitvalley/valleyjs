define([
  '../lib/queue',
  '../third/underscore/underscore'
], function(queue) {

function printLog(str) {
  console.log(str, new Date());
};

var pConf = [
{
  name: 'beforeRender',
  zIndex: 9
}, {
  name: 'render',
  zIndex: 10
}, {
  name: 'renderPagination',
  zIndex: 10
}, {
  name: 'beforeRequest',
  zIndex: 1
}, {
  name: 'afterRequest',
  zIndex: 2
}, {
  name: 'afterRender',
  zIndex: 15
}
];

var obj = {
  i: 1,
  beforeRequest: function() {
    console.log(this.i);
    printLog('beforeRequest');
  },
  afterRequest: function() {
    printLog('afterRequest');
  },
  beforeRender: function(){
    printLog('beforeRender');
  },
  render: function(){
    var deferred = $.Deferred();
    window.setTimeout(function(){
      printLog('render');
      deferred.resolve('render');
    }, 1000);
    return deferred;
  },
  renderPagination: function(){
    printLog('renderPagination');
  },
  afterRender: function(){
    printLog('beforeRender');
  }
};

function getList() {
  var list = _.sortBy(pConf, 'zIndex');
  var funs = {};
  list.forEach(function(n, i){
    //funcList.push(n.zIndex);
    var zIndex = n.zIndex || 0;
    if (funs[zIndex]) {
      funs[zIndex].push(n.name);
    } else {
      funs[zIndex] = [n.name];
    }
  });
  console.log(funs);
  return funs;
}

function multiCall(list, obj){
  var mark = list.length;
  var deferred = $.Deferred();
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

function process() {
  var list = getList();
  console.log(list);
  var funs = [];
  var tmp;
  for (var i in list) {
    tmp = [];
    list[i].forEach(function(fname, index){
      var fun = obj[fname].bind(obj);
      tmp.push(fun);
    });
    funs.push(multiCall.bind(null, tmp));
  }
  queue(funs);
}

return process;

});
