// Generated by CoffeeScript 1.7.1
var Tron, k, v, _tron, _tron_console,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Array.prototype.remove = function(e) {
  var t, _ref;
  if ((t = this.indexOf(e)) > -1) {
    return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
  }
};

Tron = (function() {
  function Tron() {
    this.sync = __bind(this.sync, this);
    this.test = __bind(this.test, this);
    this.color = __bind(this.color, this);
    this.timers = [];
    this.scale = 1.0;
    this.use_color = true;
    this.console = function(method, args) {
      var a;
      if (!this.use_color) {
        args = (function() {
          var _i, _len, _ref, _results;
          _results = [];
          for (_i = 0, _len = args.length; _i < _len; _i++) {
            a = args[_i];
            _results.push((_ref = typeof a.replace === "function" ? a.replace(/\x1b\[[0-9]*m/g, '') : void 0) != null ? _ref : a);
          }
          return _results;
        })();
      }
      return console[method].apply(console, args);
    };
    this.subscriptions = [this.console];
    this.named_tests = {};
    this.coverage_map = {};
    this.announce = false;
  }

  Tron.prototype.color = function(char) {
    return '\x1b[' + {
      green: '32m',
      red: '31m',
      clear: '00m'
    }[char];
  };

  Tron.prototype.subscribe = function(fn) {

    /*
    Subscribe to console events with a function that takes two arguments
    
    The first argument is the console function being called, the second
    is a list of arguments passed to that console function.
     */
    var f, _i, _len;
    _tron.test('check_subscribe_fn', fn);
    switch (typeof fn) {
      case 'list':
        for (_i = 0, _len = fn.length; _i < _len; _i++) {
          f = fn[_i];
          this.subscribe(f);
        }
        break;
      case 'function':
        this.subscriptions.push(fn);
    }
    return fn;
  };

  Tron.prototype.unsubscribe = function(fn) {

    /*
    Unsubscribe from tron with the handle returned by subscribe.
     */
    var f, _i, _j, _len, _len1, _ref;
    switch (typeof fn) {
      case 'list':
        for (_i = 0, _len = fn.length; _i < _len; _i++) {
          f = fn[_i];
          this.unsubscribe(f);
        }
        break;
      case 'function':
        this.subscriptions.remove(fn);
        break;
      case 'undefined':
        _ref = this.subscriptions;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          f = _ref[_j];
          this.unsubscribe(f);
        }
    }
    return fn;
  };

  Tron.prototype.capture = function(fn) {

    /*
    Temperarily overrides all subscriptions and returns logs instead.
     */
    var r, tmp;
    _tron.test('check_is_function', fn);
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
    var args, check, checks, color, empty_trys, error, found, input, k, key, m, missed_checks, try_test, v, value, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    input = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];

    /*
     This is tron's mini built in test framework.
     */
    if (args == null) {
      args = [];
    }
    found = false;
    if (!(Math.random() < this.scale)) {
      return;
    }
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
          this.log(" " + crillic + " " + input + " started.\n");
          this.named_tests[input]();
          if ((_ref = this.coverage_map) != null) {
            _ref[input] = this.coverage_map['current'];
          }
          this.log(" L " + input + " finished.\n");
          return;
        }
        if ((_ref1 = this.coverage_map) != null) {
          if (_ref1['current'] == null) {
            _ref1['current'] = [];
          }
        }
        if ((_ref2 = this.coverage_map) != null) {
          _ref2['current'].push(input);
        }
        try {
          color = this.color('green');
          (_ref3 = this.named_tests)[input].apply(_ref3, args);
          check = '✓';
          if (this.coverage_map != null) {
            this.log("   " + check + " " + color + input + " passed.");
          }
        } catch (_error) {
          error = _error;
          color = this.color('red');
          err_mark = '✗';
          this.warn("   " + err_mark + " " + color + "failure in " + input + ":");
          this.log(this.color('clear'));
          this.trace(error);
        } finally {
          this.log(this.color('clear'));
        }
        break;
      case 'undefined':
        this.coverage_map = {};
        _ref4 = this.named_tests;
        for (k in _ref4) {
          v = _ref4[k];
          if (k.slice(0, 4) === 'try_') {
            this.test(k);
          }
        }
        empty_trys = [];
        checks = [];
        missed_checks = [];
        _ref5 = this.coverage_map;
        for (key in _ref5) {
          value = _ref5[key];
          if (key === 'current') {
            continue;
          }
          checks = checks.concat(value);
          if ((value != null ? value.length : void 0) === 0) {
            empty_trys.push(key);
          }
        }
        for (key in this.named_tests) {
          if (key in this.coverage_map) {
            continue;
          }
          if (__indexOf.call(checks, key) < 0) {
            missed_checks.push(key);
          }
        }
        color = this.color('red');
        m = missed_checks.length;
        if (m > 0) {
          m = ("" + color + "Your try tests missed " + m + " checks:\n") + this.color('clear');
          for (_i = 0, _len = missed_checks.length; _i < _len; _i++) {
            check = missed_checks[_i];
            m += " ~ " + check;
          }
          this.warn(m);
        }
        m = empty_trys.length;
        if (m > 0) {
          m = ("" + color + "There were no checks in " + m + " try tests:\n") + this.color('clear');
          for (_j = 0, _len1 = empty_trys.length; _j < _len1; _j++) {
            try_test = empty_trys[_j];
            m += " ~ " + try_test;
          }
          this.warn(m);
        }
        this.coverage_map = void 0;
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
      if (value === fn) {
        return key;
      }
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

  Tron.prototype.sync = function(tron_object) {

    /*
    Overwrites sharable state with tron_object.
     */
    var item, k, shared_props, v, _base, _i, _len, _ref, _results;
    shared_props = ['announce', 'scale'];
    for (_i = 0, _len = shared_props.length; _i < _len; _i++) {
      item = shared_props[_i];
      this[item] = tron_object[item];
    }
    _ref = tron_object['coverage_map'];
    _results = [];
    for (k in _ref) {
      v = _ref[k];
      if ((_base = this['coverage_map'])[k] == null) {
        _base[k] = [];
      }
      _results.push(this['coverage_map'][k] = this['coverage_map'][k].concat(v));
    }
    return _results;
  };

  Tron.prototype.write = function(method, args) {
    var s, suppress, _i, _len, _ref, _results;
    suppress = ((function(_this) {
      return function() {
        var key;
        if (!_this.min_level) {
          return false;
        }
        for (key in _this) {
          if (key === _this.min_level) {
            return false;
          }
          if (key === method) {
            return true;
          }
        }
      };
    })(this))();
    if (!suppress) {
      _ref = this.subscriptions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(s.call(this, method, args));
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

_tron = new Tron();

_tron_console = _tron.unsubscribe(_tron.console);

tron = new Tron();

_tron.test({
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
        if (/arguments/.test(fn.toString())) {
          incorrect_args = false;
        }
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
    if (t !== 'function') {
      throw "was expecting function, but got " + t + ".";
    }
  },
  try_varargs_subscribe: function() {
    var fn, h, result, _ref, _ref1;
    result = void 0;
    fn = tron.unsubscribe(tron.console);
    h = tron.subscribe(function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return result = args;
    });
    tron.log('test');
    tron.unsubscribe(h);
    tron.subscribe(fn);
    if (_ref = _tron.console, __indexOf.call(_tron.subscriptions, _ref) < 0) {
      throw 'tron.console was not resubscribed.';
    }
    if ((_ref1 = []).concat.apply(_ref1, result).join(':') !== 'log:test') {
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
  },
  try_calling_try_like_check: function() {
    return tron.capture(function() {
      return _tron.test('try_capture');
    });
  }
});

if (typeof exports !== "undefined" && exports !== null) {
  for (k in tron) {
    v = tron[k];
    exports[k] = v;
  }
  exports['run_tests'] = function() {
    _tron.subscribe(_tron_console);
    return _tron.test();
  };
}
