const { tryLogin } = require('./login.model');

const login = async (req, res) => {
    try {
        const { account, password } = req.body;

        if (!account || !password) {
            return res.status(400).json({ error: 'Account and password are required.' });
        }

        const aid = await tryLogin(account, password);

        if (aid) {
            req.session.aid = aid;
            return res.status(200).json({ aid });
        } else {
            return res.status(401).json({ error: 'Invalid account or password.' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { login };
