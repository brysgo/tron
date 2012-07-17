# Tron

Short for jumbotron, it is a minimalistic framework to help with our minimalistic assertion 
based tests.

## Usage

Except for the special features, `tron` behaves exactly like `console`

## Tests

Tron tests are split into two main categories of tests, checks and trys both play a role
in keeping your product bug free.

### Check tests

Check tests get called from inside your code and can be named or anonymous.

The primary purpose of these tests are to act as souped up `assert` statements that can do
elaborate sanity checks without worrying about bogging down the system at launch.

#### Named checks

Named tests are defined by giving tron.test() an object that maps names to functions. The
following is an example of how you would define some named tests:

```coffeescript
tron.test(
  check_is_string: (str) ->
    unless typeof str is 'string'
      throw "#{str} is not a string!"
)
```
Named check's must be called using the string name of the test, followed by the arguments.
This is a simple example of calling the named check we defined above:
```coffeescript
 tron.test( 'check_is_string', 'am I a string?')
```
Of course, doing this check would pass like you would expect, but something like:

```coffeescript
 tron.test( 'check_is_string', ( how_about_me ) -> )
```
will certainly fail.

#### Anonymous checks

Anonymous checks are for those times when you are too lazy to abstract the check out and
would prefer the ease of dropping in a test where it stands like you would with an assert.

These don't have the same reporting convenience as named checks, but can be much easier when
experimenting with code that is in flux.

Anonymous checks are defined and called in one fell swoop like so:

```coffeescript

str = get_string_maybe()

tron.test( ->
  unless typeof str is 'string'
    throw "#{str} is not a string!"
)
```

### Try tests

The problem with `check` tests is that they are useless if you can't control when they get
run. To solve this problem, we have try tests.

A try test is where you execute the portions of code you wish to test so that your checks all
get hit.

A try test is a very simple function that takes no arguments and has a name with the prefix
`try_`. Here is an example:

```coffeescript
my_func = ( i ) ->
  s = blackbox( i )
  tron.test('check_is_string', s)

tron.test(
  check_is_string: (str) ->
    unless typeof str is 'string'
      throw "#{str} is not a string!"
  try_my_func: () ->
    my_func( i )_
)
```
That's all there is too it.

### Throttle

Calling `tron.throttle( p )` where `p` is a fraction representing the percentage of tests you
want to run will allow you to lift some of the testing burden off of deployed servers.

## Subscriptions

Ever wish you could get the data from the logs whenever you need it in your code?

Look no further, tron's subscriptions make it easy to sign up for log messages.

### Subscribe

Subscribe to the log messages by passing a function `callback(arg)` to 
`tron.subscribe( callback )`.

Callback will be triggered with `arg` every time the logs are called. `arg` will look
like this:
```coffeescript
['log',['first log arg','second log arg','etc...']]
```

The return will be a handle to the subscription that you can use to unsubscribe.

### Unsubscribe

To unsubscribe simply:
```coffeescript
tron.unsubscribe( handle )
```

### Capture

Capture is a convenience function for something you might use while testing. It unsubscribes
everything, captures all the logs to a list, returns the list and resubscribes to everything.

This allows you to execute something in a sandbox and programmatically check the log calls.
Call it like this:
```coffeescript
msg = tron.capture( ->
  tron.log( 'capture will return this in the form ['log','[circular]']' )
)
tron.log( msg[0][0] is 'log' )
```

This example would print true to the log.

## Stopwatch

One function to start and stop the timer.

```coffeescript
tron.stopwatch('awesomebenchmark')
fastest_code()
tron.stopwatch('awesomebenchmark')
```

## Log Levels

Tron allows you to filter out messages of unimportance.

### Setting Level

To set the level, use:

```coffeescript
###
Here we will set tron to hide all messages less important than a warning.
###
tron.level( tron.warn )
```

### License

> Copyright (c) 2012 Socrenchus LLC

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
