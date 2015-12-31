Valley.define([
  './basic',
  'valleyjs/mvc/controller'
], function(BasicController, Controller) {

var demoCon = Controller.init({
  pageId: 'demo',
}, {
  beforeRender: function() {
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
}, BasicController);
// console.log(demoCon);

return demoCon;

}, module);
