// Generated by CoffeeScript 1.7.1
Package.describe({
  summary: 'Testing framework and other enhancements to the console object.'
});

Package.on_use(function(api) {
  api.use('underscore');
  api["export"]('tron');
  return api.add_files(['tron.js', 'meteor_sync.js']);
});
