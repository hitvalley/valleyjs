Valley.getViewData = function(config, defaultName, cacheObj) {
  var Valley = this;
  var i,
      item,
      params,
      promise,
      tmp = {};
      type = typeof config,
      names = [],
      jobs = [];
  if (type === 'string' || type === 'function' || config.url) {
    tmp[defaultName] = config;
    config = tmp;
  }
  for (i in config) {
    item = config[i];
    if (typeof item === 'string') {
      // params = Valley.extend(true, Valley.route().params, {});
      promise = Valley.getDataWithCache(item, {}, cacheObj);
    } else if (typeof item === 'function') {
      promise = item();
    } else if (Valley.isPlainObject(item)) {
      // params = Valley.extend(true, Valley.route().params, params);
      promise = Valley.getDataWithCache(item.url, item.params, cacheObj);
    } else {
      throw "item must be string or function";
    }
    names.push(i);
    jobs.push(promise);
  }
  return (function(names){
    return Promise.all(jobs).then(function(args){
      var dataObj = {};
      args.forEach(function(data, index){
        dataObj[names[index]] = data;
        // prototypeObj.__data[names[index]] = data;
      });
      return dataObj;
    })
  }(names));
};

Valley.getMainData = function(mainConfig, prototypeObj) {
  var type = typeof mainConfig;
  return getData(type === 'string' || type === 'function' ? {
    '__mainData': mainConfig
  } : mainConfig, prototypeObj);
};

Valley.getAsynData = function(asynConfig, prototypeObj) {
  var type = typeof asynConfig;
  getData(type === 'string' || type === 'function' ? {
    '__asynData': asynConfig
  } : asynConfig, prototypeObj);
};

