const User = require('../models/user');
const Follow = require('../models/follow');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { generatePw, validatePw } = require('../utils/passwordUtils');


exports.set_userhandle = [
  body('userhandle')
    .trim()
    .escape()
    .isString()
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed')
    .custom(async(value) => {
      const handleExists = await User.findOne({ userhandle: value }).exec();
      if (handleExists) {
        throw new Error('Userhandle taken, please enter another one');
      } else {
        return true;
      }
    }), 
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
    } else {
      const userId = req.user.uid;
      const userDoc = await User.findOneAndUpdate(
        { _id: userId }, 
        { userhandle: req.body.userhandle },
        { returnOriginal: false }
      ).exec();
      res.json(userDoc);
    }
  })
];

exports.get_profile = asyncHandler(async (req, res, next) => {
  const userhandle = req.params.id;

  const userLookup = await User.findOne({ userhandle }).exec();
  res.json(userLookup);
});

exports.update_profile = asyncHandler(async(req, res, next) => {
  const { bio, website, location, profile_pic, header_pic } = req.body;
  // pictures will be uploaded client side with firebase sdk
  // _pic will therefore be links
  const user = req.user.uid;
  const updateUser = {
    ...(bio) && {bio},
    ...(website) && {website},
    ...(location) && {location},
    ...(profile_pic) && {profile_pic},
    ...(header_pic) && {header_pic},
  };
  const updatedDoc = await User.findOneAndUpdate({ _id: user }, updateUser, { new: true })
  res.json(updatedDoc);
});

exports.get_followers_list = asyncHandler(async(req, res, next) => {
  const user = req.params.id;
  const userID = await User.findOne({ userhandle: user }, '_id').exec();
  const followers = await Follow.find({ follow_id: userID._id }, 'user_id').populate({
    path: 'user_id',
    select: { username: 1, userhandle: 1}
  }).exec();
  res.json(followers);
});

exports.get_followers_count = asyncHandler(async(req, res, next) => {
  const user = req.params.id;
  const userID = await User.findOne({ userhandle: user }, '_id').exec();
  const followerCount = await Follow.countDocuments({ follow_id: userID._id }).exec();
  res.json(followerCount);
});

exports.get_following_list = asyncHandler(async(req, res, next) => {
  const user = req.params.id;
  const userID = await User.findOne({ userhandle: user }, '_id').exec();
  const following = await Follow.find({ user_id: userID._id }, 'follow_id').populate({
    path: 'follow_id',
    select: { username: 1, userhandle: 1}
  }).exec();
  res.json(following);
});

exports.get_following_count = asyncHandler(async(req, res, next) => {
  const user = req.params.id;
  const userID = await User.findOne({ userhandle: user }, '_id').exec();
  const followingCount = await Follow.countDocuments({ user_id: userID._id }).exec();
  res.json(followingCount);
});

exports.follow = asyncHandler(async(req, res, next) => {
  const follow_target = req.body.account;
  const user_id = req.user.uid;

  const newFollow = new Follow({
    user_id,
    follow_id: follow_target,
  });

  const followDoc = {
    user_id,
    follow_id: follow_target,
  };

  // findOneAndUpdate guarantees to double follow
  const followRes = await Follow.findOneAndUpdate(
    followDoc,
    {
      $setOnInsert: newFollow
    },
    {
      upsert: true,
      new: true,
    } 
  ).exec();
  res.json(followRes);
});

exports.unfollow = asyncHandler(async(req, res, next) => {
  const unfollow_target = req.body.account;
  const user_id = req.user.uid;

  const doc = {
    user_id,
    follow_id: unfollow_target,
  };

  const unfollowRes = await Follow.findOneAndDelete(doc).exec();
  const resolves = unfollowRes === null ? "Already not following" : "Succesful Unfollow"
  res.json({ msg: resolves, unfollowRes });
});

