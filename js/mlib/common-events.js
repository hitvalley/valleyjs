define([
  'lib/utils',
  'mlib/url'
],function(){

$(document.body).delegates({
  '.load-page': function(){
    var href = $(this).data('href');
    var path = $(this).data('path');
    if (href) {
      location.hash = href;
      $(document.body).trigger('renderPage');
    } else if (path) {
      $.hashPath(path);
      $(document.body).trigger('renderPage');
    }
    return false;
  },
  '.load-group a': function() {
    var href = $(this).data('href');
    var path = $(this).data('path');
    if (href) {
      location.hash = href;
      $(document.body).trigger('renderPage');
    } else if (path) {
      $.hashPath(path);
      $(document.body).trigger('renderPage');
    }
  },
  '.pagination li a': function() {
    var page = +$.hashParams().page;
    var $link = $(this);
    if ($link.data('label')) {
      if ($link.data('label') === 'Previous') {
        page = Math.max(page - 1, 0);
      } else {
        page = Math.min(page + 1, $link.data('max') - 0);
      }
    } else {
      page = $link.data('page');
    }
    $.hashParams({
      page: page
    });
    $(document.body).trigger('renderPage');
  }
});

});
