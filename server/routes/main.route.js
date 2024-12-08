const express = require('express');
const router = express.Router();
const handle = require('../middlewares/handle.middleware.js');

const authenRoutes = require('./authen.route');
const roomRoutes  = require('./room.route.js');

router.get('/', handle, (req, res) => {
    res.json({ message: 'Server processed your request', result: req.result });
});

router.use('/authen', handle, authenRoutes);
router.use('/room', handle, roomRoutes);

module.exports = router;
