function defineModuleData(obj, key, value) {
  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }
  var getter = property && property.get;
  var setter = property && property.set;
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      var value = getter ? getter.call(obj) : val;
    },
    set: function (newVal) {
      var value = getter ? getter.call(obj) : val;
      if (newVal === value) {
        return;
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      // notify
    }
  });
}