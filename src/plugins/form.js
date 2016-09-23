Valley.plugin('form', {
  el: '.input-form',
  arrTmp: {},
  // documentEventObj: {
  //   '.form-put-btn': function(event, data) {
  //     var con = data.con;
  //     var params = con.getParams();
  //     console.log(params);
  //   }
  // },
  check: function($input, value) {
    value = $.trim(value);
    if ($input.data('noempty') && Valley.empty(value)) {
      $.messager.popup($input.data('noempty'));
      return false;
    }
    if ($input.data('format') === 'number') {
      return value - 0;
    }
    if ($input.data('format') === 'timestamp') {
      var date = new Date(value);
      return date.getTime();
    }
    if ($input.data('format') === 'timesecond') {
      var date = new Date(value);
      return Math.floor(date.getTime() / 1000);
    }
    return value;
  },
  checks: function(inputs, params) {
    var params = params || {};
    var con = this;
    var res;
    if (!inputs) {
      return;
    }
    $.each(inputs, function(key, item){
      if (typeof item.value === 'undefined') {
        params[key] = Valley.isArray(item) ? [] : {};
        res = con.checks(item, params[key]);
        if (res === false) {
          params = false;
          return false;
        }
      } else {
        res = con.check(item.$input, item.value);
        if (res === false) {
          params = false;
          return false;
        }
        params[key] = res;
      }
    });
    return params;
  },
  setValue: function($input, obj, value) {
    var con = this;
    var keys = [{
      type: 'value',
      key: $input.data('key')
    }];
    var $parents = $input.parents('.input-parent');
    $parents.each(function(index, parent){
      var $parent = $(parent);
      var type = $parent.data('type') ? $parent.data('type') : 'obj';
      keys.unshift({
        type: type,
        key: $parent.data('key')
      });
    });
    var tmp = obj;
    keys.forEach(function(item, index){
      var ikey = item.key;
      var type = item.type;
      var key;
      if (Valley.isArray(tmp)) {
        if (typeof con.arrTmp[ikey] === 'undefined') {
          con.arrTmp[ikey] = tmp.length;
        }
        key = con.arrTmp[ikey];
      } else {
        key = ikey;
      }

      if (type === 'arr') {
        if (!tmp[key]) {
          tmp[key] = [];
        }
      } else if (type === 'obj') {
        if (!tmp[key]) {
          tmp[key] = {};
        }
      } else {
        tmp[key] = {
          value: value,
          $input: $input
        };
      }
      tmp = tmp[key];
    });
  },
  getInputValue: function($input, type, tagName) {
    if (tagName !== 'INPUT' && tagName !== 'SELECT') {
      if ($input.data('active')) {
        var activeClass = $input.data('active');
        if ($input.hasClass(activeClass)) {
          return $input.data('value') || $input.text();
        } else {
          return;
        }
      } else {
        return $input.data('value') || $input.text();
      }
    } else {
      switch(type) {
      case 'radio':
        if ($input.is(':checked')) {
          return $input.data('value');
        }
        break;
      case 'checkbox':
        if ($input.is(':checked')) {
          return $input.data('value');
        }
        break;
      default:
        return $input.val() || $input.data('value') || '';
      }
    }
    return;
  },
  getParams: function(el) {
    var con = this;
    var element = el ? el : con.data.el;
    var params = {};
    $(element).find('.value-input').each(function(index, input){
      var $input = $(input);
      var tagName = $input.prop('tagName');
      var type = $input.prop('type');
      var value = con.getInputValue($input, type, tagName);
      var key = $input.data('key');
      if (typeof value !== 'undefined') {
        con.setValue($input, params, value);
      }
    });
    return con.checks(params);
  },
  interfaces: {
    getParams: 'getParams'
  }
});