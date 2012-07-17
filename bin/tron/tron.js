(function() {
  var Tron, k, special, tron, v, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = Array.prototype.slice,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Array.prototype.remove = function(e) {
    var t, _ref;
    if ((t = this.indexOf(e)) > -1) {
      return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
    }
  };

  special = function(char) {
    return '\x1b[' + {
      green: '32m',
      red: '31m',
      clear: '0m'
    }[char];
  };

  Tron = (function() {

    function Tron() {
      this.test = __bind(this.test, this);      this.timers = [];
      this.scale = 1.0;
      this.subscriptions = [
        function(method, args) {
          return console[method].apply(console, args);
        }
      ];
      this.named_tests = {};
      this.announce = false;
    }

    Tron.prototype.subscribe = function(fn) {
      /*
          Subscribe to console events with a function that takes two arguments
          
          The first argument is the console function being called, the second
          is a list of arguments passed to that console function.
      */
      var f, handle;
      handle = undefined;
      tron.test('check_subscribe_fn', fn);
      switch (typeof fn) {
        case 'list':
          handle = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = fn.length; _i < _len; _i++) {
              f = fn[_i];
              _results.push(this.subscribe(f));
            }
            return _results;
          }).call(this);
          break;
        case 'function':
          handle = this.subscriptions.length;
          this.subscriptions.push(fn);
      }
      return handle;
    };

    Tron.prototype.unsubscribe = function(handle) {
      /*
          Unsubscribe from tron with the handle returned by subscribe.
          FIXME: Using an index for handles breaks with unsubcriptions.
      */
      var i, result, s;
      if (handle != null) {
        s = this.subscriptions;
        result = s[handle];
        this.subscriptions = s.slice(0, handle).concat(s.slice(handle + 1));
        return result;
      } else {
        return (function() {
          var _len, _ref, _results;
          _ref = this.subscriptions;
          _results = [];
          for (i = 0, _len = _ref.length; i < _len; i++) {
            s = _ref[i];
            _results.push(this.unsubscribe(i));
          }
          return _results;
        }).call(this);
      }
    };

    Tron.prototype.capture = function(fn) {
      /*
          Temperarily overrides all subscriptions and returns logs instead.
      */
      var r, tmp;
      tron.test('check_is_function', fn);
      tmp = this.subscriptions;
      r = [];
      this.subscriptions = [
        function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return r.push(args);
        }
      ];
      fn();
      this.subscriptions = tmp;
      return r;
    };

    Tron.prototype.test = function() {
      var args, color, found, input, k, v, _ref, _ref2;
      input = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      /*
           This simple function will define the way we test Socrenchus. You can do
           things in most of the same ways you did them with the console.
      
           Call it with your test function like this:
            
            my_test = (your, args, here) ->
              tron.log( 'this writes to the log' )
              tron.info( "this is \#{your} info message" )
              tron.warn( "this is warning about your \#{args}" )
              tron.error( "there is an error \#{here}" )
              
            tron.test(my_test, 'your', 'args', 'here')
      */
      if (args == null) args = [];
      found = false;
      if (!(Math.random() < this.scale)) return;
      switch (typeof input) {
        case 'function':
          input.apply(null, args);
          break;
        case 'object':
          for (k in input) {
            v = input[k];
            this.named_tests[k] = v;
          }
          break;
        case 'string':
          if (input.slice(0, 4) === 'try_') {
            crillic = 'Г';
            tron.log(" " + crillic + " " + input + " started.\n");
            this.announce = true;
            this.named_tests[input]();
            this.announce = false;
            tron.log(" L " + input + " finished.\n");
            return;
          }
          try {
            color = special('green');
            (_ref = this.named_tests)[input].apply(_ref, args);
            check = '✓';
            if (this.announce) {
              tron.log("   " + check + " " + color + input + " passed.");
            }
          } catch (error) {
            color = special('red');
            err_mark = '✗';
            tron.warn("   " + err_mark + " " + color + "failure in " + input + ":");
            tron.log(special('clear'));
            tron.trace(error);
          } finally {
            tron.log(special('clear'));
          }
          break;
        case 'undefined':
          _ref2 = this.named_tests;
          for (k in _ref2) {
            v = _ref2[k];
            if (k.slice(0, 4) === 'try_') this.test(k);
          }
          break;
        default:
          throw "expected function, got " + (typeof input) + ".";
      }
      return found;
    };

    Tron.prototype.throttle = function(scale) {
      var u;
      u = "\n Use this to throttle the number of tests being run. Scale is a fraction\n that represents the probability that any given test function will get run.\n";
      return this.scale = scale;
    };

    Tron.prototype.stopwatch = function(timer_name) {
      var r, u;
      u = "\n This function acts as both console.time and console.timeEnd, just pass it\n a string to start the timer, and the same string to stop it.\n";
      if (timer_name == null) {
        return this.warn(u);
      } else if (__indexOf.call(this.timers, timer_name) < 0) {
        this.timers.push(timer_name);
        return this.console.time(timer_name);
      } else {
        r = console.timeEnd(timer_name);
        this.timers.remove(timer_name);
        return r;
      }
    };

    Tron.prototype._name_of_function = function(fn) {
      var key, value;
      for (key in this) {
        value = this[key];
        if (value === fn) return key;
      }
    };

    Tron.prototype.level = function(fn) {
      var level, u;
      u = "\nIn the example: \n\ntron.level( tron.warn )\n\nTron will be set to only show information that is at least as severe as a\nwarning.\n";
      level = this._name_of_function(fn);
      if (level == null) {
        return this.warn(u);
      } else {
        return this.min_level = level;
      }
    };

    Tron.prototype.write = function(method, args) {
      var s, suppress, _i, _len, _ref, _results,
        _this = this;
      suppress = (function() {
        var key;
        if (!_this.min_level) return false;
        for (key in _this) {
          if (key === _this.min_level) return false;
          if (key === method) return true;
        }
      })();
      if (!suppress) {
        _ref = this.subscriptions;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          _results.push(s(method, args));
        }
        return _results;
      }
    };

    Tron.prototype.dir = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.write('dir', args);
    };

    Tron.prototype.trace = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.write('trace', args);
    };

    Tron.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.write('log', args);
    };

    Tron.prototype.info = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.write('info', args);
    };

    Tron.prototype.warn = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.write('warn', args);
    };

    Tron.prototype.error = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.write('error', args);
    };

    Tron.prototype.assert = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.write('assert', args);
    };

    return Tron;

  })();

  this.tron = tron = new Tron();

  tron.test({
    check_subscribe_fn: function(fn) {
      var incorrect_args, m, t;
      m = ["tron.subscribe( fn ) was expecting fn to", "but got"];
      t = typeof fn;
      if (t !== 'list' && t !== 'function') {
        throw "" + m[0] + " be a function " + m[1] + " " + t + ".";
      }
      incorrect_args = true;
      switch (fn.length) {
        case 0:
          if (/arguments/.test(fn.toString())) incorrect_args = false;
          break;
        case 2:
          incorrect_args = false;
      }
      if (incorrect_args) {
        throw "" + m[0] + " have 2 arguments " + m[1] + " " + fn.length + " argument(s)";
      }
    },
    check_is_function: function(fn) {
      var t;
      t = typeof fn;
      if (t !== 'function') throw "was expecting function, but got " + t + ".";
    },
    try_varargs_subscribe: function() {
      var fn, h, result, _ref;
      result = void 0;
      fn = tron.unsubscribe(0);
      h = tron.subscribe(function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return result = args;
      });
      tron.log('test');
      tron.unsubscribe(h);
      tron.subscribe(fn);
      if ((_ref = []).concat.apply(_ref, result).join(':') !== 'log:test') {
        throw 'there was a problem adding a subscription.';
      }
    },
    try_capture: function() {
      var result, _ref;
      result = tron.capture(function() {
        return tron.log('hello, I am a log.');
      });
      result = (_ref = []).concat.apply(_ref, result).join(':');
      if (result !== 'log:hello, I am a log.') {
        throw 'there was a problem trying to capture logs.';
      }
    }
  });

  if (typeof exports !== "undefined" && exports !== null) {
    _ref = this.tron;
    for (k in _ref) {
      v = _ref[k];
      exports[k] = v;
    }
  }

}).call(this);
