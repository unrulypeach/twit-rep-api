const Auth = require('../models/auth');
const asyncHandler = require('express-async-handler');
const { generatePw, validatePw } = require('../utils/passwordUtils');
const issueJWT = require('../utils/jwtUtils');

exports.signup = asyncHandler(async (req, res, next) => {
  const saltHash = generatePw(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new Auth({
    username: req.body.username,
    hash,
    salt,
  });

  const result = await newUser.save();
  const jwt = issueJWT(result);
  res.json({ 
    success: true,
    result,
    token: jwt.token,
    expiresIn: jwt.expires,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  Auth.findOne({ username: req.body.username })
      .then((user) => {
        if (!user) {
          res.status(401).json({
            success: false,
            msg: 'User does not exist',
          });
        }

        const isValid = validatePw(req.body.password, user.hash, user.salt);

        if (isValid) {

          const tokenObject = issueJWT(user);
          res.status(200).json({
            success: true,
            user,
            token: tokenObject.token,
            expires: tokenObject.expires
          });

        } else {

          res.status(401).json({ success: false, msg: "Wrong password"});

        }
      }).catch((err) => {
        next(err);
      });
});

// test a protected route
exports.test = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'You are authorized',
  });
});