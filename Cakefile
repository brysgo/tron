
{exec} = require 'child_process'

option '-p', '--prefix [DIR]', 'set the installation prefix for `cake install`'

task 'install', 'install tron to ~/.meteor/packages (or --prefix)', (options) ->
  base = options.prefix or '~/.meteor/packages'
  console.log   "Installing tron to #{base}"
  exec( "cp -Rf bin/tron #{base}", (err, stdout, stderr) ->
    if err then console.log stderr.trim() else console.log 'done'
  )

task 'build', 'build meteor plugin for project', ->
  exec 'coffee --compile --bare --output bin/tron/ src/*.coffee && cp src/*.json bin/tron/', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr

task 'test', 'test tron', (options) ->
  require('coffee-script/register')
  tron = require( './src/tron.coffee' )
  tron.run_tests()
