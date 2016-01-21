var URL = require('url');
var express = require('express');
var childProcess = require('child_process');
var hostInfo = '127.0.0.1';

// for dev
var sapp = express();
sapp.use(express.static(__dirname));
sapp.get('/data.json', function(req, res){
  var data = {
    name: 'company names',
    page: 0,
    count: 100,
    list: [
      'sogou',
      'baidu',
      'tencent',
      'alibaba'
    ]
  };
  res.send(data);
});
sapp.get('/user.json', function(req, res){
  //res.send('{"test": 1}');
  res.send({
    "username": "gutianyu",
    "company": "sogou"
  });
});
sapp.listen('3007',  function(){
  var url = 'http://' + hostInfo + ':3007/web/index.html';
  console.log(url);
  childProcess.exec('open ' + url);
});
