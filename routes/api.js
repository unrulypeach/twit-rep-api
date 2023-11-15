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

// test a protected route
router.get('/test', passport.authenticate('jwt', {session: false}, (err) => { err ? next(err) : next()}), auth_controller.test);


module.exports = router;
