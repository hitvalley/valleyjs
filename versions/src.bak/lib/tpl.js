Valley.define([], function(){

Valley.getTplContent = function(tplId, tplPath) {
  if (this.tplObj[tplId]) {
    return Promise.resolve(this.tplObj[tplId]);
  }
  var viewPath = tplPath || this._config.viewPath;
  var viewExt = this._config.viewExt || '.html';
  var viewUrl = viewPath + tplId + viewExt;
  return this.getFileContent(viewUrl).then(function(template){
    Valley.tplObj[tplId] = template;
    return template;
  });
};

Valley.tplObj = {};

// Valley.tplPath = './';// valley sprintf
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

Valley.sprintf = sprintf;function getIncludeList(templateContent) {
  var includeList = [];
  var res;
  var rPluginTpl = /\{(?:include|require)\s+([^{}]+)\}/g;
  while (res = rPluginTpl.exec(templateContent)) {
    if (!res[1]) {
      continue;
    }
    var arr = res[1].split(/\s+/g);
    arr[0] && includeList.push(arr[0]);
  }
  return includeList;
};

Valley.initTplObj = function(mainTid) {
  var self = this;
  return this.getTplContent(mainTid).then(function(template){
    var includeList = getIncludeList(template);
    var jobs = [];
    includeList.forEach(function(includeId, index){
      if (!self.tplObj[includeId]) {
        jobs.push(self.getTplContent(includeId));
      }
    });
    return Promise.all(jobs).then(function(){
      return self.tplObj;
    });
  });
};

var rInclude = /\{include\s+([^{}]+)\}/g;
var rRequire = /\{require\s+([^{}]+)\}/g;
var rIncludeFile = /file=('|")([^'"]+)\1/;
var rValue = /^("|')([^'"]+)\1$/;
var rComment = /\{\/\*([\r\n]|.)*?\*\/\}/;

var stringTpl = 'vtmpArr.push(\'%s\');';
var variableTpl = 'vtmpArr.push(%s);';
var assignTpl = 'var %s = vtmpInput.%s;';

function tplToFuncStr(tplId, tplObj) {
  var tplObj = tplObj || Valley.tplObj;
  var template = tplObj[tplId]
                    .replace(rComment, '')
                    .replace(rRequire, function($0, $1){
                      return tplObj[$1];
                    })
                    .replace(/[\r\n]+/g, ' ');
  var res,
      start = 0,
      mark = 0,
      tags = [],
      str,
      content,
      rTag = /\{([^{}]+)\}/g,
      tagInfo,
      tags = ['var vtmpArr = [];'],
      funcStr;
  var iarr, itid, itpl, itmp, idata, iarr, ifunstr;
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
      switch(tagArr[0]) {
      case 'include':
        iarr = tagInfo.replace(/include\s+/, '').split(/\s+/g);
        itid = iarr.shift();
        ifunstr = tplToFuncStr(itid, tplObj);
        idata = iarr;
        itmp = '';
        iarr = [];
        idata.forEach(function(item){
          var arr = item.split('=');
          if (arr.length >= 2) {
            var key = arr[0];
            iarr.push(key + ':' + arr[1]);
            itmp += sprintf(assignTpl, key, key);
          }
        });
        itpl = 'var vtmpFunc = function(vtmpInput){'
             +   itmp
             +   'var vtmpFunc = ' + ifunstr
             +   ';return vtmpFunc.call(this);'
             + '};'
             + 'vtmpArr.push(vtmpFunc.call(this, Object.assign(vtmpInput, {' + iarr.join(',') + '})));';
        tags.push(itpl);
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
      default:
        tags.push(sprintf(variableTpl, tagInfo));
      }
    }
    mark = start + content.length;
  }
  if (mark < template.length) {
    tags.push(sprintf(stringTpl, template.substring(mark)));
  }
  tags.push('return vtmpArr.join("");');
  return 'function(){' + tags.join('\n') + '}';
}

function runTplAsFunction(funcStr, data, scope, returnString) {
  var funcList = [];
  Object.keys(data).forEach(function(key){
    funcList.push(sprintf(assignTpl, key, key));
  });
  funcList.push('var vtmpFunction = ' + funcStr);
  // funcList.push(';return vtmpFunction.call(this);');
  funcList.push(';try{return vtmpFunction.call(this);}catch(e){console.log(e);}');
  var func = new Function('vtmpInput', funcList.join(''));
  return returnString ? func : func.call(scope, data);
}

Valley.vtpl = function(mainTid, data, scope) {
  var scope = scope || global;
  var funcStr = tplToFuncStr(mainTid, this.tplObj);
  var html = runTplAsFunction(funcStr, data, scope);
  return html;
};

Valley.tpl = function(mainTid, data, scope) {
  var self = this;
  var scope = scope || global;
  return this.initTplObj(mainTid).then(function(){
    return self.vtpl(mainTid, data, scope);
  });
};

}, module);