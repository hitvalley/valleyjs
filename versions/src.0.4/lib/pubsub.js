var PubSub = {
  msgQueue: {},
  subscribe: function(msg, callback, scope, time) {
    if (!this.msgQueue[msg]) {
      this.msgQueue[msg] = [];
    }
    this.msgQueue[msg].push({
      callback: callback,
      scope: scope || Valley,
      time: time || 'memory'
    });
  },
  publish: function(msg, data, callback) {
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
};

Valley.PubSub = PubSub;

