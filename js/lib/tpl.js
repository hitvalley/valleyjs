define([], function(){

$.sprintf = function(tpl) {
    if (arguments.length < 2) {
        throw new Exception('Too few arguments');
    }
    var arr = [];
    var object, key, rkey, value;
    // for object replace, key & value
    var res = ''; // result
    if ($.type(arguments[1]) === 'array') {
        arr = arguments[1];
    } else if ($.type(arguments[1]) === 'object') {
        object = arguments[1];
        res = tpl;
        rkeyArr = [];
        for (key in object) {
            rkey = new RegExp('%\\[' + key + '\\]\\$s', 'g');
            rkeyArr.push(rkey);
            value = object[key];
            res = res.replace(rkey, value);
        }
        return res;
    } else {
        arr = [].slice.call(arguments, 1);
    }
    if (tpl.match(/%1\$s/)) {
        res = tpl.replace(/%(\d+)\$s/g, function(){
            var index = arguments[1] - 1;
            return index >= 0 ? arr[index] : arguments[0];
        });
    } else {
        var mark = 0;
        res = tpl.replace(/%s/g, function(){
            return arr[arr.length === 1 ? mark : mark ++];
        });
    }
    return res;
};

$.tpl = {
    comReg: /\{include\s+([\w-]+)\}/g,
    vpl: function(tpl, obj) {
        tpl = this.tmpl(tpl, data);
        tpl = tpl.replace(comReg, function(a, b){
            var tpl = $('#' + b).html();
            if ($.trim(tpl) === '') {
                tpl = $('#' + b).attr('data-com-tpl');
            }
            return $.tpl(tpl, data);
        });
        return tpl;
    },
    rTag: /\{([^{}]+)\}/g,
    rIndex: /^([\w\/]+)\s*/,
    arrTpl: 'arr.push(\'%s\');',
    tmpTpl: 'var tmp%2$s=%1$s;arr.push(tmp%2$s);',
    rComment: /\/\*.*?\*\//,
    tagConfig: {
        'if'  : '%s{',
        'else': '}%s{',
        'elseif': '}%s{',
        '/if' : '}',
        'for' : '%s{',
        '/for': '}'
    },
    getTags: function(tpl) {
        var tags = [];
        var mark = 0;
        var start = 0;
        var res = '';
        while(res = this.rTag.exec(tpl)) {
            start = res.index;
            if (mark < start) {
                tags.push({
                    info: tpl.substring(mark, start).replace(),
                    isTag: false
                });
                mark = start;
            }
            tags.push({
                info: res[1],
                isTag: true
            });
            mark = start + res[0].length;
        }
        if (mark < tpl.length) {
            tags.push({
                info: tpl.substring(mark),
                isTag: false,
            });
        }
        return tags;
    },
    tmpl: function(tpl, obj, isReduce) {
        tpl = tpl.replace(this.comReg, function(a, b){
            return $('#' + b).html();
        });
        //console.log(tpl);
        var tpls = tpl
            .replace(this.rComment, '')
            .split(/[\r\n]+/g);
        if (isReduce) {
            tpls = tpls.map(function(n, i){
                var tmp = (n || '').trim();
                if (!tmp.match(/^[<{}]/)) {
                  tmp = ' ' + tmp;
                }
                return tmp;
            })
        }
        tpls.filter(function(n, i){
                var n = n.trim();
                n = n.replace(/^\{|\}$/g, '').trim();
                return n ? n : null;
            });
        var tags = this.getTags(tpls.join('').trim());
        var i = 0, len = tags.length;
        var tag;
        var tkeys, tkey, tvalue;
        var funArr = [];
        var tmp = '';
        funArr.push('var arr = [];');
        for (; i < len; i ++) {
            tag = tags[i];
            if (tag.isTag) {
                tkeys = tag.info.match(this.rIndex);
                if (tkeys && (tkey = tkeys[1])) {
                    tvalue = this.tagConfig[tkey];
                    if (tvalue) {
                        tmp = tvalue.replace(/%s/g, tag.info);
                    } else if(tkey === 'js') {
                        tmp = tag.info.replace(/^js/, '');
                    } else {
                        tmp = $.sprintf(this.tmpTpl, tag.info, i);
                    }
                } else {
                    tmp = $.sprintf(this.tmpTpl, tag.info, i);
                }
            } else {
                //if ($.trim(tag.info)) {
                    tmp = $.sprintf(this.arrTpl, tag.info);
                //}
            }
            funArr.push(tmp);
        }
        //funArr.push('console.log(arr);')
        funArr.push('return arr.join("");');
        //console.log(funArr.join('\r\n'));
        //console.log(funArr);
        var fun = new Function("g", funArr.join('\r'));
        return fun(obj);
    }
};

});
