function PubSub() {

}

PubSub.msgQueue = {};

PubSub.subscribe = function(msg, callback, scope, time) {
  if (!this.msgQueue[msg]) {
    this.msgQueue[msg] = [];
  }
  this.msgQueue[msg].push({
    callback: callback,
    scope: scope || global,
    time: time || 'memory'
  });
};

PubSub.publish = function(msg, data, callback) {
  var data = data || {};
  var queue = this.msgQueue[msg] || [];
  var tmp = [];
  queue.forEach(function(msg, index){
    var res = msg.callback.call(msg.scope, data);
    if (msg.time === 'memory') {
      tmp.push(msg);
    }
    callback && callback(res);
  });
  this.msgQueue[msg] = tmp;
}

var con1 = {
  name: 'con1',
  render: function(data) {
    this.beforeRender();
    console.log(this.name, 'render');
    console.log(data);
  },
  beforeRender: function() {
    console.log(this.name, 'beforeRender');
  }
};

var con2 = {
  name: 'con2',
  render: function(data) {
    this.beforeRender();
    console.log(this.name, 'render');
  },
  beforeRender: function() {
    console.log(this.name, 'beforeRender');
  }
};

PubSub.subscribe('render', con1.render, con1, 'once');
PubSub.subscribe('render', con2.render, con2);

function runTest(len) {
  console.log(new Date());
  setTimeout(function(){
    console.log(new Date());
    PubSub.publish('render', 'm');
  }, len || 1000);
}

runTest();
runTest(3000);
