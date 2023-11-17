const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/authController');
const user_controller = require('../controllers/userController');
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', auth_controller.signup);

router.post('/login', auth_controller.login);

// test a protected route
router.get('/test', passport.authenticate('jwt', {session: false}), auth_controller.test);

// router.get('/post/:id', )


// TODO
router.get('/user/:id', user_controller.profile);

// TODO
router.put('/user/:id', user_controller.update_profile);

// TODO
// router.post('/user/:id', user_controller.create_profile);

// TODO
router.get('/user/:id/followers', user_controller.followers);

// TODO
router.get('/user/:id/following', user_controller.following);

// TODO
router.post('/user/:id/follow', user_controller.follow);

// TODO
router.delete('/user/:id/follow', user_controller.unfollow);

/* const authenticateWithJwt = (req, res, next) => {
  passport.authenticate('jwt', {session: false}, async (error, jwt_payload) => {
      if (error) {
          return next(error);
      }

      try {
        const user = await Auth.findOne({id: jwt_payload.sub});
        next(user);
      } catch (err) {
        return next(err || new Error('Could not find user'));
      }

  })(req, res, next);
};

router.get('/protected', authenticateWithJwt, (req, res, next) => {
  res.status(200).json({message: 'it works!', req});
}); */

module.exports = router;
