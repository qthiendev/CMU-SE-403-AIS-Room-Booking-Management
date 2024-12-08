const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseService {
    constructor() {
        this.dbPath = path.join(__dirname, '../database/rbdb-v1.sqlite3');
        this.db = this._connect();
    }

    _connect() {
        return new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                throw new Error('Error opening database: ' + err.message);
            }
        });
    }

    async query(sql, params = []) {
        try {
            return await this._runQuery(sql, params);
        } catch (err) {
            throw new Error('Error executing query: ' + err.message);
        }
    }

    async get(sql, params = []) {
        try {
            const result = await this._runQuery(sql, params);
            return result[0];
        } catch (err) {
            throw new Error('Error executing query: ' + err.message);
        }
    }

    async all(sql, params = []) {
        try {
            return await this._runQuery(sql, params);
        } catch (err) {
            throw new Error('Error executing query: ' + err.message);
        }
    }

    async _runQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    reject('Error executing query: ' + err.message);
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
