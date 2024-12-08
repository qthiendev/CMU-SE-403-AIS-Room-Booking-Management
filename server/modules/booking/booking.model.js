const crypto = require('crypto');
const db = require('../../utilities/database.service');

const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const generateUniqueTransactionId = async () => {
    let transactionId;
    let isUnique = false;

    while (!isUnique) {
        transactionId = generateRandomString(10);

        const query = `SELECT 1 FROM invoices WHERE transaction_id = ? LIMIT 1`;
        const result = await db.get(query, [transactionId]);

        if (!result) {
            isUnique = true;
        }
    }

    return transactionId;
};

const tryBooking = async (bookingData) => {
    // Destructure the booking data
    const {
        detail,
        customer_email,
        customer_phone,
        check_in_date,
        check_out_date,
        pay_amount,
        full_payment,
        room_id
    } = bookingData;

    if (
        !detail || 
        !customer_phone || 
        !check_in_date || 
        !check_out_date || 
        !pay_amount || 
        full_payment === undefined || 
        !room_id
    ) {
        throw new Error('Missing required fields for booking.');
    }

    try {
        // Check if the room exists
        const checkRoomQuery = 'SELECT 1 FROM rooms WHERE room_id = ? AND delete_flag = 0';
        const roomExists = await db.get(checkRoomQuery, [room_id]);

        if (!roomExists) {
            throw new Error('Room does not exist.');
        }

        const transaction_id = await generateUniqueTransactionId();

        const query = `
            INSERT INTO invoices (
                detail,
                customer_email,
                customer_phone,
                check_in_date,
                check_out_date,
                pay_amount,
                full_payment,
                transaction_id,
                room_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await db.run(query, [
            detail,
            customer_email || null,
            customer_phone,
            check_in_date,
            check_out_date,
            pay_amount,
            full_payment,
            transaction_id,
            room_id
        ]);

        return {
            success: true,
            invoice_id: result.lastID,
            transaction_id
        };
    } catch (err) {
        console.error('Error inserting booking:', err);
        throw new Error('Failed to insert booking.');
    }
};

const tryCheckBooking = async (transaction_id) => {
    if (!transaction_id) {
        throw new Error('Transaction ID is required.');
    }

    console.log(transaction_id)

    const query = `
        SELECT 
            invoices.invoice_id,
            invoices.detail,
            invoices.customer_email,
            invoices.customer_phone,
            invoices.check_in_date,
            invoices.check_out_date,
            invoices.pay_amount,
            invoices.full_payment,
            invoices.transaction_id,
            invoices.created_date AS invoice_created_date,
            rooms.name AS room_name,
            rooms.description AS room_description,
            rooms.price AS room_price,
            hotels.hotel_name,
            hotels.hotel_alias,
            hotels.hotel_address,
            hotels.hotel_phone,
            hotels.hotel_email
        FROM 
            invoices
        LEFT JOIN
            rooms ON invoices.room_id = rooms.room_id
        LEFT JOIN
            hotels ON rooms.hotel_id = hotels.hotel_id
        WHERE 
            invoices.transaction_id = ?
            AND invoices.delete_flag = 0 
            AND rooms.delete_flag = 0 
            AND hotels.delete_flag = 0;
    `;

    try {
        const booking = await db.get(query, [transaction_id]);

        console.log(await db.all(`select * from invoices where transaction_id  = ?`, [transaction_id]))

        return booking;
    } catch (err) {
        console.error('Error checking booking:', err);
        throw new Error('Failed to check booking.');
    }
};

module.exports = { tryBooking, tryCheckBooking };
