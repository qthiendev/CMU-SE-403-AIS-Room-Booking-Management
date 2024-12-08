const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseService {
    constructor() {
        this.dbPath = path.join(__dirname, '../database/rbdb.sqlite3');
    }

    _connect() {
        return new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err);
            }
        });
    }

    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            const db = this._connect();
            db.all(sql, params, (err, rows) => {
                db.close();
                if (err) {
                    reject(`Error executing query: ${err.message}`);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            const db = this._connect();
            db.get(sql, params, (err, row) => {
                db.close();
                if (err) {
                    reject(`Error executing query: ${err.message}`);
                } else {
                    resolve(row);
                }
            });
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            const db = this._connect();
            db.run(sql, params, function (err) {
                db.close();
                if (err) {
                    reject(`Error executing query: ${err.message}`);
                } else {
                    if (this.changes > 0) {
                        resolve({ success: true, message: 'Operation successful', changes: this.changes });
                    } else {
                        resolve({ success: false, message: 'No rows affected' });
                    }
                }
            });
        });
    }
}

module.exports = new DatabaseService();
