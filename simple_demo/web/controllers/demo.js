Valley.define([
  './basic.js'
], function(BasicController) {

var demoCon = new Valley({
  pageId: 'demo',
  eventObj: {
    'p': function() {
      alert(this.innerText);
    }
  }
}, {
  beforeRender: function() {
    var self = this;
    this._data.title = 'demo';
  },
  renderPage: function() {
    return this.renderPageByUrl('/data.json');
  },
  afterRender: function() {
    document.getElementById('title').style.color = '#f00';
  }
}, BasicController);

// global.demoCon = demoCon;

return demoCon;

}, module);
