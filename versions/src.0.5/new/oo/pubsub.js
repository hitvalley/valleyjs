var PubSub = {
  topics: {},
  tokens: {},
  publish: function(topic, args) {
    if (!this.topics[topic]) {
      return false;
    }
    var subscribers = this.topics[topic] || [];
    subscribers.forEach(function(item, index){
      item.func(topic, args);
    });
  },
  subscribe: function(topic, func) {
    var token = Date.now() + '_' + Math.floor(Math.random() * 100);
    var item = {
      func: func,
      token: token
    };
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    this.topics[topic].push(item);
    this.tokens[token] = {
      topic: topic,
      index: this.topics[topic].length - 1
    };
    return token;
  },
  unsubscribe: function(token) {
    var pos = this.tokens[token];
    if (!pos) {
      return false;
    }
    var subscribers = this.topics[pos.topic];
    subscribers.splice(pos.index, 1);
  }
};

// var token1 = PubSub.subscribe('msg1', function(){
//   console.log('msg1', 'from gutianyu', new Date());
// });
// var token2 = PubSub.subscribe('msg1', function(){
//   console.log('msg1', 'from valley', new Date());
// });
// var token3 = PubSub.subscribe('msg2', function(){
//   console.log('msg2', 'from gutianyu', new Date());
// });

// console.log(token1, token2, token3);
// PubSub.publish('msg1');

// PubSub.unsubscribe(token1);
// PubSub.publish('msg1');
