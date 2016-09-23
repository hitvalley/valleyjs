var __global_observers = {};

function Observer(name, fn) {
  this.name = name || (Data.now() + '_' + Math.floor(Math.random() * 1000));
  this.fns = fn ? [fn] : [];
  // __global_observers[name] = this;
}

Observer.prototype.subscribe = function(fn) {
  this.fns.push(fn);
};

Observer.prototype.unsubscribe = function(fn) {
  var index = this.fns.indexOf(fn);
  if (index > -1) {
    this.fns.splice(index, 1);
    return true;
  }
  return false;
};

Observer.prototype.publish = function(scope, args) {
  var res = [];
  var scope = scope || global;
  var args = args || [];
  this.fns && this.fns.forEach(function(fn, index){
    res.push(fn.apply(scope, args));
  });
  return res;
};

Observer.__global_observers = {};

Observer.add = function(name, fn) {
  var observer;
  if (this.__global_observers[name]) {
    observer = this.__global_observers[name];
    observer.subscribe(fn);
  } else {
    observer = new Observer(name, fn);
    this.__global_observers[name] = observer;
  }
};

Observer.get = function(name) {
  return this.__global_observers[name];
};

Observer.publish = function(name, scope, args) {
  var observer = this.__global_observers[name];
  if (!observer) {
    return false;
  }
  observer.publish(scope, args);
};

// Observer.add('test', function(){
//   console.log('test1', new Date());
// });
// Observer.add('test', function(){
//   console.log('test2', new Date());
// });

// Observer.publish('test');