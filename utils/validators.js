const { body } = require('express-validator');
const User = require('../models/user');

exports.userhandleValidator = [
  body('userhandle')
    .escape()
    .isAlphanumeric()
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed')
    .custom(async(value) => {
      const handleExists = await User.findOne({ userhandle: value }).exec();
      if (handleExists) {
        throw new Error('Userhandle taken, please enter another one');
      } else {
        return true;
      }
    })
];

exports.postContentValidator = [
  body('content')
    .escape()
    .isString()
    .isLength({ max: 280 })
    .withMessage('your post cannot exceed 280 characters')
]

exports.postImageValidator = [
  body('image')
    .escape()
    .trim()
]

exports.postidValidator = [
  body('postid')
    .escape()
    .trim()
]