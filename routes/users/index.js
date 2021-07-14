const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    logout,
    current,
    updateAvatar,
    verify,
    repeatEmailVerify
} = require('../../controllers/users');
const { validSignup, validLogin } = require('./validation');
const guard = require('../../helpers/guard');
const upload = require('../../helpers/uploadAvatar');

router.post('/signup', validSignup, signup);
router.post('/login', validLogin, login);
router.post('/logout', guard, logout);
router.get('/current', guard, current);
router.patch('/avatars', guard, upload.single('avatar'), updateAvatar);
router.get('/verify/:verificationToken', verify);
router.post('/verify', repeatEmailVerify);


module.exports = router;