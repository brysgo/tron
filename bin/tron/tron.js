(function() {
  var Tron, TronTestFramework, k, special, tron, tron_tests, v, _ref,
    __slice = Array.prototype.slice,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Array.prototype.remove = function(e) {
    var t, _ref;
    if ((t = this.indexOf(e)) > -1) {
      return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
    }
  };

  tron_tests = typeof require === "function" ? require('./tron_tests.coffee') : void 0;

  special = function(char) {
    return '\x1b[' + {
      green: '32m',
      red: '31m',
      clear: '0m'
    }[char];
  };

  TronTestFramework = (function() {

    function TronTestFramework() {}

    TronTestFramework.prototype._name_of_function = function(fn) {
      var key, value;
      for (key in this) {
        value = this[key];
        if (value === fn) return key;
      }
    };

    TronTestFramework.prototype.run = function(seq) {
      var check, checks, color, error, k, name, pre, _i, _len, _ref;
      if (seq == null) seq = undefined;
      pre = tron.test_log;
      checks = [];
      tron.test_log = function(fn) {
        return checks.push(fn);
      };
      if (seq != null) {
        try {
          color = special('green');
          this[seq]();
          tron.log("" + color + seq + " passed.");
          for (_i = 0, _len = checks.length; _i < _len; _i++) {
            _ref = checks[_i], check = _ref[0], error = _ref[1];
            name = this._name_of_function(check);
            if (!error) {
              tron.log(".." + name + " passed.");
            } else {
              color = special('red');
              tron.warn("" + color + "..failure in " + name + ":");
              tron.log(special('clear'));
              tron.trace(error);
              tron.log();
            }
          }
        } catch (error) {
          color = special('red');
          tron.warn("" + color + "failure in " + seq + ":\n");
          tron.trace(error);
        } finally {
          tron.log(special('clear'));
        }
      } else {
        for (k in this) {
          if (k.slice(0, 4) === 'try_') this.run(k);
        }
      }
      return tron.test_log = pre;
    };

    return TronTestFramework;

  })();

  Tron = (function() {

    function Tron() {
      this.timers = [];
      this.scale = 1.0;
      this.subscriptions = [
        function(method, args) {
          return console[method].apply(console, args);
        }
      ];
      this.test_log = function(input) {
        var error, fn;
        fn = input[0], error = input[1];
        if (error != null) throw error;
      };
    }

    Tron.prototype.subscribe = function(fn) {
      /*
          Subscribe to console events with a function that takes two arguments
          
          The first argument is the console function being called, the second
          is a list of arguments passed to that console function.
      */
      var f, handle;
      handle = undefined;
      tron.test(tron_tests.check_subscribe_fn, fn);
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
      tron.test(tron_tests.check_is_function, fn);
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
      var args, fn, found;
      fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
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
      switch (typeof fn) {
        case 'function':
          try {
            fn.apply(null, args);
            this.test_log([fn, null]);
          } catch (error) {
            this.test_log([fn, error]);
          }
          found = true;
          break;
        default:
          this.warn(u);
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

    Tron.prototype.tests = TronTestFramework;

    return Tron;

  })();

  this.tron = tron = new Tron();

  if (typeof exports !== "undefined" && exports !== null) {
    _ref = this.tron;
    for (k in _ref) {
      v = _ref[k];
      exports[k] = v;
    }
  }

}).call(this);
