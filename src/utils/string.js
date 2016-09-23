String.prototype.toHtmlString = function() {
  return this.replace(/"/g, '&quot;');
};

Valley.substr = function(str, len) {
  if (!str) {
    return str;
  }
  var len = len || 18;
  return str.length > len ? (str.substr(0, len) + '...') : str;
};