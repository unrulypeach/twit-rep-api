const fs = require('fs');
const path = require('path');
const Auth = require('../controllers/authController');
const Jwtstrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf-8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

const strategy = new Jwtstrategy(options, (payload, done) => {
  try {
    const user = Auth.findOne({ _id: payload.sub });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch(err) {
    done(err, false);
  };
});

module.exports = (passport) => {
  passport.use(strategy);
}