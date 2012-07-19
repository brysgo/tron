
{exec} = require 'child_process'

option '-p', '--prefix [DIR]', 'set the installation prefix for `cake install`'

task 'install', 'install CoffeeScript into /usr/local (or --prefix)', (options) ->
  base = options.prefix or '../meteor/packages'
  console.log   "Installing CoffeeScript to #{base}"
  exec( "cp -rf bin/tron/ #{base}/tron", (err, stdout, stderr) ->
    if err then console.log stderr.trim() else console.log 'done'
  )

task 'build', 'build meteor plugin for project', ->
  exec 'coffee --compile --output bin/tron/ src/*.coffee', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr

task 'test', 'test tron', (options) ->
  tron = require( './tron.coffee' )
  tron.test()