function getUrl(path) {
  if (path.match(/^http/)) {
    return path;
  }
  if (Valley._config.withConfigHost) {
    return Valley._config.apiHost + path;
  }
  return path;
}

Valley.ajax = function(path, method, data, setting) {
  var method = method || 'GET';
  var url = getUrl(path);
  var options = $.extend(true, setting, {
    method: method || 'GET',
    data: data || {}
  });
  return new Promise(function(resolve, reject){
    $.ajax(url, options).then(function(data){
      // Valley.translateData && (data = Valley.translateData(data));
      resolve(data);
    }, function(reason){
      reject(reason);
    });
  });
};

