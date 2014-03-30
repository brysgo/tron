Meteor.startup( ->
  if Meteor.is_server
    tron.use_color = true
  if Meteor.is_client
    tron.use_color = false

  old_console = tron.console

  tron.unsubscribe( old_console )

  tron.console = ( fn, args ) ->
    Meteor.call( 'sync_tron', tron, Meteor.is_client, fn, args, -> )
    old_console( fn, args )

  tron.subscribe( tron.console )

  tron._test = tron.test
  tron.test = (args...) ->
    if _.isEmpty(args)
      Meteor.call( 'tron_test' )
    else
      tron._test.call(tron, args...)
)

Meteor.methods(
  sync_tron: ( tron_object, is_client, fn, args ) ->
    unless is_client is Meteor.is_client
      tron.sync( tron_object )
      console[fn](args...)
  tron_test: -> tron._test()
)

