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
    var self = this;
    var rInfo = Valley.route(this.reqUrl);
    var data = {
      name: 'company names',
      page: rInfo.params.page || 0,
      count: 100,
      list: [
        'sogou',
        'baidu',
        'tencent',
        'alibaba'
      ]
    };
    return new Promise(function(resolve, reject){
      self.renderTpl(data).then(function(html){
        resolve(html);
      });
    });
  },
  afterRender: function() {

  }
}, {
  'ul li p': function() {
    alert($(this).text());
  }
});
// console.log(demoCon);

return demoCon;

}, module);
