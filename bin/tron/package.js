(function() {

  Package.describe({
    summary: 'Testing framework and other enhancements to the console object.'
  });

  Package.on_use(function(api) {
    return api.add_files(['tron.js', 'meteor_sync.js'], ["client", "server"]);
  });

}).call(this);
