/* eslint-disable */
Package.describe({
  name: 'ghobbs:hubspot-oauth',
  version: '0.0.1',
  summary: 'Hubspot OAuth flow',
  git: 'https://github.com/gwhobbs/meteor-hubspot-oauth.git',
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.versionsFrom('2.3');

  api.use('ecmascript');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', 'server');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.addFiles('hubspot_client.js', 'client');
  api.addFiles('hubspot_server.js', 'server');

  api.export('Hubspot');
});
