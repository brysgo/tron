tron = require '../tron.coffee'

for key, value of Math
  if typeof value is 'function'
    Number::[key] = (args...) ->
      Math[key](@, args...)

class Triangle
  constructor: ( @a, @b, @c ) ->
  angles: ->
    Math.atan( @a / @b )
    # make sure angles are the angles of a triange
    tron.test( example_tests.sanity.is_triange, result... )
  get_right_angle: (factor) ->
    # make sure @a, @b, and @c are sides of right triangle
    tron.test( example_tests.sanity.is_right, @a, @b, @c )
    @a *= factor
    @b *= factor
    @c *= factor
    return [ @a, @b, @c ]
    
# initialize our example class
obj = new Triangle( 1, 2, 5 )

class ExampleTests extends tron.tests
  constructor: ->
  sanity:
    is_right: (a, b, c) ->
      Number::pow = (p) -> Math.pow(@, p)
      return a.pow(2) + b.pow(2) is c.pow(2)
    is_triangle: (ab, bc, ac) ->
      return (ab + ac + bc) is 180
  chaos:
    first_sequence: ->
      obj.one()
      obj.two()
    second_sequence: ->
      obj.three()
      obj.one()

# initialize our test class
example_tests = new ExampleTests()
example_tests.run()

# export our namespace for requirejs
for k,v of example_tests
  exports[k] = v