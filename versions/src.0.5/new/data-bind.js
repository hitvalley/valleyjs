var obj = {};

Object.defineProperty(obj, 'm', {
  enumerable: true,
  configurable: true,
  set: function resetSetter(value) {
    checkValue.call(this, value);
  }
});

function checkValue(value) {
  console.log(this, value);
}