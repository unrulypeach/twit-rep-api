const User = require('../models/user');
const Follow = require('../models/follow');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { userhandleValidator } = require('../utils/validators');

exports.set_userhandle = [
  userhandleValidator, 
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
    } else {
      const userId = req.user.uid;
      const userDoc = await User.updateOne(
        { _id: userId }, 
        { userhandle: req.body.userhandle }
      ).exec();
      res.json(userDoc);
    }
  })
];

exports.check_userhandle = [
  userhandleValidator,
  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      res.status(400).json(errors);
    }
    res.sendStatus(200);
  }
)];

exports.get_user_profile = asyncHandler(async(req, res, next) => {
  const userhandle = req.params.id;

  const userLookup = await User.findOne({ userhandle }).exec();
  res.json(userLookup);
});

exports.get_user_profile_short = asyncHandler(async(req, res, next) => {
  const userhandle = req.params.id;

  const userLookup = await User.findOne({ userhandle }, 'username userhandle profile_pic').exec();
  res.json(userLookup);
})

// TODO - WRITE VALIDATOR FUNCTION
exports.update_user_profile = asyncHandler(async(req, res, next) => {
  const { bio, website, location, profile_pic, header_pic, username } = req.body;
  // pictures will be uploaded client side with firebase sdk
  // _pic will therefore be links
  const user = req.user.uid;
  const updateUser = {
    ...(bio) && {bio},
    ...(website) && {website},
    ...(location) && {location},
    ...(profile_pic) && {profile_pic},
    ...(header_pic) && {header_pic},
    ...(username) && {username},
  };
  const updatedDoc = await User.updateOne({ _id: user }, updateUser).exec();
  res.json(updatedDoc);
});

exports.get_followers_list = asyncHandler(async(req, res, next) => {
  const user = req.params.id;
  // const userID = await User.findOne({ userhandle: user }, '_id').exec();
  const followers = await Follow.find({ follow_id: user }, 'uid').populate({
    path: 'uid',
    select: { username: 1, userhandle: 1}
  }).exec();
  res.json(followers);
});

exports.get_followers_count = asyncHandler(async(req, res, next) => {
  const user = req.params.id;
  // const userID = await User.findOne({ userhandle: user }, '_id').exec();
  const followerCount = await Follow.countDocuments({ follow_id: user }).exec();
  res.json(followerCount);
});

exports.get_following_list = asyncHandler(async(req, res, next) => {
  const user = req.params.id;
  // const userID = await User.findOne({ userhandle: user }, '_id').exec();
  const following = await Follow.find({ user_id: user }, 'follow_id').populate({
    path: 'follow_id',
    select: { username: 1, userhandle: 1}
  }).exec();
  res.json(following);
});

exports.get_following_count = asyncHandler(async(req, res, next) => {
  const user = req.params.id;
  // const userID = await User.findOne({ userhandle: user }, '_id').exec();
  const followingCount = await Follow.countDocuments({ user_id: user }).exec();
  res.json(followingCount);
});

exports.follow = asyncHandler(async(req, res, next) => {
  const follow_target = req.body.account;
  const uid = req.user.uid;

  const newFollow = new Follow({
    user_id: uid,
    follow_id: follow_target,
  });

  const followDoc = {
    user_id: uid,
    follow_id: follow_target,
  };

  // findOneAndUpdate guarantees no double follow
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
  const uid = req.user.uid;

  const doc = {
    user_id: uid,
    follow_id: unfollow_target,
  };

  const unfollowRes = await Follow.findOneAndDelete(doc).exec();
  const resolves = !!unfollowRes;
  res.json({ msg: resolves, unfollowRes });
});

// takes a user and checks if auth user is following them
// return boolean
exports.is_following = asyncHandler(async(req, res, next) => {
  const follow_id = req.body.account;
  const user = req.user.uid;

  const doc = {
    user_id: user,
    follow_id,
  };

  const isFollowing = await Follow.findOne(doc).exec();
  const resMsg = !!isFollowing 
  res.json(resMsg);
});