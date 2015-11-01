define([
  'lib/controller'
], function(Controller) {

var testCon = Controller.init({
  pageId: 'test',
}, {
  beforeRequest: function() {
    console.log('beforeRequest');
    this.data = {
      title: 'test'
    };
  },
  renderPage: function() {
    var self = this;
    console.log('renderPage');
    return $.get('test-obj.html').then(function(data){
      self.data.info = data;
      console.log(data);
    });
  },
  afterRender: function() {
    console.log('afterRender');
    console.log(this.data);
  }
});

return testCon;

});
