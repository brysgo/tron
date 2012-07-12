path = require 'path'
vows = require 'vows'
assert = require 'assert'
require 'coffee-script'
tron = require path.join('..', 'tron')
tron.unsubscribe( 0 )

vows.describe('loglevels').addBatch({

  'Log messages' :

    topic : -> ->
      result = []
      h = tron.subscribe( (m, a) -> result.push( [m].concat(a) ) )
      tron.log( 'log' )
      tron.info( 'info' )
      tron.warn( 'warn' )
      tron.error( 'error' )
      tron.unsubscribe( h )
      return result

    'work with no level set' : (topic) ->
      result = topic()
      assert.equal(result.length, 4)
      for r in result
        assert.equal(r[0], r[1])

    'go away if level is set right': (topic) ->
      t =
        'warn': ['warn', 'error']
        'error': ['error']
        'info': ['info','warn','error']
        'log': ['log','info','warn','error']
      for k, v of t
        tron.level( tron[k] )
        result = ( i[0] for i in topic() )
        for key in result
          assert.isTrue( key in v )
        for key in v
          assert.isTrue( key in result )

}).export(module)