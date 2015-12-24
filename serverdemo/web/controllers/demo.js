Valley.define([
  'valleyjs/mvc/controller'
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
  afterRender: function() {
    // console.log('afterRender');
    // console.log(this.data);
  }
}, {
  'ul li p': function() {
    alert($(this).text());
  }
});
// console.log(demoCon);

return demoCon;

}, module);
