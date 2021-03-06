Valley.htmlToNode = function(html) {
  var tmp, elem;
  tmp = document.createElement('div');
  tmp.innerHTML = html;
  elem = tmp.childNodes;
  tmp = null;
  // window.tmp = tmp;
  return elem;
};

Valley.replaceChildWithHTML = function(node, html) {
  var elem = Valley.htmlToNode(html),
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
    Valley.insertAfter(fragment, newElement);
  }
};

Valley.insertAfter = function(newElement, targetElement) {
  var parent = targetElement.parentNode;
  if (targetElement === parent.lastChild) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
};

