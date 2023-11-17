const User = require('../models/user');
const Auth = require('../models/auth');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { generatePw, validatePw } = require('../utils/passwordUtils');
const issueJWT = require('../utils/jwtUtils');

exports.create_profile = [
  body('name')
    .escape()
    .trim()
    .isString()
    .notEmpty(),
  body('email')
    .escape()
    .trim()
    .isEmail()
    .normalizeEmail(),
  body('birthdate')
    .escape()
    .toDate()
    .isDate(),
  body('password')
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
        const jwt = issueJWT()

        res.status(200).json({
          user: userRes,
          token: jwt.token,
          expiresIn: jwt.expires,
        })
      }

    }
})];

exports.profile = asyncHandler(async (req, res, next) => {
  res.send('TODO: (GET) Profile');
});

exports.update_profile = asyncHandler(async(req, res, next) => {
  res.send('TODO: (UPDATE) Profile');
});

exports.followers = asyncHandler(async(req, res, next) => {
  res.send('TODO: (GET) Followers list');
});

exports.following = asyncHandler(async(req, res, next) => {
  res.send('TODO: (GET) Following list');
});

exports.follow = asyncHandler(async(req, res, next) => {
  res.send('TODO: (POST) Follow');
});

exports.unfollow = asyncHandler(async(req, res, next) => {
  res.send('TODO: (DELETE) Follow');
});

