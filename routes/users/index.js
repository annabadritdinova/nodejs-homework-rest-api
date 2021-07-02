const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    logout,
    current
} = require('../../controllers/users');
const { validSignup, validLogin } = require('./validation');
const guard = require('../../helpers/guard');

router.post('/signup', validSignup, signup);
router.post('/login', validLogin, login);
router.post('/logout', guard, logout);
router.get('/current', guard, current);


module.exports = router;