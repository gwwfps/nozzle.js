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

    assert.equal(injected(), 1);

    assert.throws(function() {
      nozzle.factory('f1', function() {});
    },
    /already defined/);
  });

  test('#constant', function() {
    var nozzle = new Nozzle();
    nozzle.constant('c1', {value: 1});

    var injected = nozzle.inject(function(c1) {
      return c1.value;
    });

    assert.equal(injected(), 1);

    assert.throws(function() {
      nozzle.constant('c1', 2);
    },
    /already defined/);
  });

  test('#singleton', function() {
    var nozzle = new Nozzle();
    nozzle.singleton('s1', function() {
      return {value: 1};
    });

    var injected = nozzle.inject(function(s1) {
      return s1.value;
    });

    assert.equal(injected(), 1);

    nozzle.inject(function(s1) {
      s1.value = 2;
    })();

    assert.equal(injected(), 2);

    assert.throws(function() {
      nozzle.singleton('s1', function() {});
    },
    /already defined/);
  });

  test('#inject:cycleChecks', function() {
    var nozzle = new Nozzle();
    nozzle.factory('f1', function(f1) {});
    assert.throws(function() {
      nozzle.inject(function(f1) {})();
    },
    /Cycle found/);

    nozzle = new Nozzle();
    nozzle.factory('f1', function(f2) {});
    nozzle.factory('f2', function(f1) {});
    assert.throws(function() {
      nozzle.inject(function(f1) {})();
    },
    /Cycle found/);
    assert.throws(function() {
      nozzle.inject(function(f2) {})();
    },
    /Cycle found/);

    nozzle = new Nozzle();
    nozzle.factory('f1', function(f2) {});
    nozzle.factory('f2', function(f3, f4) {});
    nozzle.factory('f3', function() {});
    nozzle.factory('f4', function(f1) {});
    assert.throws(function() {
      nozzle.inject(function(f1) {})();
    },
    /Cycle found/);
    assert.throws(function() {
      nozzle.inject(function(f2) {})();
    },
    /Cycle found/);
    nozzle.inject(function(f3) {})();
    assert.throws(function() {
      nozzle.inject(function(f4) {})();
    },
    /Cycle found/);

    assert.throws(function() {
      nozzle.inject({})();
    },
    /not injectable/);
  });
});
