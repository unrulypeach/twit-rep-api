const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/authController');
const user_controller = require('../controllers/userController');
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('api is online');
});

router.post('/signup', auth_controller.signup);

router.post('/login', auth_controller.login);

router.post('/sethandle', passport.authenticate('jwt', {session: false}), user_controller.set_userhandle);

router.post('/follow', passport.authenticate('jwt', {session: false}), user_controller.follow);

router.delete('/follow', passport.authenticate('jwt', {session: false}), user_controller.unfollow);

router.get('/user/:id', user_controller.get_profile);

router.put('/user/:id', passport.authenticate('jwt', {session: false}), user_controller.update_profile);

router.get('/user/:id/followers', user_controller.get_followers_list);

router.get('/user/:id/followers_count', user_controller.get_followers_count);

router.get('/user/:id/following', user_controller.get_following_list);

router.get('/user/:id/following_count', user_controller.get_following_count);

module.exports = router;
