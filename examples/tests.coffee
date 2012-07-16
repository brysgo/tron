tron = require '../tron.coffee'

class ExampleTests extends tron.tests
  check_is_string: (str) ->
    unless typeof str is 'string'
      throw "#{str} is not a string!"
  try_construct_with_number: ->
    fail = new Horse( 5 )
  try_move_henry: ->
    result = tron.capture( ->
      henry.move()
    )
    expected = [
      [ 'log', [ 'Galloping...' ] ],
      [ 'log', [ 'Henry the horse moved 45m.' ] ] 
    ]
    unless [].concat(result...).join('') is [].concat(expected...).join('')
      throw "Expected #{expected} but got #{result}."


# initialize our test class
example_tests = new ExampleTests()

class Animal
  constructor: (@name) ->
    tron.test( example_tests.check_is_string, @name )
  move: (meters) ->
    tron.log( @name + " moved #{meters}m." )

class Snake extends Animal
  move: ->
    tron.log( "Slithering..." )
    super 5

class Horse extends Animal
  move: ->
    tron.log( "Galloping..." )
    super 45

henry = new Horse( 'Henry the horse' )
sammy = new Snake( 'Sammy the snake' )

# run tests
example_tests.run()

# export our namespace for requirejs
for k,v of example_tests
  exports[k] = v