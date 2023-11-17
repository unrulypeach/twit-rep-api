const Post = require('../models/post');
const asyncHandler = require('express-async-handler');

exports.get_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: (GET) Post');
});

exports.create_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: (POST) Post');
});

exports.delete_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: (DELETE) Post');
});

exports.like_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: (POST) Like');
});

exports.unlike_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: (DELETE) Like');
});

exports.reply_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: (POST) Reply');
});

// SHOULD THIS BE THE SAME AS GET_POST???
exports.get_reply_post = asyncHandler(async (req, res, next) => {
  res.send('TODO: (GET) Reply');
});