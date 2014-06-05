(function(){
  var global = this;

  var Nozzle = function() {
    this.values = {};
  };  

  Nozzle.injectors = {};

  Nozzle.get = function(name) {
    if (this.injectors[name] === void 0) {
      this.injectors[name] = new Nozzle();
    }
    return this.injectors[name];
  };

  var TYPE_FACTORY = 'factory';
  var TYPE_SINGLETON = 'singleton';
  var TYPE_CONSTANT = 'constant';

  Nozzle.prototype._parseDependencies = function(func, type) {    
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

  Nozzle.prototype.factory = function(name, factory) {
    this.values[name] = this._parseDependencies(factory, TYPE_FACTORY);
  };

  Nozzle.prototype.singleton = function(name, factory) {
    this.values[name] = this._parseDependencies(factory, TYPE_SINGLETON);
  };

  Nozzle.prototype.constant = function(name, value) {
    this.values[name] = {
      value: value,
      type: TYPE_SINGLETON
    };
  };

  Nozzle.prototype._checkDependencies = function(name, visited) {
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
      this._checkDependencies(dependencies[i], chain);
    }
  };

  Nozzle.prototype._getValue = function(name) {
    _checkDependencies(name, []);

    var parsedValue = this.values[name];

    if (parsedValue.type === TYPE_CONSTANT) {
      return parsedValue.value;
    }

    var initialized = this._injectParsed(parsedValue)();

    if (parsedValue.type === TYPE_SINGLETON) {
      this.values[name] = {
        value: initialized,
        type: TYPE_CONSTANT
      };
    }

    return initialized;
  };

  Nozzle.prototype._injectParsed = function(parsedValue) {
    return function() {
      var depNames = parsedValue.dependencies;
      var depName;
      var dependencies = [];
      for (var i = 0; i < depNames.length; i++) {
        depName = depNames[i];
        dependencies.push(this._getValue(depName));
      }
      return parsedValue.func.apply(this, dependencies);
    };
  };

  Nozzle.prototype.inject = function(func) {
    var parsed = this._parseDependencies(func);
    return this._injectParsed(parsed);
  };

  // Utility functions for determining object types

  var _toStringTypeComp = function(typeName) {
    return function(obj) {
      return Object.prototype.toString.call(obj) === '[object ' + typeName + ']';
    };    
  };

  var _isArray = Array.isArray || _toStringTypeComp('Array');
  var _isString = _toStringTypeComp('String');
  var _isFunction = _toStringTypeComp('Function');

  var _arrayContains = function(array, element) {
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

  var _isInjectable = function(obj) {
    if (_isFunction(obj)) {
      return true;
    }

    if (_isArray(obj)) {
      return _isFunction(obj[obj.length-1]);
    }

    return false;
  };

  var defaultNozzle = new Nozzle();  

  global.zz = function(arg1, arg2) {    
    if (_isString(arg1)) {
      if (_isInjectable(arg2)) {
        defaultNozzle.factory(arg1, arg2);
      } else {
        defaultNozzle.constant(arg1, arg2);
      }
    } else {
      defaultNozzle.inject(arg1);
    }
  };

}).call(this);
