Valley.define([], function(){

var BasicController = Controller.extend({
  userInfo: null,
  renderFailPage: function(reason) {
    return '<h1>Failed Page</h1>'
          + '<p>' + reason + '</p>';
  },
  beforeRequest: function() {
    var con = this;
    return Valley.get('/user.json').then(function(userInfo){
      con._data.userInfo = userInfo;
    }, function(reason){
      return reason;
    });
  }
});

return BasicController;

}, module);