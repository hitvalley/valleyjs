/**
 * 管理ValleyJs在客户端中可以获取内容的文件
 * filePath其实是fileUrl
 */
Valley.getFileContent = function(filePath, encoding) {
  var encoding = encoding || 'utf8';
  return fetch(filePath, {
    headers: {
      "Content-Type": "text/html"
    }
  }).then(function(res){
    return res.text();
  });
};

