Valley.define([], function(){
  return Valley.isInClient() ? '../client' : '../server';
});