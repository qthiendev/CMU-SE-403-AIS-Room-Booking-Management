const db = require('../../../utilities/database.service');
const dotenv = require('dotenv');
dotenv.config();

const salt = process.env.ENCRYPT_SALT;

const tryLogin = async (account, password) => {
    try {
        const encodedAccount = Buffer.from(account + salt).toString('base64');
        const encodedPassword = Buffer.from(password + salt).toString('base64');

        const row = await db.get(
            `SELECT authentication_id AS aid, password FROM authentications WHERE account = ?`,
            [encodedAccount]
        );

        if (row && row.password === encodedPassword) {
            return row.aid;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error during login: ${error.message}`);
        throw new Error('Internal login error.');
    }
};

module.exports = { tryLogin };
