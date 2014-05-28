(function(){
  var global = this;

  var Nozzle = function() {

  };

  var DEFAULT_INJECTOR_NAME = 'default';

  Nozzle.injectors = {};

  Nozzle.injector = function(name) {
    if (this.injectors[name] === void 0) {
      this.injectors[name] = new Injector();
    }
    return this.injectors[name];
  };

  var Injector = function() {
    this.factories = {};
    this.constants = {};
  };

  Injector.prototype.factory = function(name, factory) {
    this.factories[name] = factory;
  };

  Injector.prototype.singleton = function(name, factory) {
    this.constants[name] = this.resolve(factory)();
  };

  Injector.prototype.constant = function(name, value) {
    this.constants[name] = value;
  };

  var _circularCheck = function(names) {
    
  };

  Injector.prototype.resolve = function(func) {
    var args;
    if (_isArray(func)) {
      args = func.slice(1, func.length);
      func = func[0];
    } else {
      var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
      args = func.toString().match(FN_ARGS)[1].split(',');
    }

  };
  
  Injector.prototype.extend = function(anotherInjector) {

  };

  Injector.prototype.inject = function(func) {

    var services =  [];

    return function() {
      return func.apply(this, services);
    };
  };

  // Utility function for determining if an object is an `Array`.
  var _isArray = Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

}).call(this);
