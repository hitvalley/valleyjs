Valley.define([
  'valleyjs/mvc/controller'
], function(Controller){

var BasicController = Controller.extend({
  userInfo: null,
  renderFailPage: function(reason) {
    return '<h1>Failed Page</h1>'
          + '<p>' + reason + '</p>';
  },
  beforeRequest: function() {
    var con = this;
    return Valley.get('/user.json').then(function(userInfo){
      con.userInfo = userInfo;
    });
  }
});

return BasicController;

}, module);