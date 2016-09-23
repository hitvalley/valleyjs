Valley._processConfig = [
  'beforeRequest',
  'afterRequest',
  'beforeRender',
  'renderPage',
  'afterRenderPage'
];

Valley.setProcessConfig = function(configArr) {
  var arr = [];
  var item;
  configArr.forEach(function(config, index){
    var fname = config.name;
    var zIndex = config.zIndex;
    var item = arr[zIndex];
    if (Valley.isString(item)) {
      item = [item, fname];
    } else if (Valley.isArray(item)) {
      item.push(fname);
    } else {
      item = fname;
    }
    arr[zIndex] = item;
  });
  Valley._processConfig = arr.filter(function(item){
    return item;
  });
};

Valley.initConProcess = function(list, con) {
  var funcList = [];
  list.forEach(function(fname, index){
    var item;
    if (Valley.isArray(fname)) {
      item = [];
      fname.forEach(function(name, i){
        con[name] && item.push(con[name]);
      });
      // item.push(Controller.stop);
    } else {
      con[fname] && (item = con[fname]);
    }
    item && funcList.push(item);
  });
  return funcList;
};

