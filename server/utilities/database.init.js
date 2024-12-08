const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/rbdb.sqlite3');

// Function to delete the existing database file if it exists
const deleteDatabase = () => {
    try {
        fs.unlinkSync(dbPath); // Delete the file synchronously
        console.log('Database file deleted');
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('No existing database file found');
        } else {
            console.error('Error deleting database file:', err);
        }
    }
};

// Queries for creating tables
const createTablesQueries = [
    `CREATE TABLE authorizations (
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
        FOREIGN KEY (authorization_id) REFERENCES authorizations(authorization_id)
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
        FOREIGN KEY (authentication_id) REFERENCES authentications(authentication_id)
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
        FOREIGN KEY (user_id) REFERENCES users(user_id)
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
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
    )`,
    `CREATE TABLE invoices (
        invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
        detail NVARCHAR(500) NOT NULL,
        check_in_date DATETIME NOT NULL,
        check_out_date DATETIME NOT NULL,
        pay_amount DECIMAL(10, 2) NOT NULL,
        full_payment INTEGER NOT NULL,
        transaction_id NVARCHAR(255) NULL,
        created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        delete_flag INTEGER NOT NULL DEFAULT 0,
        updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        room_id INTEGER NOT NULL,
        FOREIGN KEY (room_id) REFERENCES rooms(room_id)
    )`
];

const initDb = () => {
    db.serialize(() => {
        // Create tables one by one
        createTablesQueries.forEach((query, index) => {
            db.run(query, (err) => {
                if (err) {
                    console.error(`Error creating table ${index + 1}:`, err);
                } else {
                    console.log(`Table ${index + 1} created or already exists`);
                }
            });
        });

        // After running the queries, check which tables exist
        db.each("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('authorizations', 'authentications', 'users', 'hotels', 'rooms', 'invoices');", (err, row) => {
            if (err) {
                console.error('Error fetching specific tables:', err);
            } else {
                console.log('Table exists:', row.name); // Log specific table names
            }
        });
    });
};

// Delete the old database before opening it
deleteDatabase();

// Open the database, initialize tables, and then close the connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
        return;
    }
    console.log('Database file created successfully');
    
    // Initialize the database tables
    initDb();
    
    // Close the database after everything is done
    db.close((err) => {
        if (err) {
            console.error('Error closing database', err);
        } else {
            console.log('Database closed successfully');
        }
    });
});
