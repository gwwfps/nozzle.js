var assert = require("assert");
var Nozzle = require("../nozzle.js")

suite('Shortcut', function() {
  test('#dispatch', function() {
    Nozzle.zz('f1', function(f2) {
      return f2() + 1;
    });
    Nozzle.zz('f2', function() {
      return 1;
    });
    Nozzle.zz('c3', {value: 3});
    Nozzle.zz(function(f1, f2, c3) {
      assert.equal(f1(), 2);
      assert.equal(f2(), 1);
      assert.equal(c3, 3);
    });
  });
});
