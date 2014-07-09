var assert = require("assert");
var Nozzle = require("../nozzle.js")

suite('Internal', function() {
  test('#_parseDependencies', function() {
    var parse = Nozzle.prototype._parseDependencies;
    var f1 = function(a1, a2, a3) {};
    var deps = parse(f1, 'type');
    assert.equal('type', deps.type);
    assert.equal(f1, deps.func);
    assert.equal(3, deps.dependencies.length);
    assert.equal('a1', deps.dependencies[0]);
    assert.equal('a2', deps.dependencies[1]);
    assert.equal('a3', deps.dependencies[2]);

    var f2 = ['a4', 'a5', function(b4, b5){}];
    deps = parse(f2, 'type2');
    assert.equal('type2', deps.type);
    assert.equal(f2[2], deps.func);
    assert.equal(2, deps.dependencies.length);
    assert.equal('a4', deps.dependencies[0]);
    assert.equal('a5', deps.dependencies[1]);

    var f3 = function() {
      return 1;
    };
    deps = parse(f3, 'type3');
    assert.equal('type3', deps.type);
    assert.equal(f3, deps.func);
    assert.equal(0, deps.dependencies.length);
  });
});
