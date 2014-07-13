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

  test('#_getFuncArgs', function() {
    var args = Nozzle._getFuncArgs(function(f1, f2,f3, f4,f5, f6) {
        return '';
    });
    assert.equal(args.length, 6);
    assert.equal(args[0], 'f1');
    assert.equal(args[1], 'f2');
    assert.equal(args[2], 'f3');
    assert.equal(args[3], 'f4');
    assert.equal(args[4], 'f5');
    assert.equal(args[5], 'f6');

    args = Nozzle._getFuncArgs(function(){});
    assert.equal(args.length, 0);

    args = Nozzle._getFuncArgs(function(      ) {});
    assert.equal(args.length, 0);
  });
});
