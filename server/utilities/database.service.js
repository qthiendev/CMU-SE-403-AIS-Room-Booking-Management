const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing and comparison

const dbPath = path.join(__dirname, '../database/rbdb.sqlite3');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database opened successfully');
    }
});

// Helper function to query the database
const query = (queryString) => {
    return new Promise((resolve, reject) => {
        db.all(queryString, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const login = async (account, password) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM authentications WHERE account = ?', [Buffer.from(account).toString('base64')], async (err, row) => {
            if (err) {
                reject(`Error retrieving account: ${err.message}`);
            } else {
                if (row) {
                    const isPasswordValid = await bcrypt.compare(password, row.password);
                    if (isPasswordValid) {
                        resolve({ message: 'Login successful', user: row });
                    } else {
                        reject('Invalid password');
                    }
                } else {
                    reject('Account not found');
                }
            }
        });
    });
}

module.exports = { query, login };
