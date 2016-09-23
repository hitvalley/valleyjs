Valley.define([
  './extend'
], function(){

var expando = "valleyjs" + ( "0.1" + Math.random() ).replace( /\D/g, "" );

function returnTrue() {
  return true;
}

function returnFalse() {
  return false;
}

Valley.Event = function(src, props) {
  if (src && src.type) {
    this.originalEvent = src;
    this.type = src.type;
    this.isDefaultPrevented = (src.defaultPrevented
                            || src.returnValue === false
                            || src.getPreventDefault
                            && src.getPreventDefault()) ? returnTrue : returnFalse;
  } else {
    this.type = src;
  }

  if (props) {
    this.extend(this, props);
  }

  this.timeStamp = src && src.timeStamp || Date.now();

  this[expando] = true;
};

}, module);