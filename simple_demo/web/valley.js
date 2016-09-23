/*
 RequireJS 2.1.11 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
var requirejs,require,define;
(function(ca){function G(b){return"[object Function]"===M.call(b)}function H(b){return"[object Array]"===M.call(b)}function v(b,c){if(b){var d;for(d=0;d<b.length&&(!b[d]||!c(b[d],d,b));d+=1);}}function U(b,c){if(b){var d;for(d=b.length-1;-1<d&&(!b[d]||!c(b[d],d,b));d-=1);}}function s(b,c){return ga.call(b,c)}function j(b,c){return s(b,c)&&b[c]}function B(b,c){for(var d in b)if(s(b,d)&&c(b[d],d))break}function V(b,c,d,g){c&&B(c,function(c,h){if(d||!s(b,h))g&&"object"===typeof c&&c&&!H(c)&&!G(c)&&!(c instanceof
RegExp)?(b[h]||(b[h]={}),V(b[h],c,d,g)):b[h]=c});return b}function t(b,c){return function(){return c.apply(b,arguments)}}function da(b){throw b;}function ea(b){if(!b)return b;var c=ca;v(b.split("."),function(b){c=c[b]});return c}function C(b,c,d,g){c=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+b);c.requireType=b;c.requireModules=g;d&&(c.originalError=d);return c}function ha(b){function c(a,e,b){var f,n,c,d,g,h,i,I=e&&e.split("/");n=I;var m=l.map,k=m&&m["*"];if(a&&"."===a.charAt(0))if(e){n=
I.slice(0,I.length-1);a=a.split("/");e=a.length-1;l.nodeIdCompat&&R.test(a[e])&&(a[e]=a[e].replace(R,""));n=a=n.concat(a);d=n.length;for(e=0;e<d;e++)if(c=n[e],"."===c)n.splice(e,1),e-=1;else if(".."===c)if(1===e&&(".."===n[2]||".."===n[0]))break;else 0<e&&(n.splice(e-1,2),e-=2);a=a.join("/")}else 0===a.indexOf("./")&&(a=a.substring(2));if(b&&m&&(I||k)){n=a.split("/");e=n.length;a:for(;0<e;e-=1){d=n.slice(0,e).join("/");if(I)for(c=I.length;0<c;c-=1)if(b=j(m,I.slice(0,c).join("/")))if(b=j(b,d)){f=b;
g=e;break a}!h&&(k&&j(k,d))&&(h=j(k,d),i=e)}!f&&h&&(f=h,g=i);f&&(n.splice(0,g,f),a=n.join("/"))}return(f=j(l.pkgs,a))?f:a}function d(a){z&&v(document.getElementsByTagName("script"),function(e){if(e.getAttribute("data-requiremodule")===a&&e.getAttribute("data-requirecontext")===i.contextName)return e.parentNode.removeChild(e),!0})}function g(a){var e=j(l.paths,a);if(e&&H(e)&&1<e.length)return e.shift(),i.require.undef(a),i.require([a]),!0}function u(a){var e,b=a?a.indexOf("!"):-1;-1<b&&(e=a.substring(0,
b),a=a.substring(b+1,a.length));return[e,a]}function m(a,e,b,f){var n,d,g=null,h=e?e.name:null,l=a,m=!0,k="";a||(m=!1,a="_@r"+(M+=1));a=u(a);g=a[0];a=a[1];g&&(g=c(g,h,f),d=j(p,g));a&&(g?k=d&&d.normalize?d.normalize(a,function(a){return c(a,h,f)}):c(a,h,f):(k=c(a,h,f),a=u(k),g=a[0],k=a[1],b=!0,n=i.nameToUrl(k)));b=g&&!d&&!b?"_unnormalized"+(Q+=1):"";return{prefix:g,name:k,parentMap:e,unnormalized:!!b,url:n,originalName:l,isDefine:m,id:(g?g+"!"+k:k)+b}}function q(a){var e=a.id,b=j(k,e);b||(b=k[e]=new i.Module(a));
return b}function r(a,e,b){var f=a.id,n=j(k,f);if(s(p,f)&&(!n||n.defineEmitComplete))"defined"===e&&b(p[f]);else if(n=q(a),n.error&&"error"===e)b(n.error);else n.on(e,b)}function w(a,e){var b=a.requireModules,f=!1;if(e)e(a);else if(v(b,function(e){if(e=j(k,e))e.error=a,e.events.error&&(f=!0,e.emit("error",a))}),!f)h.onError(a)}function x(){S.length&&(ia.apply(A,[A.length,0].concat(S)),S=[])}function y(a){delete k[a];delete W[a]}function F(a,e,b){var f=a.map.id;a.error?a.emit("error",a.error):(e[f]=
!0,v(a.depMaps,function(f,c){var d=f.id,g=j(k,d);g&&(!a.depMatched[c]&&!b[d])&&(j(e,d)?(a.defineDep(c,p[d]),a.check()):F(g,e,b))}),b[f]=!0)}function D(){var a,e,b=(a=1E3*l.waitSeconds)&&i.startTime+a<(new Date).getTime(),f=[],c=[],h=!1,k=!0;if(!X){X=!0;B(W,function(a){var i=a.map,m=i.id;if(a.enabled&&(i.isDefine||c.push(a),!a.error))if(!a.inited&&b)g(m)?h=e=!0:(f.push(m),d(m));else if(!a.inited&&(a.fetched&&i.isDefine)&&(h=!0,!i.prefix))return k=!1});if(b&&f.length)return a=C("timeout","Load timeout for modules: "+
f,null,f),a.contextName=i.contextName,w(a);k&&v(c,function(a){F(a,{},{})});if((!b||e)&&h)if((z||fa)&&!Y)Y=setTimeout(function(){Y=0;D()},50);X=!1}}function E(a){s(p,a[0])||q(m(a[0],null,!0)).init(a[1],a[2])}function K(a){var a=a.currentTarget||a.srcElement,e=i.onScriptLoad;a.detachEvent&&!Z?a.detachEvent("onreadystatechange",e):a.removeEventListener("load",e,!1);e=i.onScriptError;(!a.detachEvent||Z)&&a.removeEventListener("error",e,!1);return{node:a,id:a&&a.getAttribute("data-requiremodule")}}function L(){var a;
for(x();A.length;){a=A.shift();if(null===a[0])return w(C("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));E(a)}}var X,$,i,N,Y,l={waitSeconds:7,baseUrl:"./",paths:{},bundles:{},pkgs:{},shim:{},config:{}},k={},W={},aa={},A=[],p={},T={},ba={},M=1,Q=1;N={require:function(a){return a.require?a.require:a.require=i.makeRequire(a.map)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports?p[a.map.id]=a.exports:a.exports=p[a.map.id]={}},module:function(a){return a.module?
a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){return j(l.config,a.map.id)||{}},exports:a.exports||(a.exports={})}}};$=function(a){this.events=j(aa,a.id)||{};this.map=a;this.shim=j(l.shim,a.id);this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};$.prototype={init:function(a,e,b,f){f=f||{};if(!this.inited){this.factory=e;if(b)this.on("error",b);else this.events.error&&(b=t(this,function(a){this.emit("error",a)}));this.depMaps=a&&a.slice(0);this.errback=
b;this.inited=!0;this.ignore=f.ignore;f.enabled||this.enabled?this.enable():this.check()}},defineDep:function(a,e){this.depMatched[a]||(this.depMatched[a]=!0,this.depCount-=1,this.depExports[a]=e)},fetch:function(){if(!this.fetched){this.fetched=!0;i.startTime=(new Date).getTime();var a=this.map;if(this.shim)i.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],t(this,function(){return a.prefix?this.callPlugin():this.load()}));else return a.prefix?this.callPlugin():this.load()}},load:function(){var a=
this.map.url;T[a]||(T[a]=!0,i.load(this.map.id,a))},check:function(){if(this.enabled&&!this.enabling){var a,e,b=this.map.id;e=this.depExports;var f=this.exports,c=this.factory;if(this.inited)if(this.error)this.emit("error",this.error);else{if(!this.defining){this.defining=!0;if(1>this.depCount&&!this.defined){if(G(c)){if(this.events.error&&this.map.isDefine||h.onError!==da)try{f=i.execCb(b,c,e,f)}catch(d){a=d}else f=i.execCb(b,c,e,f);this.map.isDefine&&void 0===f&&((e=this.module)?f=e.exports:this.usingExports&&
(f=this.exports));if(a)return a.requireMap=this.map,a.requireModules=this.map.isDefine?[this.map.id]:null,a.requireType=this.map.isDefine?"define":"require",w(this.error=a)}else f=c;this.exports=f;if(this.map.isDefine&&!this.ignore&&(p[b]=f,h.onResourceLoad))h.onResourceLoad(i,this.map,this.depMaps);y(b);this.defined=!0}this.defining=!1;this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}else this.fetch()}},callPlugin:function(){var a=
this.map,b=a.id,d=m(a.prefix);this.depMaps.push(d);r(d,"defined",t(this,function(f){var d,g;g=j(ba,this.map.id);var J=this.map.name,u=this.map.parentMap?this.map.parentMap.name:null,p=i.makeRequire(a.parentMap,{enableBuildCallback:!0});if(this.map.unnormalized){if(f.normalize&&(J=f.normalize(J,function(a){return c(a,u,!0)})||""),f=m(a.prefix+"!"+J,this.map.parentMap),r(f,"defined",t(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),g=j(k,f.id)){this.depMaps.push(f);
if(this.events.error)g.on("error",t(this,function(a){this.emit("error",a)}));g.enable()}}else g?(this.map.url=i.nameToUrl(g),this.load()):(d=t(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),d.error=t(this,function(a){this.inited=!0;this.error=a;a.requireModules=[b];B(k,function(a){0===a.map.id.indexOf(b+"_unnormalized")&&y(a.map.id)});w(a)}),d.fromText=t(this,function(f,c){var g=a.name,J=m(g),k=O;c&&(f=c);k&&(O=!1);q(J);s(l.config,b)&&(l.config[g]=l.config[b]);try{h.exec(f)}catch(j){return w(C("fromtexteval",
"fromText eval for "+b+" failed: "+j,j,[b]))}k&&(O=!0);this.depMaps.push(J);i.completeLoad(g);p([g],d)}),f.load(a.name,p,d,l))}));i.enable(d,this);this.pluginMaps[d.id]=d},enable:function(){W[this.map.id]=this;this.enabling=this.enabled=!0;v(this.depMaps,t(this,function(a,b){var c,f;if("string"===typeof a){a=m(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap);this.depMaps[b]=a;if(c=j(N,a.id)){this.depExports[b]=c(this);return}this.depCount+=1;r(a,"defined",t(this,function(a){this.defineDep(b,
a);this.check()}));this.errback&&r(a,"error",t(this,this.errback))}c=a.id;f=k[c];!s(N,c)&&(f&&!f.enabled)&&i.enable(a,this)}));B(this.pluginMaps,t(this,function(a){var b=j(k,a.id);b&&!b.enabled&&i.enable(a,this)}));this.enabling=!1;this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]);c.push(b)},emit:function(a,b){v(this.events[a],function(a){a(b)});"error"===a&&delete this.events[a]}};i={config:l,contextName:b,registry:k,defined:p,urlFetched:T,defQueue:A,Module:$,makeModuleMap:m,
nextTick:h.nextTick,onError:w,configure:function(a){a.baseUrl&&"/"!==a.baseUrl.charAt(a.baseUrl.length-1)&&(a.baseUrl+="/");var b=l.shim,c={paths:!0,bundles:!0,config:!0,map:!0};B(a,function(a,b){c[b]?(l[b]||(l[b]={}),V(l[b],a,!0,!0)):l[b]=a});a.bundles&&B(a.bundles,function(a,b){v(a,function(a){a!==b&&(ba[a]=b)})});a.shim&&(B(a.shim,function(a,c){H(a)&&(a={deps:a});if((a.exports||a.init)&&!a.exportsFn)a.exportsFn=i.makeShimExports(a);b[c]=a}),l.shim=b);a.packages&&v(a.packages,function(a){var b,
a="string"===typeof a?{name:a}:a;b=a.name;a.location&&(l.paths[b]=a.location);l.pkgs[b]=a.name+"/"+(a.main||"main").replace(ja,"").replace(R,"")});B(k,function(a,b){!a.inited&&!a.map.unnormalized&&(a.map=m(b))});if(a.deps||a.callback)i.require(a.deps||[],a.callback)},makeShimExports:function(a){return function(){var b;a.init&&(b=a.init.apply(ca,arguments));return b||a.exports&&ea(a.exports)}},makeRequire:function(a,e){function g(f,c,d){var j,l;e.enableBuildCallback&&(c&&G(c))&&(c.__requireJsBuild=
!0);if("string"===typeof f){if(G(c))return w(C("requireargs","Invalid require call"),d);if(a&&s(N,f))return N[f](k[a.id]);if(h.get)return h.get(i,f,a,g);j=m(f,a,!1,!0);j=j.id;return!s(p,j)?w(C("notloaded",'Module name "'+j+'" has not been loaded yet for context: '+b+(a?"":". Use require([])"))):p[j]}L();i.nextTick(function(){L();l=q(m(null,a));l.skipMap=e.skipMap;l.init(f,c,d,{enabled:!0});D()});return g}e=e||{};V(g,{isBrowser:z,toUrl:function(b){var e,d=b.lastIndexOf("."),g=b.split("/")[0];if(-1!==
d&&(!("."===g||".."===g)||1<d))e=b.substring(d,b.length),b=b.substring(0,d);return i.nameToUrl(c(b,a&&a.id,!0),e,!0)},defined:function(b){return s(p,m(b,a,!1,!0).id)},specified:function(b){b=m(b,a,!1,!0).id;return s(p,b)||s(k,b)}});a||(g.undef=function(b){x();var c=m(b,a,!0),e=j(k,b);d(b);delete p[b];delete T[c.url];delete aa[b];U(A,function(a,c){a[0]===b&&A.splice(c,1)});e&&(e.events.defined&&(aa[b]=e.events),y(b))});return g},enable:function(a){j(k,a.id)&&q(a).enable()},completeLoad:function(a){var b,
c,f=j(l.shim,a)||{},d=f.exports;for(x();A.length;){c=A.shift();if(null===c[0]){c[0]=a;if(b)break;b=!0}else c[0]===a&&(b=!0);E(c)}c=j(k,a);if(!b&&!s(p,a)&&c&&!c.inited){if(l.enforceDefine&&(!d||!ea(d)))return g(a)?void 0:w(C("nodefine","No define call for "+a,null,[a]));E([a,f.deps||[],f.exportsFn])}D()},nameToUrl:function(a,b,c){var f,d,g;(f=j(l.pkgs,a))&&(a=f);if(f=j(ba,a))return i.nameToUrl(f,b,c);if(h.jsExtRegExp.test(a))f=a+(b||"");else{f=l.paths;a=a.split("/");for(d=a.length;0<d;d-=1)if(g=a.slice(0,
d).join("/"),g=j(f,g)){H(g)&&(g=g[0]);a.splice(0,d,g);break}f=a.join("/");f+=b||(/^data\:|\?/.test(f)||c?"":".js");f=("/"===f.charAt(0)||f.match(/^[\w\+\.\-]+:/)?"":l.baseUrl)+f}return l.urlArgs?f+((-1===f.indexOf("?")?"?":"&")+l.urlArgs):f},load:function(a,b){h.load(i,a,b)},execCb:function(a,b,c,d){return b.apply(d,c)},onScriptLoad:function(a){if("load"===a.type||ka.test((a.currentTarget||a.srcElement).readyState))P=null,a=K(a),i.completeLoad(a.id)},onScriptError:function(a){var b=K(a);if(!g(b.id))return w(C("scripterror",
"Script error for: "+b.id,a,[b.id]))}};i.require=i.makeRequire();return i}var h,x,y,D,K,E,P,L,q,Q,la=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ma=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,R=/\.js$/,ja=/^\.\//;x=Object.prototype;var M=x.toString,ga=x.hasOwnProperty,ia=Array.prototype.splice,z=!!("undefined"!==typeof window&&"undefined"!==typeof navigator&&window.document),fa=!z&&"undefined"!==typeof importScripts,ka=z&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,
Z="undefined"!==typeof opera&&"[object Opera]"===opera.toString(),F={},r={},S=[],O=!1;if("undefined"===typeof define){if("undefined"!==typeof requirejs){if(G(requirejs))return;r=requirejs;requirejs=void 0}"undefined"!==typeof require&&!G(require)&&(r=require,require=void 0);h=requirejs=function(b,c,d,g){var u,m="_";!H(b)&&"string"!==typeof b&&(u=b,H(c)?(b=c,c=d,d=g):b=[]);u&&u.context&&(m=u.context);(g=j(F,m))||(g=F[m]=h.s.newContext(m));u&&g.configure(u);return g.require(b,c,d)};h.config=function(b){return h(b)};
h.nextTick="undefined"!==typeof setTimeout?function(b){setTimeout(b,4)}:function(b){b()};require||(require=h);h.version="2.1.11";h.jsExtRegExp=/^\/|:|\?|\.js$/;h.isBrowser=z;x=h.s={contexts:F,newContext:ha};h({});v(["toUrl","undef","defined","specified"],function(b){h[b]=function(){var c=F._;return c.require[b].apply(c,arguments)}});if(z&&(y=x.head=document.getElementsByTagName("head")[0],D=document.getElementsByTagName("base")[0]))y=x.head=D.parentNode;h.onError=da;h.createNode=function(b){var c=
b.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script");c.type=b.scriptType||"text/javascript";c.charset="utf-8";c.async=!0;return c};h.load=function(b,c,d){var g=b&&b.config||{};if(z)return g=h.createNode(g,c,d),g.setAttribute("data-requirecontext",b.contextName),g.setAttribute("data-requiremodule",c),g.attachEvent&&!(g.attachEvent.toString&&0>g.attachEvent.toString().indexOf("[native code"))&&!Z?(O=!0,g.attachEvent("onreadystatechange",b.onScriptLoad)):
(g.addEventListener("load",b.onScriptLoad,!1),g.addEventListener("error",b.onScriptError,!1)),g.src=d,L=g,D?y.insertBefore(g,D):y.appendChild(g),L=null,g;if(fa)try{importScripts(d),b.completeLoad(c)}catch(j){b.onError(C("importscripts","importScripts failed for "+c+" at "+d,j,[c]))}};z&&!r.skipDataMain&&U(document.getElementsByTagName("script"),function(b){y||(y=b.parentNode);if(K=b.getAttribute("data-main"))return q=K,r.baseUrl||(E=q.split("/"),q=E.pop(),Q=E.length?E.join("/")+"/":"./",r.baseUrl=
Q),q=q.replace(R,""),h.jsExtRegExp.test(q)&&(q=K),r.deps=r.deps?r.deps.concat(q):[q],!0});define=function(b,c,d){var g,h;"string"!==typeof b&&(d=c,c=b,b=null);H(c)||(d=c,c=null);!c&&G(d)&&(c=[],d.length&&(d.toString().replace(la,"").replace(ma,function(b,d){c.push(d)}),c=(1===d.length?["require"]:["require","exports","module"]).concat(c)));if(O){if(!(g=L))P&&"interactive"===P.readyState||U(document.getElementsByTagName("script"),function(b){if("interactive"===b.readyState)return P=b}),g=P;g&&(b||
(b=g.getAttribute("data-requiremodule")),h=F[g.getAttribute("data-requirecontext")])}(h?h.defQueue:S).push([b,c,d])};define.amd={jQuery:!0};h.exec=function(b){return eval(b)};h(r)}})(this);

(function(){

function loadJs(src, success) {
  if (Valley.isInClient()) {
    var script = document.createElement('script');
    script.src = src + '.js';
    // Valley._config.client + src + '.js';
    script.onload = function() {
      success && success();
    };
    if (document.body) {
      document.body.appendChild(script);
    } else {
      window.onload = function() {
        document.body.appendChild(script);
      };
    }
  } else {
    // require(Valley._config.server + src);
    require(src);
    success && success();
  }
};

function loadJsList(list, success){
  var mark = list.length;
  list.forEach(function(src, index) {
    var src = Valley._config.endPath + src;
    loadJs(src, function(){
      mark --;
      if (mark <= 0) {
        success && success();
      }
    });
  });
};

var Valley = function(config, prototypeConfig, Parent) {
  return this.fn(config, prototypeConfig, Parent);
};

Valley._config = {
};


Valley.define = function(deps, callback){
  return define(deps, callback);
};

Valley.isInClient = function(){
  return global === global.window;
};

String.prototype.toConf = function() {
  return this.replace(/\[(\w+)\]|\<(\w+)\>/, function($0, $1, $2){
    if ($1) {
      return Valley._config[$1];
    } else {
      return global[$2];
    }
  });
};

Valley.setConfig = function(config) {
  var i;
  var pathConfig = config.pathConfig || {};
  var basicConfig = config.basicConfig || {};
  if (this.isInClient()) {
    this._config.root = (config.client || {}).root.toConf();
    this._config.plugins = (config.client || {}).plugins;
  } else {
    this._config.root = (config.server || {}).root.toConf();
  }
  for (i in pathConfig) {
    this._config[i] = pathConfig[i].toConf();
  }
  for (i in basicConfig) {
    this._config[i] = basicConfig[i].toConf();
  }
  this._config.urlRules = config.urlRules || {};
  this._config.containerNode = config.containerNode;
};

Valley.prepares = function() {
};

Valley.init = function(config) {
  config && Valley.setConfig(config);
  console.log(this._config);
  if (!this._config.root) {
    if (this.isInClient()) {
      this._config.root = '/';
    } else {
      this._config.root = __dirname + '/';
    }
  }
  if (!this._config.webPath) {
    this._config.webPath = this._config.root + 'web/';
  }
  if (!this._config.conPath) {
    this._config.conPath = this._config.webPath + 'controllers/';
  }
  if (!this._config.viewPath) {
    this._config.viewPath = this._config.webPath + 'views/';
  }
  if (!this._config.vjsPath) {
    this._config.vjsPath = this._config.root + 'valleyjs/';
  }
  if (!this._config.client) {
    this._config.client = this._config.vjsPath + 'client/';
  }
  if (!this._config.server) {
    this._config.server = this._config.vjsPath + 'server/';
  }
  if (!this._config.viewExt) {
    this._config.viewExt = '.html';
  }
  if (!this._config.fileEncoding) {
    this._config.fileEncoding = 'utf8';
  }

  this._config.endPath = this._config.client;

  Valley.prepares();
  Valley.run();
};

var containerNode;

Valley.showPage = function(path, params) {
  var path = path || this._config.urlRules[path] || '';
  // var containerNode = this.containerNode;
  require([
    Valley._config.conPath + path + '.js'
  ], function(con){
    con.reqUrl = (location.hash || '#').substr(1);
    var data = con.render().then(function(html){
      containerNode.className = 'vbody-' + con.pageId;
      containerNode.innerHTML = html;
      con.afterRender();
    });
  });
};

Valley.route = function(url) {
  var url = url || (location.hash || '#').substr(1);
  return this.parseURL(url);
};

Valley.prepares = function() {
  require.config({
    baseUrl: Valley._config.root
  });
};

Valley.run = function() {
  var urlInfo = Valley.route();
  containerNode = this._config.client.containerNode || document.body;
  Valley.showPage(urlInfo.path, urlInfo.params);
};

Valley.setHash = function(path, params) {
  var str = this.encodeURIJson(params);
  if (path) {
    location.hash = path + (str ? ('?' + str) : '');
  } else {
    location.hash = str;
  }
};

Valley.changeHash = function(path, params) {
  var info = this.hashInfo();
  var path = path || info.path;
  var params = params || info.params;
  if (typeof path === 'object') {
    params = path;
    path = info.path;
  }
  var newParams = this.extend(info.params, params);
  $.setHash(path, newParams);
  return newParams;
};


function bindChangeEvent() {
  var mark = null;
  window.onhashchange = function(){
    if (mark) {
      window.clearTimeout(mark);
      mark = null;
    }
    mark = window.setTimeout(function(){
      Valley.run();
    }, 100);
  };
}

Valley.ajax = function(path, method, data, setting){
  var apiConfig = this._apiConfig;
  var method = method || 'GET';
  var url = apiConfig.origin + path;
  var sendData = Valley.encodeURIJson(data || {});
  if (method === 'GET' && sendData) {
    path += '?' + sendData;
  }
  var options = this.extend({
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Content-Length': method === 'GET' ? 0 : sendData.length
    },
    dataType: 'json',
    credentials: 'include',
    mode: 'cors'
  }, setting || {});
  if (method === 'POST' && sendData) {
    options.body = sendData;
  }
  return fetch(url, options).then(function(res){
    if (options.dataType === 'json') {
      var json = res.json();
      return Promise.resolve(json);
    } else {
      return res.text();
    }
  });
};

Valley._apiConfig = {
  host: '127.0.0.1',
  port: '3007',
  protocol: 'http:',
  origin: ''
};

Valley.setOrigin = function() {
  this._apiConfig.origin = [
    this._apiConfig.protocol,
    '://',
    this._apiConfig.host,
    ':',
    this._apiConfig.port].join('');
  return this._apiConfig.origin;
}

Valley.setAjaxConfig = function(config) {
  this.apiConfig = this.extend(this.apiConfig, config || {});
  this.setOrigin();
};

Valley.post = function(path, data, setting){
  return this.ajax(path, 'POST', data, setting);
};

Valley.get = function(path, data, setting){
  return this.ajax(path, 'GET', data, setting);
};

Valley.core_push = Array.prototype.push;
Valley.core_slice = Array.prototype.slice;
Valley.core_indexOf = Array.prototype.indexOf;
Valley.core_toString = Object.prototype.toString;
Valley.core_hasOwn = Object.prototype.hasOwnProperty;
Valley.core_trim = String.prototype.trim;

Valley.extend = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !Valley.isFunction(target) ) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if ( length === i ) {
    target = this;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( Valley.isPlainObject(copy) || (copyIsArray = Valley.isArray(copy)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && Valley.isArray(src) ? src : [];

          } else {
            clone = src && Valley.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = Valley.extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

Valley.getFileContent = function(filePath, encoding) {
  var encoding = encoding || 'utf8';
  return fetch(filePath, {
    headers: {
      "Content-Type": "text/html"
    }
  }).then(function(res){
    return res.text();
  });
};

Valley.queue = function(list, data, scope){
  var scope = scope || global;
  var promise = Promise.resolve(data || {});
  list.forEach(function(func, index){
    promise = promise.then(function(data){
      return func.call(scope, data, index);
    });
  });
  return promise;
};

Valley.parallel = function(list, data, scope){
  var scope = scope || global;
  var promise = Promise.resolve(data || {});
  var resArr = [];
  list.forEach(function(func, index){
    var res = func.call(scope, data, index);
    resArr.push(res);
  });
  return Promise.all(resArr);
}

Valley.process = function(list, data, scope){
  var self = this;
  var scope = scope || global;
  var promise = Promise.resolve(data || {});
  list.forEach(function(func, index){
    promise = promise.then(function(data){
      if (self.isFunction(func)) {
        func = [func];
      }
      return self.parallel(func, data, scope);
    });
  });
  return promise;
};

var DefaultTPL = 'Y-M-D H:I:S';

Valley.timestr = function(tpl, timestamp) {
  if (arguments.length === 0) {
    tpl = DefaultTPL;
  }
  if (typeof tpl === 'number') {
    timestamp = tpl;
    tpl = DefaultTPL;
  }
  var date;
  if (!timestamp) {
    date = new Date();
  } else if (timestamp.toString().length === 10) {
    date = new Date(timestamp * 1000);
  } else {
    date = new Date(timestamp);
  }
  var tpl = tpl || DefaultTPL;
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var obj = {
    'Y': date.getFullYear(),
    'y': date.getYear(),
    'M': month < 10 ? ('0' + month) : month,
    'm': month,
    'D': day < 10 ? ('0' + day) : day,
    'd': day,
    'H': hour < 10 ? ('0' + hour) : hour,
    'h': hour,
    'I': minute < 10 ? ('0' + minute) : minute,
    'i': minute,
    'S': second < 10 ? ('0' + second) : second,
    's': second
  };
  return tpl.replace(/([YMDHISymdhis])/g, function(){
    return obj[arguments[1]];
  });
};

Valley.getTplContent = function(tplId, tplPath) {
  if (this.tplObj[tplId]) {
    return Promise.resolve(this.tplObj[tplId]);
  }
  var viewPath = tplPath || this._config.viewPath;
  var viewExt = this._config.viewExt || '.html';
  var viewUrl = viewPath + tplId + viewExt;
  return this.getFileContent(viewUrl).then(function(template){
    Valley.tplObj[tplId] = template;
    return template;
  });
};

Valley.tplObj = {};

// Valley.tplPath = './';// valley sprintf
var rStr = /%s/g;
var rDStr = /%(\d+)\$s/g;

function sprintf() {
  if (arguments.length < 2) {
    throw 'Too few arguments';
  }
  var tpl = arguments[0];
  var args, arg;
  var res;
  if (typeof arguments[1] === 'array') {
    args = arguments[1];
  } else {
    args = Array.prototype.slice.call(arguments, 1);
  }
  if (args.length <= 0) {
    throw 'Too few arguments';
  }
  res = tpl.replace(rDStr, function($0, $1){
    var index = $1 - 1;
    if (args[index]) {
      return args[index];
    } else {
      throw 'Too few arguments';
    }
  });
  var arr = res.match(rStr) || [];
  if (args.length === 1) {
    return res.replace(rStr, args[0]);
  } else if (arr.length > args.length) {
      throw 'Too few arguments';
  }
  return res.replace(/%s/g, function(){
    return args.shift();
  });
}

Valley.sprintf = sprintf;function getIncludeList(templateContent) {
  var includeList = [];
  var res;
  var rPluginTpl = /\{(?:include|require)\s+([^{}]+)\}/g;
  while (res = rPluginTpl.exec(templateContent)) {
    if (!res[1]) {
      continue;
    }
    var arr = res[1].split(/\s+/g);
    arr[0] && includeList.push(arr[0]);
  }
  return includeList;
};

Valley.initTplObj = function(mainTid) {
  var self = this;
  return this.getTplContent(mainTid).then(function(template){
    var includeList = getIncludeList(template);
    var jobs = [];
    includeList.forEach(function(includeId, index){
      if (!self.tplObj[includeId]) {
        jobs.push(self.getTplContent(includeId));
      }
    });
    return Promise.all(jobs).then(function(){
      return self.tplObj;
    });
  });
};

var rInclude = /\{include\s+([^{}]+)\}/g;
var rRequire = /\{require\s+([^{}]+)\}/g;
var rIncludeFile = /file=('|")([^'"]+)\1/;
var rValue = /^("|')([^'"]+)\1$/;
var rComment = /\{\/\*([\r\n]|.)*?\*\/\}/;

var stringTpl = 'vtmpArr.push(\'%s\');';
var variableTpl = 'vtmpArr.push(%s);';
var assignTpl = 'var %s = vtmpInput.%s;';

function tplToFuncStr(tplId, tplObj) {
  var tplObj = tplObj || Valley.tplObj;
  var template = tplObj[tplId]
                    .replace(rComment, '')
                    .replace(rRequire, function($0, $1){
                      return tplObj[$1];
                    })
                    .replace(/[\r\n]+/g, ' ');
  var res,
      start = 0,
      mark = 0,
      tags = [],
      str,
      content,
      rTag = /\{([^{}]+)\}/g,
      tagInfo,
      tags = ['var vtmpArr = [];'],
      funcStr;
  var iarr, itid, itpl, itmp, idata, iarr, ifunstr;
  while(res = rTag.exec(template)) {
    start = res.index;
    content = res[0];
    tagInfo = res[1];
    if (mark < res.index) {
      str = template.substring(mark, start);
      if (str.trim()) {
        tags.push(sprintf(stringTpl, str));
      }
    }
    if (tagInfo) {
      tagArr = tagInfo.split(/\s+/g);
      switch(tagArr[0]) {
      case 'include':
        iarr = tagInfo.replace(/include\s+/, '').split(/\s+/g);
        itid = iarr.shift();
        ifunstr = tplToFuncStr(itid, tplObj);
        idata = iarr;
        itmp = '';
        iarr = [];
        idata.forEach(function(item){
          var arr = item.split('=');
          if (arr.length >= 2) {
            var key = arr[0];
            iarr.push(key + ':' + arr[1]);
            itmp += sprintf(assignTpl, key, key);
          }
        });
        itpl = 'var vtmpFunc = function(vtmpInput){'
             +   itmp
             +   'var vtmpFunc = ' + ifunstr
             +   ';return vtmpFunc.call(this);'
             + '};'
             + 'vtmpArr.push(vtmpFunc.call(this, Object.assign(vtmpInput, {' + iarr.join(',') + '})));';
        tags.push(itpl);
        break;
      case 'if':
      case 'for':
        tags.push(tagInfo + '{');
        break;
      case 'else':
        tags.push('}' + tagInfo + '{');
        break;
      case 'elseif':
        tags.push('} else if ' + tagInfo.replace(/elseif/, '') + '{');
        break;
      case '/if':
      case '/for':
        tags.push('}');
        break;
      case 'js':
        tags.push(tagInfo.replace(/js /, '') + ';');
        break;
      default:
        tags.push(sprintf(variableTpl, tagInfo));
      }
    }
    mark = start + content.length;
  }
  if (mark < template.length) {
    tags.push(sprintf(stringTpl, template.substring(mark)));
  }
  tags.push('return vtmpArr.join("");');
  return 'function(){' + tags.join('\n') + '}';
}

function runTplAsFunction(funcStr, data, scope, returnString) {
  var funcList = [];
  Object.keys(data).forEach(function(key){
    funcList.push(sprintf(assignTpl, key, key));
  });
  funcList.push('var vtmpFunction = ' + funcStr);
  // funcList.push(';return vtmpFunction.call(this);');
  funcList.push(';try{return vtmpFunction.call(this);}catch(e){console.log(e);}');
  var func = new Function('vtmpInput', funcList.join(''));
  return returnString ? func : func.call(scope, data);
}

Valley.vtpl = function(mainTid, data, scope) {
  var scope = scope || global;
  var funcStr = tplToFuncStr(mainTid, this.tplObj);
  var html = runTplAsFunction(funcStr, data, scope);
  return html;
};

Valley.tpl = function(mainTid, data, scope) {
  var self = this;
  var scope = scope || global;
  return this.initTplObj(mainTid).then(function(){
    return self.vtpl(mainTid, data, scope);
  });
};

var class2type = {};
[
  'Boolean',
  'Number',
  'String',
  'Function',
  'Array',
  'Date',
  'RegExp',
  'Object'
].forEach(function(name, i){
  class2type["[object " + name + "]"] = name.toLowerCase();
});

Valley.isWindow = function(obj) {
  if (module) {
    return false;
  }
  return obj != null && obj == obj.window;
}

Valley.isNumeric = function(obj) {
  return !isNaN(parseFloat(obj)) && isFinite(obj);
};

Valley.type = function(obj) {
  return obj == null ?
    String(obj) :
    class2type[Valley.core_toString.call(obj)] || "object";
};

Valley.isString = function(obj) {
  return Valley.type(obj) === 'string';
};

Valley.isArray = function(obj) {
  return Valley.type(obj) === 'array';
};

Valley.isFunction = function(obj) {
  return Valley.type(obj) === 'function';
}

Valley.isPlainObject = function(obj) {
  if (!obj
      || Valley.type(obj) !== 'object'
      || obj.nodeType
      || Valley.isWindow(obj)) {
    return false;
  }
  try {
    if (obj.constructor
        && !Valley.core_hasOwn.call(obj, "constructor")
        && !Valley.core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
      return false;
    }
  } catch(e) {
    return false;
  }
  var key;
  for (key in obj) {}

  return key === undefined || Valley.core_hasOwn.call(obj, key);
};

Valley.isEmptyObject = function(obj) {
  var name;
  for (name in obj) {
    return false;
  }
  return true;
};

Valley.isInClient = function() {
  return module === 'ValleyJsOnBrowser';
};

Valley.queryUrl = function(url, key) {
  var url = url || '';
  url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //去除网址与hash信息
  var json = {};
  //考虑到key中可能有特殊符号如“[].”等，而[]却有是否被编码的可能，所以，牺牲效率以求严谨，就算传了key参数，也是全部解析url。
  url.replace(/(^|&)([^&=]+)=([^&]*)/g, function(a, b, key, value) {
    //对url这样不可信的内容进行decode，可能会抛异常，try一下；另外为了得到最合适的结果，这里要分别try
    try {
      key = decodeURIComponent(key);
      value = decodeURIComponent(value);
    } catch (e) {}

    if (!(key in json)) {
      json[key] = /\[\]$/.test(key) ? [value] : value;
      //如果参数名以[]结尾，则当作数组
    } else if (json[key] instanceof Array) {
      json[key].push(value);
    } else {
      json[key] = [json[key], value];
    }
  });
  return key ? json[key] : json;
};

Valley.encodeURIJson = function(json) {
  var s = [];
  for (var p in json) {
    if (json[p] == null) {
      continue;
    }
    if (json[p] instanceof Array) {
      for (var i = 0; i < json[p].length; i++) {
        s.push(encodeURIComponent(p)
            + '='
            + encodeURIComponent(json[p][i]));
      }
    } else {
      s.push((p) + '=' + encodeURIComponent(json[p]));
    }
  }
  return s.join('&');
};

/**
 * Parse url
 *    path?params1&params2
 *    path
 *    param1&param2
 */
Valley.parseURL = function(url) {
  var queryIndex = url.indexOf('?');
  var path, paramsStr;
  if (queryIndex >= 0) {
    path = url.substring(0, queryIndex);
    paramStr = url.substring(queryIndex + 1);
  } else if (url.match(/[=#]/)) {
    path = '';
    paramStr = url;
  } else {
    path = url;
    paramStr = '';
  }
  return {
    path: path,
    params: this.queryUrl(paramStr)
  };
};

Valley._processConfig = [
  'beforeRequest',
  'afterRequest',
  'beforeRender',
  'renderPage',
  'afterRenderPage'
];

Valley.setProcessConfig = function(configArr) {
  var arr = [];
  var item;
  configArr.forEach(function(config, index){
    var fname = config.name;
    var zIndex = config.zIndex;
    var item = arr[zIndex];
    if (Valley.isString(item)) {
      item = [item, fname];
    } else if (Valley.isArray(item)) {
      item.push(fname);
    } else {
      item = fname;
    }
    arr[zIndex] = item;
  });
  Valley._processConfig = arr.filter(function(item){
    return item;
  });
};

Valley.initConProcess = function(list, con) {
  var funcList = [];
  list.forEach(function(fname, index){
    var item;
    if (Valley.isArray(fname)) {
      item = [];
      fname.forEach(function(name, i){
        con[name] && item.push(con[name]);
      });
    } else {
      con[fname] && (item = con[fname]);
    }
    item && funcList.push(item);
  });
  return funcList;
};

var Controller = function(config) {
  this._data = {};
  this.config = config || {};
  this.eventObj = this.config.eventObj || {};
};

Valley.extend(Controller.prototype, {
  rFunList: [],
  init: function() {
    this.pageId = this.config.pageId;
    this.rFunList = Valley.initConProcess(Valley._processConfig, this);
    this._bind();
  },
  renderFailPage: function() {
    console.log('fail');
  },
  render: function() {
    var self = this;
    return Valley.process(this.rFunList, arguments, this).then(function(res){
      return res[0];
    }, function(reason){
      return self.renderFailPage(reason);
    });
  },
  renderPage: function() {
    var tplName = tplName || this.pageId;
    return this.renderSimplePage(tplName);
    // return 'hello world : ' + JSON.stringify(this.params);
  },
  renderSimplePage: function(tplName) {
    var tplName = tplName || this.pageId;
    return Valley.getView(tplName);
  },
  renderTpl: function(data, tplName) {
    var tplName = tplName || this.pageId;
    var data = data || {};
    var scope = this;
    return Valley.getView(tplName).then(function(tpl){
      var html = Valley.tpl(tpl, data, scope);
      return html;
    });
  },
  renderPageByUrl: function(path, params, tplName) {
    var tplName = tplName || this.pageId;
    var tplPromise = Valley.initTplObj(tplName);
    var dataPromise = Valley.get(path, params);
    var con = this;
    return Promise.all([tplPromise, dataPromise]).then(function(res){
      var tpl = res[0];
      var data = res[1];
      var html = Valley.vtpl(tplName, data, con._data);
      return html;
    });
  },
  afterRender: function(){
  },
  _bind: function() {
    this.bind && this.bind();
    this.conSelector = '.vbody-' + this.pageId;
    // $(document.body).delegates(this.eventObj, this.conSelector);
  }
});

Controller.extend = function(prototypeObj, Parent) {
  var Parent = Parent || Controller;
  var prototypeObj = prototypeObj || {};
  var Child = function(config) {
    this.method = Parent;
    this.method.call(this, config || {});
    delete this.method;
  };
  var bridge = new Parent();
  Child.prototype = Valley.extend(bridge, prototypeObj);
  return Child;
};

Valley.prototype.fn = function(config, prototypeObj, Parent) {
  var Parent = Parent || Controller;
  var Child = Controller.extend(prototypeObj, Parent);
  var child = new Child(config);
  child.init();
  return child;
};

bindChangeEvent();

global = this;
global.Valley = Valley;
global.Controller = Controller;
global.module = 'ValleyJsOnBrowser';

}());
