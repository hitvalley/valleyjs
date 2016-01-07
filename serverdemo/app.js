var url = require('url');
var os = require('os');
var express = require('express');
global.appPath = __dirname;
global.hostInfo = '115.29.36.124';

require('./server/valley');
require('./config');

var app = express();
app.get('*', function(req, res){
  if (req.url.indexOf('/favicon.ico') >= 0) {
    res.send('');
    return true;
  }
  Valley.showPage(req, res);
});
app.listen('3008', function(){
  console.log('http://' + hostInfo + ':3008/demo');
});
