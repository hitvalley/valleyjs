define([], function(){

/**
 * list -> [
 *    item: function() {}
 * ]
 */
function queue(list, callback) {
  var func, res;

  function runItem(){
    if (!list.length) {
      callback && callback();
      return false;
    }
    func = list.shift();
    res = func();
    if ($.type(res) === 'object' && $.type(res.always) === 'function') {
      res.always(function(){
        runItem();
      });
    } else {
      runItem();
    }
  }
  runItem();
}

return queue;

});
