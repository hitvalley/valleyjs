define([
  'valleyjs/lib/controller'
], function(Controller) {

var demoCon = Controller.init({
  pageId: 'demo',
}, {
  beforeRequest: function() {
    var self = this;
    this.data = {
      title: 'demo'
    };
  },
  renderPage: function(){
    return this.renderByUrl('demo-obj.html');
  },
  afterRender: function() {
    console.log('afterRender');
    console.log(this.data);
  }
}, {
  'ul li p': function() {
    alert($(this).text());
  }
});

return demoCon;

});
