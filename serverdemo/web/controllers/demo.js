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
  renderPage: function() {
    return this.renderPageByUrl('/data.json');
  },
  afterRender: function() {
    document.getElementById('title').style.color = '#f00';
  }
}, {
  'p': function() {
    alert(this.innerText);
  }
});
// console.log(demoCon);

return demoCon;

}, module);
