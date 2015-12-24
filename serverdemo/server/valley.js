var url = require('url');

global.Valley = {};

var basePath = __dirname + '/../';
var conRegex = /(<(\w+).*?id="id-container"[^>]*>).*?(<\/\2>)/;
var reqUrl = '';
// var basePage = basePath + 'web/index.html';

Valley.define = function(deps, callback, module) {
  var define = require('amdefine')(module);
  var realDeps = [];
  deps.forEach(function(n, i){
    var name = n.endsWith('.js') ? n : (n + '.js');
    var path = name.startsWith('.') ? name : (basePath + '/' + name);
    realDeps.push(path);
  });
  return define(realDeps, callback);
};

require('../valleyjs/valley-lib');

Valley.run = function(req, res) {
  var reqUrl = req.url;
  var rInfo = Valley.route(reqUrl);
  var con = require('../web/controllers/' + rInfo.path);
  var data = con.render();
  var link = 'http://115.29.36.124:3007/web/index.html#' + reqUrl;
  data += '<br><a href="' + link + '" target="_blank">跳转至：' + link + '</a>';
  var html = Valley.mainPage.replace(conRegex, '$1' + data + '$3');
  res.send(html);
};

Valley.route = function(rUrl) {
  var obj = url.parse(rUrl || reqUrl);
  var path = obj.pathname;
  var params = Valley.queryUrl(obj.query);
  return {
    path: path,
    params: params
  };
}

global.Valley = Valley;
