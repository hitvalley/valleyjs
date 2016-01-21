Valley.define([
  './basic',
  'valleyjs/mvc/controller'
], function(BasicController, Controller) {

var failCon = Controller.init({
  pageId: 'fail-demo',
}, {
  beforeRender: function() {
    return Promise.reject('no login');
  },
}, {}, BasicController);

return failCon;

}, module);
