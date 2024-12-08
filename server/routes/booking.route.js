const express = require('express');
const router = express.Router();

const { booking, checkBooking } = require('../modules/booking/booking.controller.js');

router.post('/create/:room_id', booking);
router.get('/check/:transaction_id', checkBooking);

module.exports = router;