var rInclude = /\{include\s+([^{}]+)\}/g;
var rRequire = /\{require\s+([^{}]+)\}/g;
var rIncludeFile = /file=('|")([^'"]+)\1/;
var rValue = /^("|')([^'"]+)\1$/;
var rComment1 = /\{\/\*([\r\n]|.)*?\*\/\}/g;
var rComment2 = /\{\/\/[^\r\n]*[\r\n]/g;
var token = '\n';

var stringTpl = 'vtmpArr.push(\'%s\');';
var variableTpl = 'vtmpArr.push(%s);';
var checkVariableTpl = 'vtmpArr.push(vargs.%s && %s || "");';
var assignTpl = 'var %s = vtmpInput.%s;';
var asynBlockTpl = 'vtmpArr.push(\'<span class="asyn-tpl" tpl="%s" data-key="pos-\' + pos + \'"></span>\');';
var asynObjTpl = 'asynObj[\'pos-\' + pos] = %s';
var asynPrepareTpl = '';
var asynDebugTpl = 'console.log(%s, asynObj[\'%s\']);';
var inputKeyTpl = 'var _vinputs = ["%s"].concat(_vinputs || []);';

var asynDataHtml = 'vtmpArr.push(\'<span class="asyn-data" data-key="pos-\' + pos + \'"></span>\');';

function toVArgs(names) {
  var keys = [];
  names.forEach(function(name){
    keys.push(name + ': ' + name);
  });
  var str = 'vargs = Valley.extend(true, {%s}, vargs);'.replace('%s', keys.join(','));
  return str;
}

function declareMainVar(names, isMain) {
  var tags = [];
  tags.push('var vtmpArr = [];');
  if (isMain) {
    tags.push('var asynObj = {};');
    tags.push('var pos = 0;');
    tags.push('var vargs = {};');
  }
  tags.push(toVArgs(names));
  return tags;
}

function analyzeTpl(tplId, isForAsyn, isMain) {
  var tplObj = global.tplObj;
  try {
  var template = (tplObj[tplId] || tplId)
                    .replace(rComment1, '')
                    .replace(rComment2, '')
                    .replace(/'/g, '&#39;')
                    .replace(rRequire, function($0, $1){
                      return tplObj[$1];
                    })
                    .replace(/[\r\n]+/g, ' ');
  } catch(e) {
    console.log(tplId);
    throw e;
  }
  var res,
      start = 0,
      mark = 0,
      pos = 0,
      str,
      tags = [],
      content,
      rTag = /\{([^{}]+)\}/g,
      tagInfo,
      tagName,
      funcStr;
  var iname, ikeys, ivalues, ifunc, ifunstr, istr;
  var tmpObj, tmp, tmpUrl, tmpTpl;
  var iTplName, iNames, iArgs, iFunStr, iFunc, iTpls;
  var iRes;
  while(res = rTag.exec(template)) {
    start = res.index;
    content = res[0];
    tagInfo = res[1];
    if (mark < res.index) {
      str = template.substring(mark, start);
      if (str.trim()) {
        tags.push(sprintf(stringTpl, str));
      }
    }
    if (tagInfo) {
      tagArr = tagInfo.split(/\s+/g);
      tagName = tagArr.shift();
      switch(tagName) {
      case 'include':
        // {include [tplId] {item ... }}
        iname = tagArr.shift();
        ikeys = [];
        ivalues = [];
        tagArr.forEach(function(item){
          var arr = item.split('=');
          if (arr.length >= 2) {
            ikeys.push(arr[0]);
            ivalues.push(arr[1]);
          }
        });
        ifunstr = declareMainVar(ikeys).join('\n')
                + analyzeTpl(iname, isForAsyn);
        ifunc = new Function(ikeys, ifunstr);
        itpl = ['var vtmpFunc1 = ' + ifunc.toString() + ';',
                'var info = vtmpFunc1.call(this, ' + (ivalues.length ? ivalues : 'null') + ');',
                'vtmpArr.push(info);'];
        tags.push(itpl.join(token));
        break;
      case 'asynTpl':
        // {asynTpl [tplId] {item ... }}
        iname = tagArr.shift();
        tags.push('pos ++;');
        if (isForAsyn) {
          ikeys = [];
          ivalues = [];
          tagArr.forEach(function(item){
            var arr = item.split('=');
            if (arr.length >= 2) {
              ikeys.push(arr[0]);
              ivalues.push(arr[1]);
            }
          });
          ifunstr = declareMainVar(ikeys).join('\n')
                  + analyzeTpl(iname, isForAsyn);
          if (Valley.debug) {
            try {
              ifunc = new Function(ikeys, ifunstr);
              console.log(ifunc.toString());
            } catch(e) {
              console.log(ikeys, ivalues);
              console.log(ifunstr);
            }
          } else {
            ifunc = new Function(ikeys, ifunstr);
          }
          itpl = ['var vtmpFunc2 = ' + ifunc.toString() + ';',
                  'var info = vtmpFunc2.call(this, ' + (ivalues.length ? ivalues : 'null') + ');',
                  'vtmpArr.push(info);',
                  'asynObj[\'pos-\' + pos] = info;'];
          tags.push(itpl.join(token));
        } else {
          tags.push(sprintf(asynBlockTpl, iname));
        }
        break;
      case 'asyn':
        tmp = tagInfo.replace(/^asyn\s+/, '');
        tags.push('pos ++;');
        if (isForAsyn) {
          tags.push(sprintf(asynObjTpl, tmp));
        } else {
          tags.push(asynDataHtml);
        }
        break;
      case 'if':
      case 'for':
        tags.push(tagInfo + '{');
        break;
      case 'else':
        tags.push('}' + tagInfo + '{');
        break;
      case 'elseif':
        tags.push('} else if ' + tagInfo.replace(/elseif/, '') + '{');
        break;
      case '/if':
      case '/for':
        tags.push('}');
        break;
      case 'js':
        tags.push(tagInfo.replace(/js /, '') + ';');
        break;
      case 'check':
      case 'c':
        tags.push(sprintf(checkVariableTpl, tagInfo.replace(new RegExp('^' + tagName + '\\s+', 'i'), '')));
        break;
      default:
        tags.push(sprintf(variableTpl, tagInfo));
      }
    }
    mark = start + content.length;
  }
  if (mark < template.length) {
    tags.push(sprintf(stringTpl, template.substring(mark)));
  }
  if (isForAsyn && isMain) {
    tags.push('return asynObj;');
  } else {
    tags.push('return vtmpArr.join("");');
  }
  if (Valley.debug) {
    console.log('tags', tags);
  }
  return tags.join(token);
}

function runFunction(mainId, dataObj, scope, isForAsyn) {
  var names = [];
  var args = [];
  for (var i in dataObj) {
    names.push(i);
    args.push(dataObj[i]);
  }
  var funstr = declareMainVar(names, true).join('\n')
              + analyzeTpl(mainId, isForAsyn, true);
  var func = new Function(names, funstr);
  Valley.debug && console.log(func.toString());
  var res = func.apply(scope, args);
  return res;
}

