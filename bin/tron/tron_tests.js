(function() {
  var TronTests, k, tron, tron_tests, v, _ref,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  tron = typeof require === "function" ? require('./tron.coffee') : void 0;

  TronTests = (function(_super) {

    __extends(TronTests, _super);

    function TronTests() {
      TronTests.__super__.constructor.apply(this, arguments);
    }

    TronTests.prototype.check_subscribe_fn = function(fn) {
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
    };

    TronTests.prototype.check_is_function = function(fn) {
      var t;
      t = typeof fn;
      if (t !== 'function') throw "was expecting function, but got " + t + ".";
    };

    TronTests.prototype.try_varargs_subscribe = function() {
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
    };

    TronTests.prototype.try_capture = function() {
      var result, _ref;
      result = tron.capture(function() {
        return tron.log('hello, I am a log.');
      });
      result = (_ref = []).concat.apply(_ref, result).join(':');
      if (result !== 'log:hello, I am a log.') {
        throw 'there was a problem trying to capture logs.';
      }
    };

    return TronTests;

  })(tron.tests);

  this.tron_tests = tron_tests = new TronTests();

  _ref = this.tron_tests;
  for (k in _ref) {
    v = _ref[k];
    exports[k] = v;
  }

}).call(this);
