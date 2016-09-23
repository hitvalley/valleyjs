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

