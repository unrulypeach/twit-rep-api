const Post = require('../models/post');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const { postContentValidator, postImageValidator, postidValidator } = require('../utils/validators');

exports.get_post = asyncHandler(async (req, res, next) => {
  const postid = req.params.id;
  const post = await Post
    .findById(postid)
    .populate([{
      path: 'uid',
      select: { username: 1, userhandle: 1, profile_pic: 1}
    }, {
      path: 'comments',
      populate: {
        path: 'uid',
        select: { username: 1, userhandle: 1, profile_pic: 1}    
      }
    }])
    .exec();

  res.json(post);
});

exports.create_post = [
  postContentValidator,
  postImageValidator,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    };

    const { content, image } = req.body;
    const user = req.user.uid;
    
    const newPost = new Post({
      ...(content) && {content},
      ...(image) && {image},
      uid: user,
    });
    
    const postRes = await newPost.save();
    
    res.json(postRes);
  })
];

exports.reply_post = [
  postContentValidator,
  postImageValidator,
  postidValidator,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }
    const { content, image, postid } = req.body;
    const user = req.user.uid;
    const newPost = new Post({
      ...(content) && {content},
      ...(image) && {image},
      uid: user,
      parent: postid,
    });

    // add comment to postid (previous post)
    const postRes = await newPost.save();
    const addComment = await Post.updateOne(
      { _id: postid },
      {
        $push: {
          comments: newPost._id
          }
      }
    ).exec();

    res.json({postRes, addComment});
  })
]

exports.delete_post = [
  postidValidator,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    };

    const { postid } = req.body;
    const delPost = await Post.findByIdAndDelete(postid).exec();
    // check if it is a comment and delete its reference    
    const commentRef = await Post.updateOne(
      { comments: postid },
      {
        $pull: {
          comments: postid
        }
      }
    ).exec();

    res.json({delPost, commentRef})
  })
];

exports.like_post = [
  postidValidator,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    };

    const { postid } = req.body;
    const user = req.user.uid;

    const updatePost = await Post.updateOne(
      { _id: postid },
      {
        $addToSet: {
          likes: user
        }
      }
    ).exec();

    res.json(updatePost);
  })
];

exports.unlike_post = [
  postidValidator,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    };

    const { postid } = req.body;
    const user = req.user.uid;

    const updatePost = await Post.updateOne(
      { _id: postid },
      {
        $pull: {
          likes: user
        }
      }
    ).exec();

    res.json(updatePost);
  })
];

exports.get_post_likes_list = [
  postidValidator,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    };

    const { postid } = req.body;

    const likesList = await Post.findOne({_id: postid}).select('likes -_id').populate({
      path: 'likes',
      select: { username: 1, userhandle: 1, profile_pic: 1, _id: 0 }
    }).exec();

    res.json(likesList);
  })
];

exports.get_user_posts = asyncHandler(async(req, res, next) => {
  const userId = req.params.id;

  const query = await Post
    .find({ uid: userId })
    .sort({ date: 'desc' })
    .limit(10)
    .exec();
  const user = await User
    .findById(userId, { username: 1, userhandle: 1, profile_pic: 1})
    .exec();
  res.json({user, posts: query});
});

exports.get_frontpage_posts = asyncHandler(async(req, res, next) => {
  const query = await Post.find({})
    .sort({ likes: 'desc', date: 'desc' })
    .limit(10)
    .populate({
      path: 'uid',
      select: { username: 1, userhandle: 1, profile_pic: 1}
    })
    .exec();

  res.json(query);
});