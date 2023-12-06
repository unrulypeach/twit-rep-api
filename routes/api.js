const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/authController');
const user_controller = require('../controllers/userController');
const post_controller = require('../controllers/postController');
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('api is online');
});

router.get('/validate', passport.authenticate('jwt', {session: false}), auth_controller.validate_access_token);

router.post('/signup', auth_controller.signup);

router.post('/login', auth_controller.login);

router.post('/logout', auth_controller.logout);

router.get('/refresh', auth_controller.refresh_access_token);

router.post('/sethandle', passport.authenticate('jwt', {session: false}), user_controller.set_userhandle);

router.post('/checkhandle', passport.authenticate('jwt', {session: false}), user_controller.check_userhandle);

router.post('/follow', passport.authenticate('jwt', {session: false}), user_controller.follow);

router.delete('/follow', passport.authenticate('jwt', {session: false}), user_controller.unfollow);

router.post('/following', passport.authenticate('jwt', {session: false}), user_controller.is_following);

router.get('/user/:id/followers', user_controller.get_followers_list);

router.get('/user/:id/followers_count', user_controller.get_followers_count);

router.get('/user/:id/following', user_controller.get_following_list);

router.get('/user/:id/following_count', user_controller.get_following_count);

router.get('/user/:id/posts', post_controller.get_user_posts)

router.get('/user/:id', user_controller.get_user_profile);

router.get('/user/:id/short', user_controller.get_user_profile_short);

router.put('/user/:id', passport.authenticate('jwt', {session: false}), user_controller.update_user_profile);

router.get('/post/homepage', post_controller.get_frontpage_posts)

router.delete('/post/del', passport.authenticate('jwt', {session: false}), post_controller.delete_post);

router.post('/post/create', passport.authenticate('jwt', {session: false}), post_controller.create_post);

router.post('/post/reply', passport.authenticate('jwt', {session: false}), post_controller.reply_post);

// TODO
// router.delete('/post/reply', passport.authenticate('jwt', {session: false}), post_controller.delete_reply)

router.post('/post/like', passport.authenticate('jwt', {session: false}), post_controller.like_post);

router.delete('/post/like', passport.authenticate('jwt', {session: false}), post_controller.unlike_post);

router.get('/post/like_list', post_controller.get_post_likes_list);

router.get('/post/:id', post_controller.get_post);

module.exports = router;
