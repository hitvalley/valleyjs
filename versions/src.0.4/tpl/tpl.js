(function(global){
global.tplObj = {};

function getIncludeList(templateContent) {
  var includeList = [];
  var res;
  var rPluginTpl = /\{(?:include|require|asynTpl)\s+([^{}]+)\}/g;
  while (res = rPluginTpl.exec(templateContent)) {
    if (!res[1]) {
      continue;
    }
    var arr = res[1].split(/\s+/g);
    arr[0] && includeList.push(arr[0]);
  }
  return includeList;
};

global.getTplContent = function(tplId, tplPath) {
  if (this.tplObj[tplId]) {
    return Promise.resolve(this.tplObj[tplId]);
  }
  var viewPath = tplPath || this._config.viewPath;
  var viewExt = this._config.viewExt || '.html';
  var viewUrl = viewPath + tplId + viewExt;
  return this.getFileContent(viewUrl).then(function(template){
    global.tplObj[tplId] = template;
    var jobs = [];
    var includeList = getIncludeList(template);
    includeList.forEach(function(includeId, index){
      if (!global.tplObj[includeId]) {
        jobs.push(global.getTplContent(includeId));
      }
    });
    return jobs.length ? Promise.all(jobs).then(function(){
      return template;
    }) : Promise.resolve(template);
  });
};

global.initTplObj = function(mainTid) {
  return this.getTplContent(mainTid).then(function(template){
    return global.tplObj;
  });
};

var rStr = /%s/g;
var rDStr = /%(\d+)\$s/g;

function sprintf() {
  if (arguments.length < 2) {
    throw 'Too few arguments';
  }
  var tpl = arguments[0];
  var args, arg;
  var res;
  if (typeof arguments[1] === 'array') {
    args = arguments[1];
  } else {
    args = Array.prototype.slice.call(arguments, 1);
  }
  if (args.length <= 0) {
    throw 'Too few arguments';
  }
  res = tpl.replace(rDStr, function($0, $1){
    var index = $1 - 1;
    if (args[index]) {
      return args[index];
    } else {
      throw 'Too few arguments';
    }
  });
  var arr = res.match(rStr) || [];
  if (args.length === 1) {
    return res.replace(rStr, args[0]);
  } else if (arr.length > args.length) {
      throw 'Too few arguments';
  }
  return res.replace(/%s/g, function(){
    return args.shift();
  });
}

global.sprintf = sprintf;function insertAfter(newElement, targetElement) {
  var parent = targetElement.parentNode;
  if (targetElement === parent.lastChild) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}

function htmlToNode(html) {
  var tmp, elem;
  tmp = document.createElement('div');
  tmp.innerHTML = html;
  elem = tmp.childNodes;
  tmp = null;
  return elem;
}

function replaceChildWithHTML(node, html) {
  var elem = htmlToNode(html),
      parent = node.parentNode,
      fragment,
      len = elem.length,
      i = 0,
      newElement,
      tmp = [];
  if (elem.nodeType === 1) {
    parent.replaceChild(elem, node);
  } else {
    fragment = document.createDocumentFragment();
    for (; i < len; i ++) {
      if (i === 0) {
        newElement = elem[i].cloneNode(true);
        parent.replaceChild(newElement, node);
      } else {
        fragment.appendChild(elem[i].cloneNode(true));
      }
    }
    insertAfter(fragment, newElement);
  }
}

function replaceAsyn(element, dataObj) {
  var element = element || document.body,
      nodes = element.getElementsByClassName('asyn-data'),
      i = 0,
      len = nodes.length,
      node;
  for (i = len - 1; i >= 0; i --) {
    var node = nodes[i];
    var keystr = node.getAttribute('data-key');
    var value = dataObj[keystr];
    var textNode = document.createTextNode(value);
    node.parentNode.replaceChild(textNode, node);
  }
}

function replaceAsynTpl(element, dataObj) {
  var element = element || document.body,
      nodes = element.getElementsByClassName('asyn-tpl'),
      i = 0,
      len = nodes.length,
      node;
  for (i = len - 1; i >= 0; i --) {
    var node = nodes[i];
    var keystr = node.getAttribute('data-key');
    var html = dataObj[keystr];
    replaceChildWithHTML(node, html);
  }
}

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
  var template = (tplObj[tplId] || tplId)
                    .replace(rComment1, '')
                    .replace(rComment2, '')
                    .replace(rRequire, function($0, $1){
                      return tplObj[$1];
                    })
                    .replace(/[\r\n]+/g, ' ');
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

global.tpl = function(template, data, scope, isForAsyn) {
  var scope = scope || global;
  // var funcStr = tplToFuncStr(template, isForAsyn);
  // var html = runTplAsFunction(funcStr, data, scope);
  var html = runFunction(template, data, scope, isForAsyn);
  return html;
};

}(Valley));
