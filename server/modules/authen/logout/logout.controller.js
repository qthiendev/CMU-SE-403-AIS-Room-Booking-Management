const logout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to log out' });
            }

            res.clearCookie('connect.sid', { httpOnly: true });

            return res.status(200).json({ message: 'Successfully logged out' });
        });
    } catch (error) {
        console.error('Error during logout:', error.message);
        return res.status(500).json({ error: 'Internal server error during logout' });
    }
};

module.exports = { logout };
