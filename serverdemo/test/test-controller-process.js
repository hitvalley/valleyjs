require('../server/valley');
require('../valleyjs/lib/process');
require('../valleyjs/mvc/controller-process');

Valley.setProcessConfig([{
  name: 'beforeRequest',
  zIndex: 1
}, {
  name: 'afterRequest',
  zIndex: 10
}, {
  name: 'renderPage',
  zIndex: 30
}, {
  name: 'beforeRender',
  zIndex: 20
}, {
  name: 'afterRender',
  zIndex: 40
}, {
  name: 'checkUser',
  zIndex: 1
}]);

console.log(Valley._processConfig);