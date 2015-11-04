define([
], function(){

$.configUrl = function(url) {
  if (url.match(/^http(?:s)?:\/\/|^(?:(?:\.){1,2})?\//)) {
    return url;
  } else {
    return $.VConfig.apiHost + url;
  }
};

function vajax(url, method, data, params) {
  var url = $.configUrl(url || '');
  var data = data || {};
  var params = $.extend({
    url: url,
    method: method || 'GET',
    data: data || {}
  }, params || {});
  return $.ajax(params);
}

$.vget = function(url, data, cross) {
  var params = {};
  if (cross) {
    jQuery.support.cors = true;
    params = {
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true
    };
  }
  return vajax(url, 'GET', data, params);
};

$.vpost = function(url, data, cross) {
  var params = {};
  if (cross) {
    jQuery.support.cors = true;
    params = {
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true
    };
  }
  return vajax(url, 'POST', data, params);
};

/**
 * requests: [{
 *   api: api
 *   method: method
 *   data: data
 * }]
 */
$.mutiRequest = function(requests, cross) {
  if (!requests || !requests.length) {
    return false;
  }
  var mark = requests.length;
  var inputs = [];
  var params;
  var deferred = $.Deferred();
  if (cross) {
    jQuery.support.cors = true;
    params = {
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true
    };
  }
  requests.forEach(function(n, i){
    vajax(n.api, n.method, n.data, params).done(function(res){
      inputs[i] = res;
      mark --;
      if (mark <= 0) {
        deferred.resolve(null, inputs);
      }
    }).fail(function(res){
      inputs[i] = res;
      deferred.reject(res, inputs);
    });
  });
  return deferred.promise();
};

});
