(function(){

global = this;

function Valley(config, properties) {
  if (!(this instanceof Valley)) {
    return new Valley(config, properties);
  }
  return this.fn(config, properties);
}

Valley.dataObj = {};

Valley.isInClient = function(){
  return global === global.window;
};

