var assert = require("assert");
var Nozzle = require("../nozzle.js")

suite('Internal', function() {
  test('#_parseDependencies', function() {
    var parse = Nozzle.prototype._parseDependencies;
    var f1 = function(a1, a2, a3) {};
    var deps = parse(f1, 'type');
    assert.equal('type', deps.type);
    assert.equal(f1, deps.func);
    assert.equal('a1', deps.dependencies[0]);
    assert.equal('a2', deps.dependencies[1]);
    assert.equal('a3', deps.dependencies[2]);
  });  
});
