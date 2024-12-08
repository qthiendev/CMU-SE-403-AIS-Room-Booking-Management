const { tryGetRoom, trySearchRoom, tryGetAllRooms } = require('./view-room.model'); 

const getRoom = async (req, res) => {
    const { hotel_alias, room_id } = req.params;
    try {
        const room = await tryGetRoom(hotel_alias, room_id);
        if (room) {
            res.status(200).json({ success: true, ...room });
        } else {
            res.status(404).json({ success: false, message: 'Room not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getAllRooms = async (req, res) => {
    try {
        const rooms = await tryGetAllRooms();
        if (rooms) {
            res.status(200).json({ success: true, rooms });
        } else {
            res.status(404).json({ success: false, message: 'No rooms found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const searchRooms = async (req, res) => {
    const { index } = req.query;
    try {
        const rooms = await trySearchRoom(index);
        if (rooms && rooms.length > 0) {
            res.status(200).json({ success: true, rooms });
        } else {
            res.status(404).json({ success: false, message: 'No rooms found matching search criteria' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getRoom, getAllRooms, searchRooms };
