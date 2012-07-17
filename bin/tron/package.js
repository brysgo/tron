Package.describe({
  summary: "Testing framework and other enhancements to the console object.",
});

Package.on_use(function (api) {
  api.add_files(['tron.js'], ['client','server']);
});
