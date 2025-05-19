// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ 
            status: 108, 
            message: 'Token tidak ditemukan', 
            data: null 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if (err) {
            return res.status(400).json({ 
                status: 108, 
                message: 'Token tidak tidak valid atau kadaluwarsa', 
                data: null 
            });
        }

        req.user = { id: userData.data };
        next();
    });
};

module.exports = authenticateToken;
