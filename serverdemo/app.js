var url = require('url');
var fs = require('fs');
var express = require('express');
var valleyjs = require('./server/valley');

var app = express();

var basePath = __dirname + '/web';
var scriptRegex = /<script[^>]*>.*?<\/script>/g;

fs.readFile(basePath + '/index.html', 'utf8', function(err, data){
  Valley.mainPage = data.replace(scriptRegex, '');
});

app.get('*', function(req, res){
  if (req.url.indexOf('/favicon.ico') >= 0) {
    res.send('');
    return true;
  }
  Valley.run(req, res);
});

app.listen('3001', function(){
  console.log('http://127.0.0.1:3001/demo');
});