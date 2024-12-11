const db = require('../../../utilities/database.service');
const dotenv = require('dotenv');
dotenv.config();

const tryRegister = async (account, password, email) => {
    try {
        const salt = process.env.ENCRYPT_SALT;

        const encodedAccount = Buffer.from(account + salt).toString('base64');
        const encodedPassword = Buffer.from(password + salt).toString('base64');
        const encodedEmail = Buffer.from(email + salt).toString('base64');
    
        const row = await db.get(
            `SELECT 1 FROM authentications WHERE account = ? OR identifer_email = ?`,
            [encodedAccount, encodedEmail]
        );
    
        if (row) {
            return { status: 'ALREADY', message: 'Account or email already exists' };
        }
    
        const insertSql = 'INSERT INTO authentications (account, password, identifer_email, authorization_id) VALUES (?, ?, ?, ?)';
        const insertParams = [encodedAccount, encodedPassword, encodedEmail, 2];

        const result = await db.run(insertSql, insertParams);

        if (result.success) {
            return { status: 'SUCCESS', message: 'User registered successfully' };
        } else {
            return { status: 'FAILED', message: 'An error occurred while registering the user' };
        }
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = { tryRegister };
