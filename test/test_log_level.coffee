path = require 'path'
vows = require 'vows'
assert = require 'assert'
require 'coffee-script'
tron = require path.join('..', 'tron')
tron.debug = true

vows.describe('loglevels').addBatch({

  'Log messages' :

    topic : -> ->
      result = [
        tron.log( 'log' ),
        tron.info( 'info' ),
        tron.warn( 'warn' ),
        tron.error( 'error' )
      ]

    'work with no level set' : (topic) ->
      result = topic()
      assert.equal(result.length, 4)
      for r in result
        assert.equal(r[0], r[1])

    'go away if level is set right': (topic) ->
      t =
        'warn': [0, 1]
        'error': [0, 1, 2]
        'info': [0]
        'log': []
      for k, v of t
        tron.level( tron[k] )
        for r, i in topic()
          if i in v
            assert.equal(r, undefined)
          else
            assert.notEqual(r, undefined)

}).export(module)