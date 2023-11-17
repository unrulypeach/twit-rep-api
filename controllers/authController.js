const Auth = require('../models/auth');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { generatePw, validatePw } = require('../utils/passwordUtils');
const issueJWT = require('../utils/jwtUtils');

/* exports.signup = asyncHandler(async (req, res, next) => {
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
}); */

exports.signup = [
  body('name', 'error with name')
    .escape()
    .trim()
    .isString()
    .notEmpty(),
  body('email', 'error with email')
    .escape()
    .trim()
    .isEmail()
    .normalizeEmail(),
  body('birthdate', 'error with birthdate')
    .escape()
    .toDate(),
    // .isDate(),
  body('password', 'error with password')
    .trim()
    .isLength({ min: 5 }),
  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const { name, email, birthdate, password } = req.body;
    const saltHash = generatePw(password);

    const newAuth = new Auth({
      email,
      hash: saltHash.hash,
      salt: saltHash.salt,
    });

    if (!errors.isEmpty()) {
      res.status(500).json({ errors });
    } else {
      const authRes = await newAuth.save();

      if (authRes) {
        const newUser = new User({
          username: name,
          birthdate,
          email,
          authID: authRes._id
        });

        const userRes = await newUser.save();
        const jwt = issueJWT(userRes);

        res.status(200).json({
          user: userRes,
          token: jwt.token,
          expiresIn: jwt.expires,
        })
      }

    }
})]

exports.login = asyncHandler(async (req, res, next) => {
  try {
    const user = await Auth.findOne({ username: req.body.username });
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
  } catch(err) {
    next(err);
  };
});

// test a protected route
exports.test = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'You are authorized',
  });
});