const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const salt = process.env.ENCRYPT_SALT;

const dbPath = path.join(__dirname, '../database/rbdb-v1.sqlite3');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
        return;
    }
    console.log('Database opened successfully');
});


async function checkAndInsert(query, params, tableName, uniqueField) {
    return new Promise((resolve, reject) => {
        if (!uniqueField) {
            db.run(query, params, function (err) {
                if (err) {
                    reject(`Error inserting data into ${tableName}: ${err.message}`);
                } else {
                    console.log(`Data inserted into ${tableName} with ID ${this.lastID}`);
                    resolve();
                }
            });
            return;
        }
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
        ['The Grand Plaza', 'grandplaza', 'Luxury hotel with top-notch amenities.', '123 Luxury St', '444-555-6666', 'info@grandplaza.com', 2],
        ['Oceanview Resort', 'oceanviewresort', 'A serene beachfront resort.', '45 Ocean Ave', '222-333-4444', 'contact@oceanviewresort.com', 3],
        ['Mountain Retreat', 'mountainretreat', 'Tranquil retreat in the mountains.', '100 Summit Rd', '555-666-7777', 'info@mountainretreat.com', 4],
        ['Cityscape Suites', 'cityscapesuites', 'Modern suites with city views.', '25 City Blvd', '333-444-5555', 'hello@cityscapesuites.com', 5],
        ['Lakeside Inn', 'lakesideinn', 'Cozy inn by the lake.', '80 Lakeshore Dr', '888-999-0000', 'contact@lakesideinn.com', 6],
        ['Royal Palace Hotel', 'royalpalacehotel', 'Elegant hotel with royal accommodations.', '150 Palace Rd', '777-888-9999', 'info@royalpalacehotel.com', 7],
        ['Sunny Beach Hotel', 'sunnybeachhotel', 'A sunny beachside hotel perfect for vacations.', '200 Beach Blvd', '666-777-8888', 'info@sunnybeachhotel.com', 8],
        ['The Skylight Hotel', 'skylighthotel', 'High-rise hotel with panoramic views.', '300 Sky Tower Rd', '444-555-6666', 'contact@skylighthotel.com', 9],
        ['Forest Retreat Hotel', 'forestretreathotel', 'A peaceful hotel surrounded by nature.', '500 Forest Rd', '123-456-7890', 'hello@forestretreathotel.com', 10]
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
        // Hotel 1: Oceanview Resort
        ['Room 101', 'Standard Room with Sea View', 150.00, 1, 1],
        ['Room 102', 'Deluxe Room with Private Balcony', 250.00, 1, 1],
        ['Room 103', 'Oceanfront Suite with Jacuzzi', 500.00, 1, 1],
        ['Room 104', 'Budget Room with City View', 90.00, 1, 1],
    
        // Hotel 2: Mountain Retreat
        ['Room 101', 'Luxury Mountain View Suite', 400.00, 1, 2],
        ['Room 102', 'Rustic Cabin with Fireplace', 350.00, 1, 2],
        ['Room 103', 'Hiking Lodge Room', 200.00, 1, 2],
        ['Room 104', 'Family Room with Forest View', 300.00, 1, 2],
    
        // Hotel 3: Urban Chic Hotel
        ['Room 101', 'Single Room with Cityscape', 120.00, 1, 3],
        ['Room 102', 'Double Room with Modern Decor', 180.00, 1, 3],
        ['Room 103', 'Penthouse Suite with Skyline View', 1000.00, 1, 3],
        ['Room 104', 'Executive Suite with Lounge Access', 700.00, 1, 3],
    
        // Hotel 4: Lakeside Inn
        ['Room 101', 'Cozy Lakeside Room', 150.00, 1, 4],
        ['Room 102', 'Lakeview Suite with Balcony', 300.00, 1, 4],
        ['Room 103', 'Romantic Room with Fireplace', 250.00, 1, 4],
        ['Room 104', 'Family Suite by the Lake', 450.00, 1, 4],
    
        // Hotel 5: Royal Palace Hotel
        ['Room 101', 'Royal Suite with Private Pool', 2000.00, 1, 5],
        ['Room 102', 'Deluxe Suite with Royal Decor', 1500.00, 1, 5],
        ['Room 103', 'VIP Room with Exclusive Amenities', 1200.00, 1, 5],
        ['Room 104', 'Garden Suite with Private Terrace', 800.00, 1, 5],
    ];
    
    for (const room of roomsData) {
        try {
            await checkAndInsert(insertQuery, room, null);
        } catch (error) {
            console.error(error);
        }
    }
}



async function insertInvoices() {
    const insertQuery = `INSERT INTO invoices (detail, customer_email, customer_phone, check_in_date, check_out_date, pay_amount, full_payment, transaction_id, room_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const invoicesData = [
        ['Room 101 booking', 'email@gmail.com', '0395075100', '2024-12-10 14:00:00', '2024-12-15 11:00:00', 750.00, 1, 'TX12345', 1],
        ['Room 102 booking', 'email@gmail.com', '0395075100', '2024-12-12 14:00:00', '2024-12-16 11:00:00', 1000.00, 1, 'TX12346', 2]
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
