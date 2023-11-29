const Auth = require('../models/auth');
const Jwtstrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

require('dotenv').config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PUB_ACCESS_KEY,
  algorithms: ['RS256'],
};

const strategy = new Jwtstrategy(options, async (payload, done) => {
  try {
    const user = await Auth.findOne({ _id: payload.sub }, 'uid').exec();
    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'User not found'});
    }
  } catch(err) {
    done(err, false, { message: 'Authentication error'});
  };
});

module.exports = (passport) => {
  passport.use(strategy);
}