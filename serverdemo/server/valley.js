var url = require('url');
var fs = require('fs');
var conRegex = /(<(\w+).*?id="id-container"[^>]*>).*?(<\/\2>)/;

global.Valley = {};

Valley._config = {
};

Valley.define = function(deps, callback, module) {
  var define = require('amdefine')(module);
  var realDeps = [];
  deps.forEach(function(n, i){
    var name = n.endsWith('.js') ? n : (n + '.js');
    var path = name.startsWith('.') ? name : (Valley._config.root + '/' + name);
    realDeps.push(path);
  });
  return define(realDeps, callback);
};

Valley.showPage = function(req, res) {
  var reqUrl = req.url;
  var rInfo = Valley.route(reqUrl);
  var con = require('../web/controllers/' + rInfo.path);
  con.reqUrl = reqUrl;
  con.render().then(function(data){
    var link = Valley._config.linkHost + 'web/index.html#' + reqUrl;
    data += '<br><a href="' + link + '" target="_blank">跳转至：' + link + '</a>';
    var html = Valley.mainPage.replace(conRegex, '$1' + data + '$3');
    res.send(html);
  }, function(err){
    res.send(err);
  });
};

Valley.route = function(rUrl) {
  var obj = url.parse(rUrl || this.reqUrl);
  var path = obj.pathname;
  var params = Valley.queryUrl(obj.query);
  return {
    path: path || this._config.urlRules[path] || '',
    params: params
  };
};

Valley.run = function(config) {
  require('../valleyjs/valley');
  require('./path');
  require('./api');
  this._config.root = config.server.root.replace(/\<(\w+)\>/g, function($0, $1){
    return global[$1];
  });
  this.init(config);
  fs.readFile(Valley._config.webPath + 'index.html', 'utf8', function(err, data){
    Valley.mainPage = data.replace(/<script[^>]*>.*?<\/script>/g, '');
  });
};