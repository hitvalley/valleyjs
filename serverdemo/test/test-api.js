require('../server/valley');
require('../server/api');
// require('../valleyjs/lib/api');

Valley.get('/publish/getList', {}, {
  host: '115.29.36.124',
  port: '5012',
}).then(function(data){
  console.log('post', data.toString());
}, function(err){
  console.log('post.err', err);
});
// Valley.ajax('/get.json');