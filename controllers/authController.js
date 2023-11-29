const Auth = require('../models/auth');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { generatePw, validatePw } = require('../utils/passwordUtils');
const issueJWT = require('../utils/jwtUtils');

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
    .normalizeEmail()
    .custom(async (value) => {
      const emailUsed = await Auth.findOne({ email: value }).exec();
      if (emailUsed) {
        throw new Error('Email already in use')
      } else {
        return true
      }
    }),
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

    const newUser = new User({
      username: name,
      birthdate,
      email,
    });

    const newAuth = new Auth({
      email,
      hash: saltHash.hash,
      salt: saltHash.salt,
      uid: newUser._id,
    });

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
    } else {
      const authRes = await newAuth.save();

      if (authRes) {
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
    const user = await Auth.findOne({ email: req.body.email }).exec();
    if (!user) {
      res.status(401).json({
        msg: 'User does not exist',
      });
    }

    const isValid = validatePw(req.body.password, user.hash, user.salt);

    if (isValid) {
      const tokenObject = issueJWT(user);
      const userData = await User.findById(user.uid);
      res.status(200).json({
        user: userData,
        token: tokenObject.token,
        expires: tokenObject.expires
      });
    } else {
      res.status(401).json({ msg: "Wrong password"});
    }
  } catch(err) {
    next(err);
  };
});

// TODO
exports.logout = asyncHandler(async (req, res, next) => {});

// TODO
exports.refresh_token = asyncHandler(async (req, res, next) => {})