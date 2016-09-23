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

Valley.asynRender = function(tplId, dataObj, scope, element) {
  var obj = this.tpl(tplId, dataObj, scope, true);
  replaceAsyn(element, obj);
  replaceAsynTpl(element, obj);
  return dataObj;
};

