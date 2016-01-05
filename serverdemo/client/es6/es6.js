var deps = [];
global.fetch || deps.push('./fetch');
global.Promise || deps.push('./promise-jquery');

Valley.define(deps, function(){}, module);