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
    this.values = {};
  };

  var TYPE_FACTORY = 'factory';
  var TYPE_SINGLETON = 'singleton';
  var TYPE_CONSTANT = 'constant';

  var _parseDependencies = function(func, type) {    
    var args;
    if (_isArray(func)) {
      args = func.slice(1, func.length);
      func = func[0];
    } else {
      var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
      args = func.toString().match(FN_ARGS)[1].split(',');
    }

    return {
      dependencies: args,
      func: func,
      type: type
    };
  };

  Injector.prototype.factory = function(name, factory) {
    this.values[name] = _parseDependencies(factory, TYPE_FACTORY);
  };

  Injector.prototype.singleton = function(name, factory) {
    this.values[name] = _parseDependencies(factory, TYPE_SINGLETON);
  };

  Injector.prototype.constant = function(name, value) {
    this.values[name] = {
      value: value,
      type: TYPE_SINGLETON
    };
  };

  var _checkDependencies = function(name, visited) {
    var value = this.values[name];
    if (value === void 0) {
      throw new Error("Undefined dependency: " + name);
    }

    if (value.type === TYPE_CONSTANT) {
      return;
    }

    var chain = visited.concat([name]);
    if (_arrayContains(visited, name)) {
      throw new Error("Cycle found in dependency chain: " + chain);
    }
    var dependencies  = value.dependencies;
    for (var i = 0; i < dependencies.length; i++) {
      _checkDependencies(dependencies[i], chain);
    }
  };

  Injector.prototype.resolve = function(func) {
    var parsed = _parseDependencies(func);
    for (var i = 0; i < parsed.dependencies.length; i++) {
      
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

  var _arrayContains = function (array, element) {
    if (Array.prototype.indexOf) {
      return array.indexOf(element) !== -1;
    } else {
      for (var i = 0; i < array.length, i++) {
        if (array[i] === element) {
          return true;
        }
      }
      return false;
    }
  };

}).call(this);
