define([], function(){

var DefaultConfig = {
  container: $('#id-container'),
  conPath: '/controllers/',
  viewPath: '/views/',
  urlRules: {
    '': 'index',
  }
};
DefaultConfig.processConfig = [{
      name: 'beforeRequest',
      zIndex: 1
    }, {
      name: 'afterRequest',
      zIndex: 10
    }, {
      name: 'beforeRender',
      zIndex: 20
    }, {
      name: 'render',
      zIndex: 30
    }, {
      name: 'afterRender',
      zIndex: 40
    }];

return DefaultConfig;

});
