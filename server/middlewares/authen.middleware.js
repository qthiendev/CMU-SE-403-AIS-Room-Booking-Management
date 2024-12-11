const isLogin = async (req, res, next) => {
    if (req.session && typeof req.session.aid === 'number' && req.session.aid > 0) {
        return next();
    } else {
        return res.status(400).json({ status: 'logout' });
    }
};

const isLogout = async (req, res, next) => {
    if (!req.session || typeof req.session.aid !== 'number' || req.session.aid <= 0) {
        return next();
    } else {
        return res.status(400).json({ status: 'login' });
    }
};

module.exports = { isLogin, isLogout };
