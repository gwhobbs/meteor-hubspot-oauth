/* globals Hubspot, OAuth */
/* eslint-disable */
Hubspot = {};

Hubspot.requestCredential = function(options, credentialRequestCompleteCallback) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  const config = ServiceConfiguration.configurations.findOne({ service: 'hubspot' });
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError());
    return;
  }

  const credentialToken = Random.secret();

  const loginStyle = OAuth._loginStyle('hubspot', config, options);
  const redirectUri = OAuth._redirectUri('hubspot', config).replace('?close', '');

  const loginUrl = `${Meteor.settings.public.HubspotInstallationUrl}&state=${OAuth._stateParam(
    loginStyle,
    credentialToken,
    redirectUri
  )}`;

  OAuth.launchLogin({
    loginService: 'hubspot',
    loginStyle,
    loginUrl,
    credentialRequestCompleteCallback,
    credentialToken,
  });
};
