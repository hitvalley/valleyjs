Valley.getFileContent = function(filePath, encoding) {
  return new Promise(function(resolve, reject){
    $.ajax(filePath, {
      dataType: 'text'
    }).then(function(text){
      resolve(text);
    }, function(reason){
      reject(reason);
    });
  });
};

