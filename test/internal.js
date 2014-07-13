var assert = require("assert");
var Nozzle = require("../nozzle.js")

suite('Internal', function() {
  test('#_parseDependencies', function() {
    var parse = Nozzle._parseDependencies;
    var f1 = function(a1, a2, a3) {};
    var deps = parse(f1, 'type');
    assert.equal(deps.type, 'type');
    assert.equal(deps.func, f1);
    assert.equal(deps.dependencies.length, 3);
    assert.equal(deps.dependencies[0], 'a1');
    assert.equal(deps.dependencies[1], 'a2');
    assert.equal(deps.dependencies[2], 'a3');

    var f2 = ['a4', 'a5', function(b4, b5){}];
    deps = parse(f2, 'type2');
    assert.equal(deps.type, 'type2');
    assert.equal(deps.func, f2[2]);
    assert.equal(deps.dependencies.length, 2);
    assert.equal(deps.dependencies[0], 'a4');
    assert.equal(deps.dependencies[1], 'a5');

    var f3 = function() {
      return 1;
    };
    deps = parse(f3, 'type3');
    assert.equal(deps.type, 'type3');
    assert.equal(deps.func, f3);
    assert.equal(deps.dependencies.length, 0);

    var f4 = ['a4', 1, {}, function() {}];
    assert.throws(function() {
      parse(f4);
    },
    /not injectable/)
  });

  test('#_isInjectable', function() {
    assert.ok(Nozzle._isInjectable(function(f1, f2, f3) {}));
    assert.ok(Nozzle._isInjectable(['f1', 'f2', 'f3', function(f1, f2, f3) {}]));
    assert.ok(!Nozzle._isInjectable(['f1', 'f2', 'f3', 'f4', function(f1, f2, f3) {}]));
    assert.ok(!Nozzle._isInjectable(['f1', 'f2', 'f3', 'f4']));
    assert.ok(!Nozzle._isInjectable({}));
    assert.ok(!Nozzle._isInjectable(3.14157));
  });
});
