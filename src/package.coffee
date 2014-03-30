Package.describe(
  summary: 'Testing framework and other enhancements to the console object.'
)
Package.on_use( (api) ->
  api.use('underscore')
  api.export('tron')
  api.add_files( ['tron.js', 'meteor_sync.js'] )
)
