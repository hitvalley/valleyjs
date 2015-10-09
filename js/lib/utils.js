define([], function(){

String.prototype.trim = String.prototype.trim || function() {
    return $.trim(this);
};

Array.prototype.filter = Array.prototype.filter || function(callback) {
    var i = 0;
    var arr = this;
    var len = arr.length;
    var newArr = [];
    var item;
    for (; i < len; i ++) {
        (function(n, i){
            var item = callback(n, i);
            item && newArr.push(n);
        }(arr[i], i));
    }
    return newArr;
};

$.fn.delegates = function(configs, psel) {
  el = $(this[0]);
  psel = psel ? (psel + ' ') : '';
  for (var name in configs) {
    var value = configs[name];
    if (typeof value == 'function') {
      var obj = {};
      obj.click = value;
      value = obj;
    };
    if (name.indexOf(',') !== -1) {
      var namelist = name.split(',');
      for (var i = 0; i < namelist.length; i++) {
        for (var type in value) {
          el.delegate(psel + namelist[i], type, value[type]);
        }
      }
    } else {
      for (var type in value) {
        el.delegate(psel + name, type, value[type]);
      }
    }
  }
  return this;
};

$.setStyle = function($node, styles) {
    var i = 0;
    var len = styles.length;
    var item;
    for (; i < len; i ++) {
        item = styles[i];
        $node.find(item.selector).css(item.css);
    }
};

$.fn.detail = function (configs, css) {
    var x = configs.x || 5;
    var y = configs.y || 15;
    $(this).hover(function (e) {
        if (this.offsetWidth < this.scrollWidth) {
            otitle = this.innerText;
            this.title = '';
            var ndiv = '<div id="leo">' + otitle + '</div>';

            $('body').append(ndiv);
            var cssDefault = {
                'position': 'absolute',
                'top': (e.pageY + y) + 'px',
                'left': (e.pageX + x) + 'px',
                'width': 300 + 'px',
                'word-wrap': 'break-word',
                'z-index': 4,
                'background-color':'#FFF8D0',
                'padding': '5px',
                'border': '1px solid #ccc'
            };
            if (css) {
                $.extend(cssDefault, css);
            }
            $('#leo').css(cssDefault).show(2000);
            $(this).mousemove(function (e) {
                $.extend(cssDefault, {
                    'top': (e.pageY + y) + 'px',
                    'left': (e.pageX + x) + 'px'
                })
                $('#leo').css(cssDefault).show(1000);
            });
        }
    }, function () {
        if (this.offsetWidth < this.scrollWidth) {
            this.title = otitle;
            $('#leo').remove();
        }
    });
}

String.prototype.emailTest = function() {
    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(this)) {
        return true;
    }
    else {
        return false;
    }
};

});
