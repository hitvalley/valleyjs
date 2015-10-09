(function(){

$.configUrl = function(url) {
    if (url.match(/^http(?:s)?:\/\//)) {
        return url;
    } else {
        return $.VConfig.apiHost + url;
    }
};

$.vget = function(url, params) {
    jQuery.support.cors = true;
    var url = $.configUrl(url || '');
    return $.ajax({
        'url': url,
        'data': params || {},
        'xhrFields': {
            'withCredentials': true
        },
        'crossDomain': true
    });
};

$.vpost = function(url, params) {
    jQuery.support.cors = true;
    var url = $.configUrl(url || '');
    return $.ajax({
        'url': url,
        'data': params || {},
        'type': 'POST',
        'xhrFields': {
            'withCredentials': true
        },
        'crossDomain': true
    });
};

function vajax(url, method, params, success, fail) {
  if ($.DebugObj && $.DebugObj[url]) {
    var data = $.DebugObj[url];
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    success(data);
    return;
  }
  var params = params || {};
  var url = $.configUrl(url || '');
  var async = params.async;//获得布尔值
  if (async === undefined) {
    async = true;
  }
  $.ajaxSetup({
    async: async
  });
  $.ajax({
    url: url,
    method: method || 'GET',
    data: params,
  }).then(function(data){
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    success && success(data);
  }).fail(function(data){
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    fail && fail(data);
  });
}

$.getInfo = function(url, params, success, fail) {
  vajax(url, 'GET', params, success, fail);
};

$.postInfo = function(url, params, success, fail) {
  vajax(url, 'POST', params, success, fail);
};

/**
 * requests: [{
 *   api: api
 *   method: method
 *   params: params
 * }]
 */
$.mutiRequest = function(requests, callback) {
  if (!requests || !requests.length) {
    return false;
  }
  var mark = requests.length;
  var inputs = [];
  requests.forEach(function(n, i){
    vajax(n.api, n.method, n.params, function(data){
      inputs[i] = data;
      mark --;
      if (mark <= 0) {
        callback && callback(inputs);
      }
    });
  });
};

}());
