const Auth = require('../models/auth');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { generatePw, validatePw } = require('../utils/passwordUtils');
const { issueAcessToken, issueRefreshToken } = require('../utils/jwtUtils');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
    }
    const authRes = await newAuth.save();

    if (authRes) {
      const userRes = await newUser.save();
      const accessTokenObject = issueAcessToken(newAuth, userRes);
      const refreshTokenObject = issueRefreshToken(newAuth, userRes);
      await Auth.findByIdAndUpdate( newAuth._id, {
        $push: { tokens: refreshTokenObject }
      });

      res.cookie('refresh', refreshTokenObject, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000 * 24 * 14,
        secure: true,
        sameSite: 'none'
      });

      res.status(200).json({
        access_token: accessTokenObject,
      });
    }
  })
]

exports.login = [
  body('email')
    .trim()
    .escape(),
  body('password')
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }

    try {
      const user = await Auth.findOne({ email: req.body.email }).exec();
      if (!user) {
        res.status(401).json({
          msg: 'User does not exist',
        });
      }

      const isValid = validatePw(req.body.password, user.hash, user.salt);

      if (isValid) {
        const userData = await User.findById(user.uid);
        const accessTokenObject = issueAcessToken(user, userData);
        const refreshTokenObject = issueRefreshToken(user, userData);
        await Auth.findByIdAndUpdate( user._id, {
          $push: { tokens: refreshTokenObject }
        });

        res.cookie('refresh', refreshTokenObject, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000 * 24 * 14,
          secure: true,
          sameSite: 'none'
        });
        res.status(200).json({
          access_token: accessTokenObject,
        });
      } else {
        res.status(401).json({ msg: "Wrong password"});
      }
    } catch(err) {
      next(err);
    };
  })
];

// TODO
exports.logout = asyncHandler(async (req, res, next) => {
  const { refresh } = req.cookies;
  if (!refresh) return res.status(401).end();

  await Auth
    .findOneAndUpdate({ tokens: refresh }, {
      $pull: { tokens: refresh }
    })
    .then(() => {
      // remove from cookie
      res.clearCookie('refresh', refresh, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000 * 24 * 14,
        secure: true,
        sameSite: 'none'
      });
      res.status(200).end()
    })
    .catch((error) => {
      res.status(500).json(error)
    })
    
});

exports.refresh_access_token = asyncHandler(async (req, res, next) => {
  const { refresh } = req.cookies;
  
  // no refresh token 
  if (!refresh) return res.status(401).json({error: 'no refresh token provided'});

  // check if token in DB
  const tokenInDb = await Auth.findOne({ tokens: refresh });
  
  if (!tokenInDb) {
    // redirect user to login
    return res.status(403).json({error: 'token not in db'});
  }

  jwt.verify(refresh, process.env.PUB_REFRESH_KEY, async (err, user) => {
    if (err) return res.sendStatus(403).json({error: 'token could not be verified', err})
    try {
      const user = await User.findById(tokenInDb.uid)
      const access_token = issueAcessToken(tokenInDb, user);
      res.json({ access_token, user })
    } catch(err) {
      console.error(err)
    }
  });
  
});

// TODO
exports.refresh_refresh_token = asyncHandler(async (req, res, next) => {

  // remove old token from db
  // remove old token from cookie
  // issue new token
})

exports.validate_access_token = asyncHandler(async (req, res, next) => {
  const uid = req.user.uid;
  const user = await User.findById(uid);
  res.json(user);
})