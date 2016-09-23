Valley.post = function(path, data, setting){
  return this.ajax(path, 'POST', data, setting);
};

Valley.get = function(path, data, setting){
  return this.ajax(path, 'GET', data, setting);
};

