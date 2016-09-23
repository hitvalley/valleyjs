String.prototype.toHtmlString = function() {
  return this.replace(/"/g, '&quot;');
};

