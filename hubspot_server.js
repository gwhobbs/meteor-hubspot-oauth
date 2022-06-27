/* globals Hubspot, OAuth */
/* eslint-disable */
Hubspot = {};

let userAgent = 'Meteor';
if (Meteor.release) {
  userAgent += `/${Meteor.release}`;
}

const getTokenResponse = function(query) {
  const config = ServiceConfiguration.configurations.findOne({ service: 'hubspot' });
  if (!config) {
    throw new ServiceConfiguration.ConfigError();
  }

  const redirectUri = OAuth._redirectUri('hubspot', config).replace('?close', '');

  let response;
  try {
    response = HTTP.post('https://api.hubapi.com/oauth/v1/token', {
      headers: {
        Accept: 'application/json',
        'User-Agent': userAgent,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      params: {
        grant_type: 'authorization_code',
        code: query.code,
        redirect_uri: redirectUri,
        client_id: config.clientId,
        client_secret: OAuth.openSecret(config.secret),
      },
    });
  } catch (error) {
    throw _.extend(new Error(`Failed to complete OAuth handshake with Hubspot. ${error.message}`), { response: error.response });
  }
  if (response.data.error) {
    throw new Error(`Failed to complete OAuth handshake with Hubspot. ${response.data.error}`);
  } else {
    return response.data;
  }
};

const getIdentity = function(accessToken) {
  try {
    return HTTP.get('https://api.hubapi.com/account-info/v3/details', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'User-Agent': userAgent,
      },
    }).data;
  } catch (error) {
    throw _.extend(new Error(`Failed to fetch identity from Hubspot. ${error.message}`), { response: error.response });
  }
};

OAuth.registerService('hubspot', 2, null, function(query) {
  const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = getTokenResponse(query);

  const expiresAt = +new Date() + 1000 * expiresIn;
  const identity = getIdentity(accessToken);

  return {
    serviceData: {
      id: identity.portalId,
      accessToken: OAuth.sealSecret(accessToken),
      refreshToken: OAuth.sealSecret(refreshToken),
      expiresAt,
    },
  };
});

Hubspot.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
}
