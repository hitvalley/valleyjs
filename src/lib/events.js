Node.prototype.ons = function(obj, parent) {
  var sel,
      realsel,
      item,
      event
  for (sel in obj) {
    item = obj[sel];
    if (typeof item === 'function') {
      item = {
        'click': item
      }
    }
    realsel = parent ? (parent + ' ' + sel) : sel;
    for (event in item) {
      this.on(event, realsel, item[event]);
    }
  }
};

