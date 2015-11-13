define([
  'valleyjs/lib/controller',
  'valleyjs/lib/view',
  'valleyjs/lib/tpl'
], function(Controller, View) {

var demoCon = Controller.init({
  pageId: 'demo',
}, {
  beforeRequest: function() {
    //console.log('beforeRequest');
    var self = this;
    this.data = {
      title: 'demo'
    };
    //return View.getPageView(this.config.pageId).always(function(tpl){
    //  self.tpl = tpl;
    //});
  },
//  renderPage: function() {
//    var self = this;
//    //console.log('renderPage');
//    return $.get('demo-obj.html').then(function(res){
//      var data = JSON.parse(res);
//      var html = $.tpl(self.tpl, data);
//      //console.log(data);
//      self.$container.html(html);
//    });
//  },
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
