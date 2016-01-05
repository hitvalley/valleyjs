Valley.define([], function(){

var DefaultTPL = 'Y-M-D H:I:S';

Valley.timestr = function(tpl, timestamp) {
  if (arguments.length === 0) {
    tpl = DefaultTPL;
  }
  if (typeof tpl === 'number') {
    timestamp = tpl;
    tpl = DefaultTPL;
  }
  var date;
  if (!timestamp) {
    date = new Date();
  } else if (timestamp.toString().length === 10) {
    date = new Date(timestamp * 1000);
  } else {
    date = new Date(timestamp);
  }
  var tpl = tpl || DefaultTPL;
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var obj = {
    'Y': date.getFullYear(),
    'y': date.getYear(),
    'M': month < 10 ? ('0' + month) : month,
    'm': month,
    'D': day < 10 ? ('0' + day) : day,
    'd': day,
    'H': hour < 10 ? ('0' + hour) : hour,
    'h': hour,
    'I': minute < 10 ? ('0' + minute) : minute,
    'i': minute,
    'S': second < 10 ? ('0' + second) : second,
    's': second
  };
  return tpl.replace(/([YMDHISymdhis])/g, function(){
    return obj[arguments[1]];
  });
};

}, module;
