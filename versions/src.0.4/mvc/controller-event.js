Valley.onload(function(){
  document.body.ons({
    '.pagination li a': function() {
      var page = (Valley.route().params.page || 0) - 0;
      var label = this.getAttribute('data-label');
      var max = this.getAttribute('data-max');
      if (label) {
        if (label === 'Previous') {
          page = Math.max(page - 1, 0);
        } else {
          page = Math.min(page + 1, max - 0);
        }
      } else {
        page = this.getAttribute('data-page');
      }
      Valley.changeHash({
        page: page
      });
    },
    '.page-group .input-group .form-control': {
      keypress: function(e){
        var code = e.which || e.keyCode;
        if (code === 13) {
          this.parentNode.getElementsByClassName('fa-gavel')[0].trigger('click');
        }
      }
    },
    '.page-group .input-group .fa-gavel': function() {
      var page = this.parentNode.parentNode.getElementsByClassName('form-control')[0].value - 1;
      if (!isNaN(page)) {
        Valley.changeHash({
          page: page
        })
      }
    }
  });
});
