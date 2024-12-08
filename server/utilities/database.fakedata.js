const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const salt = process.env.ENCRYPT_SALT;

const dbPath = path.join(__dirname, '../database/rbdb.sqlite3');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
        return;
    }
    console.log('Database opened successfully');
});


async function checkAndInsert(query, params, tableName, uniqueField) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM ${tableName} WHERE ${uniqueField} = ?`, [params[0]], (err, row) => {
            if (err) {
                reject(`Error checking existing data in ${tableName}: ${err.message}`);
            } else {
                if (row) {
                    console.log(`Record with ${uniqueField} '${params[0]}' already exists in ${tableName}. Skipping insert.`);
                    resolve();
                } else {
                    db.run(query, params, function (err) {
                        if (err) {
                            reject(`Error inserting data into ${tableName}: ${err.message}`);
                        } else {
                            console.log(`Data inserted into ${tableName} with ID ${this.lastID}`);
                            resolve();
                        }
                    });
                }
            }
        });
    });
}

async function insertAuthorizations() {
    const insertQuery = `INSERT INTO authorizations (role) VALUES (?)`;
    const roles = ['Admin', 'Manager'];

    for (const role of roles) {
        try {
            await checkAndInsert(insertQuery, [role], 'authorizations', 'role');
        } catch (error) {
            console.error(error);
        }
    }
}

const insertAuthentications = async () => {
    const insertQuery = `INSERT INTO authentications (account, password, identifer_email, authorization_id) VALUES (?, ?, ?, ?)`;
    const accountData = [
        { account: 'admin', password: 'admin123', indentifer_email: 'admin123@gmail.com', role_id: 1 },
        { account: 'user1', password: 'user123', indentifer_email: 'user123@gmail.com', role_id: 2 },
        { account: 'manager1', password: 'manager123', indentifer_email: 'manager123@gmail.com', role_id: 2 },
        { account: 'guest1', password: 'guest123', indentifer_email: 'guest123@gmail.com', role_id: 2 },
        { account: 'johndoe', password: 'john123', indentifer_email: 'john123@gmail.com', role_id: 2 },
        { account: 'janesmith', password: 'jane123', indentifer_email: 'jane123@gmail.com', role_id: 2 },
        { account: 'bobmarley', password: 'bob123', indentifer_email: 'bob123@gmail.com', role_id: 2 },
        { account: 'alicewong', password: 'alice123', indentifer_email: 'alice123@gmail.com', role_id: 2 }
    ];

    for (const { account, password, indentifer_email, role_id } of accountData) {
        try {
            const encodedAccount = Buffer.from(account + salt).toString('base64');
            const encodedPassword = Buffer.from(password + salt).toString('base64');
            const encodedEmail = Buffer.from(indentifer_email + salt).toString('base64');

            await checkAndInsert(insertQuery, [encodedAccount, encodedPassword, encodedEmail, role_id], 'authentications', 'account');
        } catch (error) {
            console.error(error);
        }
    }
};

async function insertUsers() {
    const insertQuery = `INSERT INTO users (user_full_name, user_alias, user_address, user_phone, user_email, authentication_id) VALUES (?, ?, ?, ?, ?, ?)`;

    const userData = [
        ['John Doe', 'johndoe', '123 Main St', '123-456-7890', 'johndoe@example.com', 1],
        ['Jane Smith', 'janesmith', '456 Elm St', '987-654-3210', 'janesmith@example.com', 2],
        ['Bob Marley', 'bobmarley', '789 Oak St', '555-123-4567', 'bobmarley@example.com', 3],
        ['Alice Wong', 'alicewong', '101 Maple St', '555-765-4321', 'alicewong@example.com', 2]
    ];

    for (const user of userData) {
        try {
            await checkAndInsert(insertQuery, user, 'users', 'user_email');
        } catch (error) {
            console.error(error);
        }
    }
}

async function insertHotels() {
    const insertQuery = `INSERT INTO hotels (hotel_name, hotel_alias, hotel_description, hotel_address, hotel_phone, hotel_email, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const hotelsData = [
        ['Hotel California', 'hotelcalifornia', 'A beautiful hotel in the city.', '789 Sunset Blvd', '111-222-3333', 'contact@hotelcalifornia.com', 1],
        ['The Grand Plaza', 'grandplaza', 'Luxury hotel with top-notch amenities.', '123 Luxury St', '444-555-6666', 'info@grandplaza.com', 2]
    ];

    for (const hotel of hotelsData) {
        try {
            await checkAndInsert(insertQuery, hotel, 'hotels', 'hotel_name');
        } catch (error) {
            console.error(error);
        }
    }
}

async function insertRooms() {
    const insertQuery = `INSERT INTO rooms (name, description, price, available_flag, hotel_id) VALUES (?, ?, ?, ?, ?)`;

    const roomsData = [
        ['Room 101', 'Standard Room', 150.00, 1, 1],
        ['Room 102', 'Deluxe Room', 250.00, 1, 1],
        ['Room 201', 'Suite', 400.00, 1, 2]
    ];

    for (const room of roomsData) {
        try {
            await checkAndInsert(insertQuery, room, 'rooms', 'name');
        } catch (error) {
            console.error(error);
        }
    }
}

async function insertInvoices() {
    const insertQuery = `INSERT INTO invoices (detail, check_in_date, check_out_date, pay_amount, full_payment, transaction_id, room_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const invoicesData = [
        ['Room 101 booking', '2024-12-10 14:00:00', '2024-12-15 11:00:00', 750.00, 1, 'TX12345', 1],
        ['Room 102 booking', '2024-12-12 14:00:00', '2024-12-16 11:00:00', 1000.00, 1, 'TX12346', 2]
    ];

    for (const invoice of invoicesData) {
        try {
            await checkAndInsert(insertQuery, invoice, 'invoices', 'transaction_id');
        } catch (error) {
            console.error(error);
        }
    }
}

async function insertFakeData() {
    console.log(`Inserting data into ${dbPath}`);
    await insertAuthorizations();
    await insertAuthentications();
    await insertUsers();
    await insertHotels();
    await insertRooms();
    await insertInvoices();
    db.close((err) => {
        if (err) {
            console.error('Error closing database', err);
        } else {
            console.log('Database closed successfully');
        }
    });
}

insertFakeData();
