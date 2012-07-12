path = require 'path'
vows = require 'vows'
assert = require 'assert'
require 'coffee-script'
tron = require path.join('..', 'tron')
tron.debug = true

vows.describe('throttle').addBatch({

  'Throttling tron tests' :

    topic : -> ->
      count = 0
      for i in [0...100]
        tron.test( ->
          count++
        )
      return count

    'should turn off when set to one' : (topic) ->
      assert.equal(topic(), 100)

    'should disable tests when set to zero' : (topic) ->
      tron.throttle(0)
      assert.equal(topic(), 0)

    'drops the proper number of tests': (topic) ->
      for i in [1...10]
        tron.throttle(i / 10.0)
        r = x = 0
        while (r > (i+1)*10 or r < i*10) and x < 10
          r = topic()
          x++
        assert.isTrue( r <= (i+1)*10, "#{r} is more than target #{i}" )
        assert.isTrue( r >= i*10, "#{r} is less than target #{i}" )

}).export(module)