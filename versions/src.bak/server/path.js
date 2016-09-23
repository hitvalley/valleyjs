/**
 * 管理valleyJs的服务器中程序需要读取内容的文件
 */
var fs = require('fs');

Valley.getFileContent = function(filePath, encoding) {
  var encoding = encoding || 'utf8';
  return new Promise(function(resolve, reject){
    fs.readFile(filePath, encoding, function(err, data){
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};