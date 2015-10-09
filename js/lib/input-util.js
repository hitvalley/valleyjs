define([

], function(){

$.fn.prepareInput = function() {
  var $input = $(this);
  if ($input.data('hasvalue')) {
    $input.after('<span class="warning-tag">*</span>');
  }
};

$.fn.prepareInputGroup = function() {
  var $group = $(this);
  var $inputs = $group.find('input');
  var mark;
  $inputs.each(function(i, n){
    $(n).prepareInput();
  });
};

$.fn.checkInput = function() {
  var $input = $(this);
  var msg = '';
  if ($input.data('hasvalue') && $input.is(':visible')) {
    if (!$input.val()) {
      msg = ($input.data('tag') || '') + '无输入数据';
      $.messager.popup(msg);
      return false;
    }
  }
  return true;
};

$.fn.checkInputGroup = function() {
  var $group = $(this);
  var $inputs = $group.find('input');
  var mark = true;
  $inputs.each(function(i, n){
    if (!$(n).checkInput()) {
      mark = false;
      return false;
    }
  });
  return mark;
};

$.fn.getValue = function() {
  var $input = $(this);
  var key = $input.data('key');
  var value = $input.val() || $input.data('value') || '';
  var obj = {};
  if ($input.data('valuetype') === 'num') {
    obj[key] = value - 0;
  } else {
    obj[key] = value;
  }
  return obj;
};

$.fn.getValues = function() {
  var $group = $(this);
  var obj = {};
  $group.find('.value-input').each(function(i, n){
    var tmp = $(n).getValue();
    $.extend(obj, tmp);
  });
  return obj;
};

});
