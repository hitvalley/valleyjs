define([], function(){

function setHref(href, isAppend) {
  var qIndex = href.indexOf('?');
  var path = href.substr(0, qIndex);
  var qstr = href.substr(qIndex + 1);
  var params = {};
  var r = /\$([\w_-]+)(?:=([^&=$]+))?/g
  var key, value, match;
  var hashInfo = $.hashInfo();
  while(match = r.exec(qstr)) {
    key = match[1];
    value = match[2];
    if (key) {
      params[key] = value || hashInfo.params[key];
    }
  }
  if (isAppend) {
    $.changeHash(path, params);
  } else {
    $.setHash(path, params);
  }
}

$(document.body).delegates({
  '.load-page': function() {
    var $link = $(this);
    var href = $link.data('href');
    if (href) {
      setHref(href, $link.data('append'));
    }
    return false;
  }
});

});
