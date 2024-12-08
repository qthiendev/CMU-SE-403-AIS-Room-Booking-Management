const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/rbdb-v1.sqlite3');

const deleteDatabase = () => {
    try {
        fs.unlinkSync(dbPath);
        console.log('Database file deleted');
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('Error deleting database file:', err);
        }
    }
};

const createTablesQueries = [
    `PRAGMA foreign_keys = ON;
    CREATE TABLE authorizations (
        authorization_id INTEGER PRIMARY KEY AUTOINCREMENT,
        role NVARCHAR(255) UNIQUE NOT NULL
    )`,
    
    `CREATE TABLE authentications (
        authentication_id INTEGER PRIMARY KEY AUTOINCREMENT,
        account BLOB UNIQUE NOT NULL,
        password BLOB NOT NULL,
        identifer_email BLOB UNIQUE NOT NULL,
        created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        delete_flag INTEGER NOT NULL DEFAULT 0,
        updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        authorization_id INTEGER NOT NULL,
        FOREIGN KEY (authorization_id) REFERENCES authorizations(authorization_id) ON DELETE RESTRICT ON UPDATE RESTRICT
    )`,
    
    `CREATE TABLE users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_full_name NVARCHAR(255) NOT NULL,
        user_alias NVARCHAR(255) UNIQUE NOT NULL,
        user_address NVARCHAR(255) NOT NULL,
        user_phone NVARCHAR(20) NOT NULL,
        user_email NVARCHAR(255) NOT NULL,
        created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        delete_flag INTEGER NOT NULL DEFAULT 0,
        updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        authentication_id INTEGER NOT NULL,
        FOREIGN KEY (authentication_id) REFERENCES authentications(authentication_id) ON DELETE RESTRICT ON UPDATE RESTRICT
    )`,
    
    `CREATE TABLE hotels (
        hotel_id INTEGER PRIMARY KEY AUTOINCREMENT,
        hotel_name NVARCHAR(255) NOT NULL,
        hotel_alias NVARCHAR(255) UNIQUE NOT NULL,
        hotel_description NVARCHAR(500) NOT NULL,
        hotel_address NVARCHAR(255) NOT NULL,
        hotel_phone NVARCHAR(20) NOT NULL,
        hotel_email NVARCHAR(255) NOT NULL,
        created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        delete_flag INTEGER NOT NULL DEFAULT 0,
        updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE RESTRICT
    )`,
    
    `CREATE TABLE rooms (
        room_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(500) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        available_flag INTEGER NOT NULL DEFAULT 1,
        created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        delete_flag INTEGER NOT NULL DEFAULT 0,
        updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        hotel_id INTEGER NOT NULL,
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE RESTRICT ON UPDATE RESTRICT
    )`,
    
    `CREATE TABLE invoices (
        invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
        detail NVARCHAR(500) NOT NULL,
        customer_email NVARCHAR(500),
        customer_phone NVARCHAR(20) NOT NULL,
        check_in_date DATETIME NOT NULL,
        check_out_date DATETIME NOT NULL,
        pay_amount DECIMAL(10, 2) NOT NULL,
        full_payment INTEGER NOT NULL,
        transaction_id NVARCHAR(255) NULL,
        created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        delete_flag INTEGER NOT NULL DEFAULT 0,
        updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        room_id INTEGER NOT NULL,
        FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE RESTRICT ON UPDATE RESTRICT
    )`
];

const initDb = () => {
    db.serialize(() => {
        createTablesQueries.forEach((query, index) => {
            db.run(query, (err) => {
                if (err) {
                    console.error(`Error creating table ${index + 1}:`, err);
                } else {
                    console.log(`Table ${index + 1} created or already exists`);
                }
            });
        });

        db.each("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('authorizations', 'authentications', 'users', 'hotels', 'rooms', 'invoices');", (err, row) => {
            if (err) {
                console.error('Error fetching specific tables:', err);
            } else {
                console.log('Table exists:', row.name);
            }
        });
    });
};

deleteDatabase();

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
        return;
    }
    console.log('Database file created successfully');
    initDb();
    db.close((err) => {
        if (err) {
            console.error('Error closing database', err);
        } else {
            console.log('Database closed successfully');
        }
    });
});
