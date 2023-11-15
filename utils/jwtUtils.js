const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf-8');

function issueJWT(user) {
  const _id = user._id;

  const expiresIn = 604800;

  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jwt.sign(payload, PRIV_KEY, {
    expiresIn,
    algorithm: 'RS256',
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  }
};

module.exports = issueJWT;