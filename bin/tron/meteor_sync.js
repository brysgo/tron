(function() {

  Meteor.startup(function() {
    var old_console;
    if (Meteor.is_server) tron.use_color = true;
    if (Meteor.is_client) tron.use_color = false;
    old_console = tron.console;
    tron.unsubscribe(old_console);
    tron.console = function(fn, args) {
      Meteor.call('sync_tron', tron, Meteor.is_client, fn, args, function() {});
      return old_console(fn, args);
    };
    return tron.subscribe(tron.console);
  });

  Meteor.methods({
    sync_tron: function(tron_object, is_client, fn, args) {
      if (is_client !== Meteor.is_client) {
        tron.sync(tron_object);
        return console[fn].apply(console, args);
      }
    }
  });

}).call(this);
