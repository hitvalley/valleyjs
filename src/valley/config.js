Valley._config = {
  withConfigHost: false,
  root: '/',
  webPath: '[root]',
  conPath: '[webPath]controllers/',
  viewPath: '[webPath]views/',
  viewExt: '.html',
  fileEncoding: 'utf8',
  apiConfig: {
    apiHost: '/',
  },
  urlRules: {
    '': 'index'
  },
  el: document.body,
  prepares: []
};

function toConf(config, key) {
  var info = config[key];
  return (info || Valley._config[key] || '').replace(/\[(\w+)\]/, function($0, $1){
    if ($1) {
      return Valley._config[$1];
    } else {
      return info;
    }
  });
}

function setConfig(config) {
  var config = config || {};

  Valley._config.root = toConf(config, 'root');
  Valley._config.webPath = toConf(config, 'webPath');
  Valley._config.conPath = toConf(config, 'conPath');
  Valley._config.viewPath = toConf(config, 'viewPath');

  config.urlRules && (Valley._config.urlRules = config.urlRules);
  config.viewExt && (Valley._config.viewExt = config.viewExt);
  config.fileEncoding && (Valley._config.fileEncoding = config.fileEncoding);
  config.prepares && (Valley._config.prepares = config.prepares);
  config.dataObj && (Valley.dataObj = config.dataObj);
  config.el && (Valley._config.el = Valley.node(config.el));

  setAjaxConfig(config.apiConfig);

  Valley._debug && console.log(Valley._config);
}

function setAjaxConfig(input) {
  if (Valley.empty(input)) {
    return;
  }
  var info = [];
  var config = {
    host: input.host || '',
    port: input.port || '',
    protocol: input.protocol || 'http',
    mainPath: input.mainPath || '/',
    apiHost: input.apiHost
  };
  if (config.apiHost) {
    Valley._config.apiHost = config.apiHost;
    return;
  }
  Valley._config.withConfigHost = true;
  if (config.host) {
    info.push(config.protocol);
    info.push('://');
    info.push(config.host);
  }
  if (config.port && config.port !== '80') {
    info.push(':');
    info.push(config.port);
  }
  info.push(config.mainPath);
  Valley._config.apiHost = info.join('');
};

Valley.init = function(config, callback) {
  var prepareList = [];

  setConfig(config);
  (Valley._config.prepares || []).forEach(function(pre, index){
    if (!pre.match(/^http(?:s)?:\/\//)) {
      pre = Valley._config.webPath + pre;
    }
    prepareList.push(pre);
  });

  require.config({
    baseUrl: Valley._config.webPath
  });

  require(prepareList, function(){
    var args = Array.prototype.slice.call(arguments, 0);
    args && Promise.all(args).then(function(){
      Valley.run();
    }) || (Valley.run());
  });
}

