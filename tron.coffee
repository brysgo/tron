# Very useful helper function to remove array items
Array::remove = (e) -> @[t..t] = [] if (t = @indexOf(e)) > -1

class Tron
  constructor: ->
    @timers = []
    @scale = 1.0
    @subscriptions = [
      (method, args) -> console[method](args...)
    ]
  
  subscribe: ( fn ) ->
    u = """
    
    Subscribe to console events with a function that takes two arguments
    
    The first argument is the console function being called, the second
    is a list of arguments passed to that console function.
    
    """
    handle = `undefined`
    switch typeof fn
      when 'list'
        handle = ( @subscribe(f) for f in fn )
      when 'function'
        handle = @subscriptions.length
        @subscriptions.push( fn )
      else @warn( u )
    return handle
  
  unsubscribe: ( handle ) ->
    u = """
    
    Unsubscribe from tron with the handle returned by subscribe.
    
    """
    if handle?
      s = @subscriptions
      result = s[handle]
      @subscriptions = s[...handle].concat(s[handle+1..])
      return result
    else
      return ( @unsubscribe( i ) for s, i in @subscriptions )
  
  capture: ( fn ) ->
    u = """
    
    Temperarily overrides all subscriptions and returns logs instead.
    
    """
    unless typeof fn is 'function'
      @warn( u )
    
    tmp = @subscriptions
    r = []
    @subscriptions = [ (args...) -> r.push( args ) ]
    fn()
    @subscriptions = tmp
    return r
    
  test: (fn, args...) ->
    u = """

     This simple function will define the way we test Socrenchus. You can do
     things in most of the same ways you did them with the console.

     Call it with your test function like this:
      
      my_test = (your, args, here) ->
        tron.log( 'this writes to the log' )
        tron.info( "this is \#{your} info message" )
        tron.warn( "this is warning about your \#{args}" )
        tron.error( "there is an error \#{here}" )
        
      tron.test(my_test, 'your', 'args', 'here')

    """
    args ?= []
    found = false
    return unless Math.random() < @scale
    switch typeof fn
      when 'function'
        fn(args...)
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
  
class TronTests
  constructor: ->
  run: ( seq=`undefined` ) ->
    if seq?
      try 
        @[seq]()
        tron.log( "#{seq} passed." )
      catch error
        tron.warn( "failure in #{seq}:")
        tron.trace error
    else
      for k of @
        @run(k) if k[0..3] is 'try_'

exports['tests'] = TronTests