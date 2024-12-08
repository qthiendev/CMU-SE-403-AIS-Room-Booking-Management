const express = require('express');
const router = express.Router();
const { isLogin, isLogout } = require('../middlewares/authen.middleware.js');

const { login } = require('../modules/authen/login/login.controller.js');
const { logout } = require('../modules/authen/logout/logout.controller.js');
const { register } = require('../modules/authen/register/register.controller.js');

router.post('/login', isLogout, login);
router.post('/logout', isLogin, logout);
router.post('/register', isLogout, register);

router.get('/status', (req, res) => {
    if (req.session && typeof req.session.aid === 'number'
        && req.session.aid > 0)
        return res.status(200).json({ status: 'login' });

    return res.status(200).json({ status: 'logout' });

});

module.exports = router;
