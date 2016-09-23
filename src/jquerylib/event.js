Node.prototype.on = function(types, selector, data, fn, one) {
  // by jquery
  $(this).on(types, selector, data, fn, one);
};

Node.prototype.off = function(types, selector, fn) {
  $(this).off(types, selector, fn);
};

Node.prototype.trigger = function(event, data, elem, onlyHandlers) {
  return $(this).trigger(event, data, elem, onlyHandlers);
};

Valley.onload = function(callback) {
  if (typeof callback !== 'function') {
    return false;
  }
  $(callback);
};

/*common events*/
