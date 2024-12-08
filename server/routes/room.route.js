const express = require('express');
const router = express.Router();

const { getAllRooms, getRoom, searchRooms } = require('../modules/room-management/view-room/view-room.controller.js');

router.get('/get/:hotel_alias/:room_id', getRoom);
router.get('/get-all', getAllRooms);
router.get('/search', searchRooms);

module.exports = router;