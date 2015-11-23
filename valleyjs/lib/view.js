define([], function(){

function getView(id, url) {
  var deferred = $.Deferred();
  var $script = $('#' + id);
  if ($script.length) {
    deferred.resolve($script.html());
  } else {
    $script = $('<script></script>');
    $script.prop({
      type: 'text/html',
      id: id
    });
    $.vget(url).done(function(tpl){
      $script.text(tpl);
      $(document.body).append($script);
      deferred.resolve(tpl);
    });
  }
  return deferred.promise();
}

function getPageView(pageId) {
  var id = 'id-' + pageId + '-view';
  var url = $.VConfig.viewPath + '/' + pageId + '.html';
  return getView(id, url);
}

return {
  getView: getView,
  getPageView: getPageView
};

});
