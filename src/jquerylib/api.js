function getUrl(path) {
  if (path.match(/^http/)) {
    return path;
  }
  return Valley._config.apiHost + path;
}

Valley.ajax = function(path, method, data, setting) {
  var method = method || 'GET';
  var url = getUrl(path);
  var options = $.extend(true, setting, {
    method: method || 'GET',
    data: data || {},
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    }
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

