const db = require('../../../utilities/database.service');

const tryGetRoom = async (hotel_alias, room_id) => {
    try {
        const row = await db.get(
            `SELECT 
                r.room_id, 
                r.name, 
                r.description, 
                r.price, 
                r.available_flag,
                h.hotel_id, 
                h.hotel_name, 
                h.hotel_alias, 
                h.hotel_description,
                h.hotel_address, 
                h.hotel_phone, 
                h.hotel_email
            FROM rooms r 
            JOIN hotels h ON h.hotel_id = r.hotel_id
            WHERE h.hotel_alias = ? 
                AND r.room_id = ?
                AND r.delete_flag = 0 
                AND h.delete_flag = 0`,
            [hotel_alias, room_id]
        );

        return row || [];
    } catch (err) {
        console.error('Error fetching room:', err);
        throw new Error('An error occurred while retrieving the room.');
    }
};

const tryGetAllRooms = async () => {
    try {
        const rows = await db.all(
            `SELECT 
                r.room_id, 
                r.name, 
                r.description, 
                r.price, 
                r.available_flag,
                h.hotel_id, 
                h.hotel_name, 
                h.hotel_alias, 
                h.hotel_description,
                h.hotel_address, 
                h.hotel_phone, 
                h.hotel_email
            FROM rooms r 
            JOIN hotels h ON h.hotel_id = r.hotel_id
            WHERE r.delete_flag = 0 
                AND h.delete_flag = 0`,
            []
        );

        console.log('row', rows)

        return rows.length > 0 ? rows : [];
    } catch (err) {
        console.error('Error fetching all rooms:', err);
        throw new Error('An error occurred while retrieving the rooms.');
    }
};

const trySearchRoom = async (index) => {
    try {
        const rows = await db.all(
            `SELECT 
                r.room_id, 
                r.name, 
                r.description, 
                r.price, 
                r.available_flag,
                h.hotel_id, 
                h.hotel_name, 
                h.hotel_alias, 
                h.hotel_description,
                h.hotel_address, 
                h.hotel_phone, 
                h.hotel_email
            FROM rooms r 
            JOIN hotels h ON h.hotel_id = r.hotel_id 
            WHERE r.name COLLATE NOCASE LIKE ? 
                OR r.description COLLATE NOCASE LIKE ?
                OR h.hotel_name COLLATE NOCASE LIKE ?
                OR h.hotel_address COLLATE NOCASE LIKE ?`,
            [`%${index}%`, `%${index}%`, `%${index}%`, `%${index}%`]
        );

        return rows.length > 0 ? rows : [];  // Return empty array if no rooms match search
    } catch (err) {
        console.error("Error executing search query:", err);
        throw new Error("An error occurred while searching for rooms.");
    }
};

module.exports = { tryGetRoom, trySearchRoom, tryGetAllRooms };

