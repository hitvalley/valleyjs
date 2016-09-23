function PubSub() {
  this.subs = [];
}

PubSub.prototype.subscribe = function(item) {
  this.subs.push(item);
};

PubSub.prototype.unsubscribe = function(item) {
  if (!this.subs.length) {
    return;
  }
  var index = this.subs.indexOf(item);
  if (index >= 0) {
    return this.subs.splice(index, 0);
  }
};

PubSub.prototype.publish = function() {
  this.subs.forEach(function(sub){
    sub && sub.update();
  });
};

function Observer() {

}