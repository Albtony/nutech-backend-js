const { Database } = require('../../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = Database.getInstance().getSequelizeInstance();
const { QueryTypes } = require('sequelize');

const register = async (req, res) => {
    try {
        const { email, first_name, last_name, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                status: 102,
                message: 'Parameter email tidak sesuai format',
                data: null,
            });
        }

        const checkQuery = 'SELECT id FROM users WHERE email = :email LIMIT 1';
        const [existingUsers] = await sequelize.query(checkQuery, {
            replacements: { email },
            type: QueryTypes.SELECT,
        });

        if (existingUsers) {
            return res.status(400).json({ 
                status: 1, 
                message: 'Email sudah terdaftar', 
                data: null 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = `
            INSERT INTO users (email, password, first_name, last_name, created_at, updated_at)
            VALUES (:email, :password, :first_name, :last_name, NOW(), NOW())
        `;
        await sequelize.query(insertQuery, {
            replacements: {
                email,
                password: hashedPassword,
                first_name,
                last_name,
            },
            type: QueryTypes.INSERT,
        });

        return res.status(200).json({
            status: 0,
            message: 'Registrasi berhasil silahkan login',
            data: null,
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ 
            status: 1, 
            message: 'Internal server error', 
            data: null 
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                status: 102,
                message: 'Parameter email tidak sesuai format',
                data: null,
            });
        }


        const selectQuery = 'SELECT * FROM users WHERE email = :email LIMIT 1';
        const [users] = await sequelize.query(selectQuery, {
            replacements: { email },
            type: QueryTypes.SELECT,
        });

        const user = users;
        if (!user) {
            return res.status(401).json({ 
                status: 1, 
                message: 'Invalid email or password' 
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ 
                status: 1, 
                message: 'Invalid email or password' 
            });
        }

        const token = jwt.sign(
            { data: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        delete user.password;
        return res.json({
            status: 0,
            message: 'Login Sukses',
            data: { token },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ status: 1, message: 'Internal server error' });
    }
};


module.exports = {
    register,
    login,
};
