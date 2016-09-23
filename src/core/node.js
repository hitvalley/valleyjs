NodeList.prototype.forEach = function(callback, thisArg) {
  var arr = Array.prototype.slice.call(this);
  return arr.forEach(callback, thisArg || Valley);
};

Valley.node = function(el) {
  if (Valley.isString(el)) {
    return document.querySelector(el);
  } else if (el instanceof Node) {
    return el;
  }
  return document.body;
};

Valley.htmlToNode = function(html) {
  var tmp, elem;
  tmp = document.createElement('div');
  tmp.innerHTML = html;
  elem = tmp.childNodes;
  tmp = null;
  return elem;
};

Valley.appendHtml = function(html, el) {
  if (!html) {
    return;
  }
  var nodes = this.htmlToNode(html);
  var i = 0;
  var len = nodes.length;
  var fragment = document.createDocumentFragment();
  var tmps = [], node;
  for (; i < len; i ++) {
    node = fragment.appendChild(nodes[i].cloneNode(true));
    tmps.push(node);
  }
  el = el || document.body;
  el.appendChild(fragment);
  return tmps;
}

Valley.append = function(nodes, el) {
  var i = 0;
  var len = nodes.length;
  var fragment = document.createDocumentFragment();
  for (; i < len; i ++) {
    fragment.appendChild(nodes[i].cloneNode(true));
  }
  el = el || document.body;
  el.appendChild(fragment);
};
