const { tryRegister } = require('./register.model');

const register = async (req, res) => {
    const { account, password, email } = req.body;

    if (!account || !password || !email) {
        return res.status(400).json({ status: 'FAILED', message: 'All fields are required' });
    }

    try {
        const result = await tryRegister(account, password, email);

        if (result.status === 'SUCCESS')
            return res.status(200).json(result);

        if (result.status === 'ALREADY')
            return res.status(403).json(result);

        if (result.status === 'FAILED')
            return res.status(400).json(result);

        throw new Error('Cannot handle');
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 'FAILED', message: 'Internal server error' });
    }
};

module.exports = { register };
