define([], function(){

function queue(list, callback) {
  var func = list.shift();
  var res;
  function runItem() {
    res = func();
    if (list.length) {
      func = list.shift();
      if ($.type(res) === 'object' && 'then' in res) {
        res.always(function(){
          runItem();
        });
      } else {
        runItem();
      }
    } else {
      callback && callback();
    }
  };
  runItem();
}

return queue;

});
