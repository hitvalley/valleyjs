define([
], function(){

var Controller = function(config) {
  this.config = config;
};
$.extend(Controller.prototype, {
  init: function() {
    this._bind();
  },
  render: function() {
  
  },
  beforeRender: function() {
  },
  afterRender: function() {
  },
  _bind: function() {
    this.bind();
  },
  bind: function() {
  }
});

});
