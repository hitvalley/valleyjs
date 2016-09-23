NodeList.prototype.forEach = function(callback, thisArg) {
  var arr = Array.prototype.slice.call(this);
  return arr.forEach(callback, thisArg || Valley);
}

