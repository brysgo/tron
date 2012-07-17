tron = require( './tron.coffee' )

class TronTests extends tron.tests
  check_subscribe_fn: ( fn ) ->
    m = [ "tron.subscribe( fn ) was expecting fn to",
          "but got" ]
    # check that it is a list or function
    t = typeof fn
    unless t in ['list', 'function']
      throw "#{m[0]} be a function #{m[1]} #{t}."
    # make sure that it accepts the right ammount of arguments
    incorrect_args = true
    switch fn.length
      when 0
        if /arguments/.test( fn.toString() )
          incorrect_args = false
      when 2 then incorrect_args = false
    if incorrect_args
      throw "#{m[0]} have 2 arguments #{m[1]} #{fn.length} argument(s)"
  check_is_function: ( fn ) ->
    t = typeof fn
    throw "was expecting function, but got #{t}." unless t is 'function'
  try_varargs_subscribe: ->
    result = undefined
    fn = tron.unsubscribe( 0 )
    h = tron.subscribe( (args...) -> result = args )
    tron.log( 'test' )
    tron.unsubscribe( h )
    tron.subscribe( fn )
    unless [].concat(result...).join(':') is 'log:test'
      throw 'there was a problem adding a subscription.'
  try_capture: ->
    result = tron.capture( ->
      tron.log( 'hello, I am a log.')
    )
    result = [].concat(result...).join(':')
    unless result is 'log:hello, I am a log.'
      throw 'there was a problem trying to capture logs.'

tests = new TronTests()

for k, v of tests
  exports[k] = v