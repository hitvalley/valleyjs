var fs = require('fs');
var conRegex = /(<(\w+).*?id="id-container"[^>]*>).*?(<\/\2>)/;

Valley.mainPage = '';

Valley.showPage = function(req, res) {
  var urlInfo = Valley.route(req);
  var con = require(this._config.conPath + urlInfo.path);
  con.reqUrl = req.url;
  con.render().then(function(data){
    var link = Valley._config.linkHost + 'web/index.html#' + req.url;
    var html;
    data += '<br><a href="' + link + '" target="_blank">跳转至：' + link + '</a>';
    if (Valley.mainPage) {
      html = Valley.mainPage.replace(conRegex, '$1' + data + '$3');
    } else {
      html = data;
    }
    res.send(html);
  }, function(err){
    res.send(err);
  });
};

Valley.route = function(req) {
  return this.parseURL(req.url || '');
};

Valley.run = function(req, res) {
  require('../vlib');
  fs.readFile(Valley._config.webPath + 'index.html', 'utf8', function(err, data){
    Valley.mainPage = data.replace(/<script[^>]*>.*?<\/script>/g, '');
  });
};
