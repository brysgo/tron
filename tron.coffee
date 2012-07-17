# Very useful helper function to remove array items
Array::remove = (e) -> @[t..t] = [] if (t = @indexOf(e)) > -1

tests = require( './tron_tests.coffee' )

class TronTestFramework
  constructor: ->
  _name_of_function: ( fn ) ->
    for key, value of @
      return key if value is fn
  run: ( seq=`undefined` ) ->
    pre = tron.announce
    checks = []
    tron.test_log = ( fn ) -> checks.push( fn )
    if seq?
      try 
        @[seq]()
        tron.log( "#{seq} passed." )
        for [check, error] in checks
          name = @_name_of_function(check)
          unless error
            tron.log( "..#{name} passed." )
          else
            tron.warn( "failure in #{name}:" )
      catch error
        tron.warn( "failure in #{seq}:")
        tron.trace error
    else
      for k of @
        @run(k) if k[0..3] is 'try_'
    tron.announce = pre

class Tron
  constructor: ->
    @timers = []
    @scale = 1.0
    @subscriptions = [
      (method, args) -> console[method](args...)
    ]
  
  subscribe: ( fn ) ->
    ###
    Subscribe to console events with a function that takes two arguments
    
    The first argument is the console function being called, the second
    is a list of arguments passed to that console function.
    ###
    handle = `undefined`
    tron.test( tests.check_subscribe_fn, fn )
    switch typeof fn
      when 'list'
        handle = ( @subscribe(f) for f in fn )
      when 'function'
        handle = @subscriptions.length
        @subscriptions.push( fn )
    return handle
  
  unsubscribe: ( handle ) ->
    ###
    Unsubscribe from tron with the handle returned by subscribe.
    FIXME: Using an index for handles breaks with unsubcriptions.
    ###
    if handle?
      s = @subscriptions
      result = s[handle]
      @subscriptions = s[...handle].concat(s[handle+1..])
      return result
    else
      return ( @unsubscribe( i ) for s, i in @subscriptions )
  
  capture: ( fn ) ->
    ###
    Temperarily overrides all subscriptions and returns logs instead.
    ###
    tron.test( tests.check_is_function, fn )
    tmp = @subscriptions
    r = []
    @subscriptions = [ (args...) -> r.push( args ) ]
    fn()
    @subscriptions = tmp
    return r
    
  test: (fn, args...) ->
    ###
     This simple function will define the way we test Socrenchus. You can do
     things in most of the same ways you did them with the console.

     Call it with your test function like this:
      
      my_test = (your, args, here) ->
        tron.log( 'this writes to the log' )
        tron.info( "this is \#{your} info message" )
        tron.warn( "this is warning about your \#{args}" )
        tron.error( "there is an error \#{here}" )
        
      tron.test(my_test, 'your', 'args', 'here')
    ###
    args ?= []
    found = false
    return unless Math.random() < @scale
    switch typeof fn
      when 'function'
        try
          fn(args...)
          @test_log( [ fn, null ] )
        catch error
          @test_log( [ fn, error ] )
          throw error
        found = true
      else
        @warn(u)
    return found
      
  
  throttle: ( scale ) ->
    u = """
    
     Use this to throttle the number of tests being run. Scale is a fraction
     that represents the probability that any given test function will get run.
    
    """
    @scale = scale

  stopwatch: ( timer_name ) ->
    u = """
    
     This function acts as both console.time and console.timeEnd, just pass it
     a string to start the timer, and the same string to stop it.
    
    """
    unless timer_name?
      @warn(u)
    else unless timer_name in @timers
      @timers.push( timer_name )
      @console.time( timer_name )
    else
      r = console.timeEnd( timer_name )
      @timers.remove( timer_name )
      return r
  
  _name_of_function: ( fn ) ->
    for key, value of @
      return key if value is fn
  
  level: ( fn ) ->
    u = """
     
     In the example: 
     
     tron.level( tron.warn )
     
     Tron will be set to only show information that is at least as severe as a
     warning.
     
    """
    level = @_name_of_function( fn )
    unless level?
      @warn(u)
    else
      @min_level = level

  write: (method, args) ->
    suppress = ( =>
      return false unless @min_level
      for key of @
        return false if key is @min_level
        return true if key is method
    )()
    unless suppress
      for s in @subscriptions
        s(method, args)


  dir:    (args...) -> @write('dir', args) 
  trace:  (args...) -> @write('trace', args)
  log:    (args...) -> @write('log', args)
  info:   (args...) -> @write('info', args)
  warn:   (args...) -> @write('warn', args)
  error:  (args...) -> @write('error', args)
  assert: (args...) -> @write('assert', args)

tron = new Tron()

for k,v of tron
  exports[k] = v

exports['tests'] = TronTestFramework

