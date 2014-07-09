var assert = require("assert");
var Nozzle = require("../nozzle.js")

suite('Main', function() {
  test('#factory', function() {
    var nozzle = new Nozzle();
    nozzle.factory('f1', function() {
        return {value: 1};
    });

    var injected = nozzle.inject(function (f1) {
        return f1.value;
    });

    assert.equal(1, injected());
  });
});
