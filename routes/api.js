const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/authController')
const passport = require('passport');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', auth_controller.signup);

router.post('/login', auth_controller.login);

const authenticateWithJwt = (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (error, jwt_payload) => {
      if (error) {
          return next(error);
      }

      Auth.findOne({id: jwt_payload.sub}, (err, user) => {
          if (err || !user) {
              return next(err || new Error('Could not find user'));
          }

          next(user);
      });
  })(req, res);
};

router.get('/protected', authenticateWithJwt, (req, res) => {
  res.status(200).json({message: 'it works!'});
});
// test a protected route
router.get('/test', passport.authenticate('jwt', {session: false}), auth_controller.test);

module.exports = router;
