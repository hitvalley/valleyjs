define([], function(){

$.sprintf = function(tpl) {
  if (arguments.length < 2) {
    throw new Exception('Too few arguments');
  }
  var arr = [];
  var object, key, rkey, value;
  // for object replace, key & value
  var res = ''; // result
  if ($.type(arguments[1]) === 'array') {
    arr = arguments[1];
  } else if ($.type(arguments[1]) === 'object') {
    object = arguments[1];
    res = tpl;
    rkeyArr = [];
    for (key in object) {
      rkey = new RegExp('%\\[' + key + '\\]\\$s', 'g');
      rkeyArr.push(rkey);
      value = object[key];
      res = res.replace(rkey, value);
    }
    return res;
  } else {
    arr = [].slice.call(arguments, 1);
  }
  if (tpl.match(/%1\$s/)) {
    res = tpl.replace(/%(\d+)\$s/g, function(){
      var index = arguments[1] - 1;
      return index >= 0 ? arr[index] : arguments[0];
    });
  } else {
    var mark = 0;
    res = tpl.replace(/%s/g, function(){
      return arr[arr.length === 1 ? mark : mark ++];
    });
  }
  return res;
};

var rInclude = /\{include\s+([\w-]+)(.*)\}/g;
var rRequire = /\{require\s+([\w-]+)\}/g;
var rComment = /\{\/\*([\r\n]|.)*?\*\/\}/;
var rTag = /\{([^{}]+)\}/g;
var rIndex = /^([\w\/]+)\s*/;
var getTags = function(tpl) {
  // 分析tpl，获得标签信息
  var tags = [];
  var mark = 0;
  var start = 0;
  var res = '';
  while(res = rTag.exec(tpl)) {
    start = res.index;
    if (mark < start) {
      tags.push({
        info: tpl.substring(mark, start).replace(),
        isTag: false
      });
      mark = start;
    }
    tags.push({
      info: res[1],
      isTag: true
    });
    mark = start + res[0].length;
  }
  if (mark < tpl.length) {
    tags.push({
      info: tpl.substring(mark),
      isTag: false,
    });
  }
  return tags;
};
var tagConfig = {
  'if'  : '%s{',
  'else': '}%s{',
  'elseif': '}%s{',
  '/if' : '}',
  'for' : '%s{',
  '/for': '}'
};
var tmpTpl = 'var tmp%2$s=%1$s;tpl_arr.push(tmp%2$s);';
var arrTpl = 'tpl_arr.push(\'%s\');';

$.tpl = function(tpl, obj, scope) {
  var html = '';
  var tpl = tpl.replace(rComment, '');
  var tplObj = {};
  var mark = 0;
  tpl = tpl.replace(rRequire, function(innerTpl, iTpl){
    var innerTpl = $('#' + iTpl).html();
    return innerTpl;
  });
  tpl = tpl.replace(rInclude, function(innerTpl, iTpl, argstr){
    var tplIndex = 'innerTpl' + (mark ++);
    var innerTpl = $('#' + iTpl).html();
    var innerObj = {};
    argstr && argstr.split(/\s\+/g).forEach(function(n, i){
      var items = n.split(/=/);
      var key = $.trim(items[0]);
      var value = $.trim(items[1]);
      innerObj[key] = value || null;
    });
    tplObj[tplIndex] = '(function(g, scope){'
                     +   'var g = $.extend(g, ' + JSON.stringify(innerObj) + ');'
                     +   'return (' + $.tpl(innerTpl) + '(g));'
                     + '}(g, this));'
    return $.sprintf('{%s}', tplIndex);
  });
  var tpls = tpl.split(/[\r\n]+/g);
  var tags = getTags(tpls.join('').trim());
  var funArr = [];
  var tkeys, tkey, tvalue;
  var tmp = '';
  funArr.push('var tpl_arr = [];');
  tags.forEach(function(tag, i){
    if (tag.isTag) {
      tkeys = tag.info.match(rIndex);
      if (tag.info.match(/innerTpl\d+/)) {
        tmp = $.sprintf(tmpTpl, tplObj[tag.info], i)
      } else if (tkeys && (tkey = tkeys[1])) {
        tvalue = tagConfig[tkey];
        if (tvalue) {
          tmp = tvalue.replace(/%s/g, tag.info);
        } else if (tkey === 'js') {
          tmp = tag.info.replace(/^js/, '');
        } else {
          tmp = $.sprintf(tmpTpl, tag.info, i);
        }
      } else {
        tmp = $.sprintf(tmpTpl, tag.info, i);
      }
    } else {
      tmp = $.sprintf(arrTpl, tag.info);
    }
    funArr.push(tmp);
  });
  funArr.push('return tpl_arr.join("");');
  //console.log(funArr.join('\r\n'));
  var fun = new Function("g", funArr.join('\r'));
  return obj ? fun.call(scope || window, obj) : fun;
};

});
