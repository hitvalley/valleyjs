(function(global){

// var global = global.global || global;
global.tplObj = {};

global.getTplContent = function(tplId, tplPath) {
  if (this.tplObj[tplId]) {
    return Promise.resolve(this.tplObj[tplId]);
  }
  var viewPath = tplPath || this._config.viewPath;
  var viewExt = this._config.viewExt || '.html';
  var viewUrl = viewPath + tplId + viewExt;
  return this.getFileContent(viewUrl).then(function(template){
    global.tplObj[tplId] = template;
    return template;
  });
};

function getIncludeList(templateContent) {
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
}


global.initTplObj = function(mainTid) {
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
}

function getByStrKey(data, keys) {
  // console.log(keys);
  var key = keys.shift();
  if (!key) {
    return data;
  } else {
    return getByStrKey(data[key], keys);
  }
}

function initNode(data) {
  var nodes = document.getElementsByClassName('asyn-data'),
      i = 0,
      len = nodes.length;
  for (; i < len; i ++) {
    node = nodes[i];
    (function(node){
      var key = node.getAttribute('data-key');
      var value = getByStrKey(data.__asynData, key.split(/\.+/g));
      var textNode = document.createTextNode(value);
      node.parentNode.replaceChild(textNode, node);
      // node.innerHTML = value;
    }(nodes[i]));
  }
}

function defaultAsynFunc(url) {
  return fetch(url).then(function(res){
    return res.json();
  });
}

global.asynFunc = function(asynConfig, data, callback) {
  var i,
      names = [],
      promise,
      jobs = [];
      callback;
  for (i in asynConfig) {
    names.push(i);
    if (typeof asynConfig[i] === 'string') {
      promise = defaultAsynFunc(asynConfig[i]);
    } else if (typeof asynConfig[i] === 'function') {
      promise = asynConfig[i]();
    } else {
      continue;
    }
    jobs.push(promise);
  }
  Promise.all(jobs).then(function(args){
    args.forEach(function(arg, index){
      data.__asynData[names[index]] = arg;
    });
    initNode(data);
  });
};

global.asynBlockFunc = function(asynObj, data) {
  var key,
      asynArr,
      names = [],
      promise,
      jobs = [];
  for (key in asynObj) {
    asynArr = asynObj[key];
    names.push(key);
    fetch(key).then(function(res){
      return res.json();
    }).then(function(idata){
      asynArr.forEach(function(asyn){
        var tmp = document.getElementsByClassName(asyn.id)[0];
        var html = tpl(asyn.tpl, idata);
        global.replaceChildWithHTML(tmp, html);
      });
    });
  }
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

global.sprintf = sprintf;var rInclude = /\{include\s+([^{}]+)\}/g;
var rRequire = /\{require\s+([^{}]+)\}/g;
var rIncludeFile = /file=('|")([^'"]+)\1/;
var rValue = /^("|')([^'"]+)\1$/;
var rComment1 = /\{\/\*([\r\n]|.)*?\*\/\}/g;
var rComment2 = /\/\/[^\r\n]*[\r\n]/g;

var stringTpl = 'vtmpArr.push(\'%s\');';
var variableTpl = 'vtmpArr.push(%s);';
var assignTpl = 'var %s = vtmpInput.%s;';
var asynBlockTpl = '<span class="asyn-block %s" url="%s" tpl="%s"></span>';

function tplToFuncStr(tplId, asynConfig, signId) {
  var tplObj = global.tplObj;
  var template = (tplObj[tplId] || tplId)
                    .replace(rComment1, '')
                    .replace(rComment2, '')
                    .replace(rRequire, function($0, $1){
                      return tplObj[$1];
                    })
                    .replace(/[\r\n]+/g, ' ');
  template = template.replace(/\{asyn\s+([^{}]+)\}/g, function($0, $1){
    return '<span class="asyn-data" data-key="' + $1 + '"></span>';
  });
  // console.log(template);
  var res,
      start = 0,
      mark = 0,
      tags = [],
      str,
      content,
      rTag = /\{([^{}]+)\}/g,
      tagInfo,
      tagName,
      tags = ['var vtmpArr = [];'],
      funcStr;
  // var iarr, itpl, itmp, idata, iarr;
  // tags.push('console.log(arguments);');
  var iname, ikeys, ivalues, ifunc, ifunstr;
  var tmpObj;
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
        ifunstr = tplToFuncStr(iname, tplObj);
        ifunc = new Function(ikeys, ifunstr);
        itpl = 'var vtmpFunc = ' + ifunc.toString() + ';'
             + 'vtmpArr.push(vtmpFunc.call(this, ' + (ivalues.length ? ivalues : 'null') + '));';
        tags.push(itpl);
        break;
      case 'asynBlock':
        // {asynBlock [url=xxx] [tpl=xxx]}
        // var divInfo = '<span class="asyn-block" url="%s" tpl="%s"></span>'
        var abId = signId + '_' + Math.floor(Math.random() * 10000);
        var url, tpl, tmp = {};
        tagArr.forEach(function(item){
          var arr = item.split(/=/);
          if (arr.length >= 2) {
            switch(arr[0]) {
            case 'url':
              url = arr[1].replace(/^\"+|\"+$/g, '');
              break;
            case 'tpl':
              tpl = arr[1].replace(/^\"+|\"+$/g, '');
              break;
            default:
              tmp[arr[0]] = arr[1];
            }
          }
          // console.log(arr);
        });
        asynConfig[url] = asynConfig[url] || [];
        asynConfig[url].push({
          id: abId,
          url: url,
          tpl: tpl,
          data: tmp
        });
        var asynBlockHTML = sprintf(asynBlockTpl, abId, url, tpl);
        // console.log(sprintf(stringTpl, asynBlockHTML));
        tags.push(sprintf(stringTpl, asynBlockHTML));
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
  return tags.join('\n');
  // return 'function(){' + tags.join('\n') + '}';
}

function runTplAsFunction(funcStr, data, scope, returnFunc) {
  var key,
      value,
      keys = [],
      values = [];
  for (key in data) {
    value = data[key];
    keys.push(key);
    values.push(value);
  }
  var func = new Function(keys, funcStr);
  return returnFunc ? func.bind(scope) : func.apply(scope, values);
}

global.tpl = function(mainTid, data, scope, asynConfig) {
  var scope = scope || global;
  var signId = 'tpl_' + Date.now();
  var asynObj = {};
  data.__asynData = {};
  global.asynFunc(asynConfig, data);
  var funcStr = tplToFuncStr(mainTid, asynObj, signId);
  global.asynBlockFunc(asynObj, data);
  var html = runTplAsFunction(funcStr, data, scope);
  return html;
};

global.vtpl = function(tpl, data, scope) {
  var scope = scope || global;
  var funcStr = tplToFuncStr(tpl, {}, '');
  var html = runTplAsFunction(funcStr, data, scope);
  return html;
}

global.getFunc = function(mainTid, scope) {
  var scope = scope || global;
  var funcStr = tplToFuncStr(mainTid, global.tplObj);
  var func = runTplAsFunction(funcStr, data, scope, true);
  return func;
};

}(global));
