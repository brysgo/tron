# Tron

Short for jumbotron, it is a minimalistic framework to help with our minimalistic assertion 
based tests. Tron was built for use with meteor, but could probably be ported with minimal
effort to another web platform.

## Usage

Except for the special features, `tron` behaves exactly like `console`

## Tests

A tron test is a function that you pass to tron that contains any sanity checks that you don't
want bogging down your final product.

```coffeescript
tron.test( ->
  tron.log('this is a log message')
  tron.info('this is info')
  tron.warn('this is a warning')
  tron.error('this is an error')
)
```

Tron tests can be selectively run a percentage of the time to ease up CPU usage for 
deployed systems.

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
