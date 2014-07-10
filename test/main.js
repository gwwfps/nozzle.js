var assert = require("assert");
var Nozzle = require("../nozzle.js")

suite('Main', function() {
  test('#factory', function() {
    var nozzle = new Nozzle();
    nozzle.factory('f1', function() {
        return {value: 1};
    });

    var injected = nozzle.inject(function(f1) {
        return f1.value;
    });

    assert.equal(1, injected());
  });

  test('#constant', function() {
    var nozzle = new Nozzle();
    nozzle.constant('c1', {value: 1});

    var injected = nozzle.inject(function(c1) {
        return c1.value;
    });

    assert.equal(1, injected());
  });

  test('#singleton', function() {
    var nozzle = new Nozzle();
    nozzle.singleton('s1', function() {
        return {value: 1};
    });

    var injected = nozzle.inject(function(s1) {
        return s1.value;
    });

    assert.equal(1, injected());

    nozzle.inject(function(s1) {
        s1.value = 2;
    })();

    assert.equal(2, injected());
  });
});
