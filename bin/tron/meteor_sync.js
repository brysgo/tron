(function() {

  if (Meteor.is_server) tron.use_color = true;

  if (Meteor.is_client) tron.use_color = false;

  tron.unsubscribe(tron.console);

  tron.console = function(fn, args) {
    console[fn].apply(console, args);
    return Meteor.call('sync_tron', tron, Meteor.is_client, fn, args);
  };

  tron.subscribe(tron.console);

  Meteor.methods({
    sync_tron: function(tron_object, is_client, fn, args) {
      if (is_client !== Meteor.is_client) {
        tron.sync(tron_object);
        return console[fn].apply(console, args);
      }
    }
  });

}).call(this);
