
{exec} = require 'child_process'

task 'build', 'build meteor plugin for project', ->
  exec 'coffee --compile --output bin/tron/ *.coffee', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr

task 'test', 'test tron', (options) ->
  tests = require( './tron_tests.coffee' )
  tests.run()