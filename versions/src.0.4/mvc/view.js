function insertAfter(newElement, targetElement) {
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

Valley.vtpl = function(mainTid, mainConfig, asynConfig, scope, element, cacheObj) {
  var self = this;
  var tplJob = self.initTplObj(mainTid);
  var dataJob;
  var promise, apromise;
  var scope = scope || self.dataObj;
  var isEmpty = self.isEmptyObject(asynConfig) || !asynConfig;
  if (self.isEmptyObject(mainConfig) || !mainConfig) {
    dataJob = Promise.resolve({});
  } else {
    dataJob = self.getViewData(mainConfig, 'mainData', cacheObj);
  }
  promise = Promise.all([tplJob, dataJob]).then(function(args){
    var data = args[1];
    var dataObj = self.extend({}, data.mainData || {}, data);
    console.log(dataObj);
    var html = self.tpl(mainTid, dataObj, scope);
    element.innerHTML = html;
    return {
      html: false,
      data: dataObj
    };
  });
  if (!isEmpty) {
    apromise = self.getViewData(asynConfig, '__asynData', cacheObj);
    Promise.all([promise, apromise]).then(function(args){
      var mainData = args[0].data;
      var data = args[1];
      var dataObj = self.extend({}, mainData, data);
      var data = self.tpl(mainTid, dataObj, scope, true);
      replaceAsyn(element, data);
      replaceAsynTpl(element, data);
      element.trigger('afterAsynRender', data);
    });
  }
  return promise;
};

