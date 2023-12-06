const jwt = require('jsonwebtoken');
require('dotenv').config();

// user is data from auths
// _id, uid, email, hash, salt
const pak = process.env.PRIV_ACCESS_KEY;
const prk = process.env.PRIV_REFRESH_KEY;
function issueAcessToken(userAuth, userRes) {
  const { _id } = userAuth;

  const expiresIn = '10m';

  const payload = {
    sub: _id,
    user: userRes,
    iat: Math.floor(Date.now() / 1000)
  };

  const signedToken = jwt.sign(payload, pak, {
    expiresIn,
    algorithm: 'RS256',
  });

  return signedToken;
};

function issueRefreshToken(userAuth, userRes) {
  const { _id } = userAuth;

  const expiresIn = '14d';

  const payload = {
    sub: _id,
    user: userRes,
    iat: Math.floor(Date.now() / 1000)
  };

  const signedToken = jwt.sign(payload, prk, {
    expiresIn,
    algorithm: 'RS256',
  });
  
  return signedToken;
};

module.exports = { issueAcessToken, issueRefreshToken };