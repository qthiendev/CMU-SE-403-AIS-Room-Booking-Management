const express = require('express');
const router = express.Router();

const authenRoutes = require('./authen.route');
const roomRoutes  = require('./room.route.js');
const bookingRoutes  = require('./booking.route.js');

router.get('/', (req, res) => {
    res.json({ message: 'Server processed your request', result: req.result });
});

router.use('/authen', authenRoutes);
router.use('/room',roomRoutes);
router.use('/booking', bookingRoutes);

module.exports = router;
