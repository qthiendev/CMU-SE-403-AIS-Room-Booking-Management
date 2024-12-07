const express = require('express');
const router = express.Router();
const handle = require('../middlewares/handle.request.js');
const { query, login } = require('../utilities/database.service.js'); 

router.get('/', handle, (req, res) => {
    res.json({ message: 'Server processed your request', result: req.result });
});

router.get('/rbdb', handle, async (req, res) => {
    try {
        const queryString = req.query.q;

        if (!queryString)
            return res.status(400).json({ error: 'No query string provided' });

        const result = await query(queryString);

        res.json({ message: 'Server processed your request', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/login', async (req, res) => {
    const { account, password } = req.query; // Assuming body contains account and password

    if (!account || !password) {
        return res.status(400).json({ error: 'Account and password are required' });
    }

    try {
        const result = await login(account, password); // Call the login function
        res.json(result); // Return success message and user data
    } catch (error) {
        res.status(401).json({ error: error.message }); // Unauthorized if login fails
    }
});

module.exports = router;
