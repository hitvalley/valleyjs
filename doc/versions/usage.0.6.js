test.js:
Valley.declare({
  el: '#id-container',
  tpl: 'test',
  data: {
    test: 123
  },
  render: function() {
    console.log()
  }
});

Valley('test', {
  tpl: 'test2'
}).run();

1. 每一个Valley.declare生成一个控制器，该控制器负责将data和tpl融合生成html。
2. 每个控制器可以用作页面和模块生成
3. 页面生成：con1?params -> Valley('con1').run({data:params})
4. 模块生成：Valley('module').run();
5. new Valley === Valley (v = Valley.prototype)
    5.1 var con = new Controller('xxx');
    5.2 con.construct();
    5.3 v.init -> con.init
    5.4 v.render -> con.render
    5.5 v.run -> con.init + con.render
    5.6 v.bind -> v.el.ons
