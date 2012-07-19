
if Meteor.is_server
  tron.use_color = true
if Meteor.is_client
  tron.use_color = false

tron.unsubscribe( tron.console )

tron.console = ( fn, args ) ->
  console[fn](args...)
  Meteor.call( 'sync_tron', tron, Meteor.is_client, fn, args )

tron.subscribe( tron.console )

Meteor.methods(
  sync_tron: ( tron_object, is_client, fn, args ) ->
    unless is_client is Meteor.is_client
      tron.sync( tron_object )
      console[fn](args...)
)

