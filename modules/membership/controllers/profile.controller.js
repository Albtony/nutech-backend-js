const { Database } = require('../../../config/db');
const sequelize = Database.getInstance().getSequelizeInstance();
const { QueryTypes } = require('sequelize');

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const selectQuery = 'SELECT id, first_name, last_name, email, profile_image FROM users WHERE id = :id';
        const [user] = await sequelize.query(selectQuery, {
            replacements: { id: userId },
            type: QueryTypes.SELECT,
        });

        if (!user) {
            return res.status(404).json({
                status: 1,
                message: 'User tidak ditemukan',
                data: null,
            });
        }

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: user.profile_image,
            },
        });
    } catch (error) {
        console.error('[profileController]: Error fetching profile:', error);
        res.status(500).json({ 
            status: 1, 
            message: 'Internal server error' 
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { first_name, last_name } = req.body;

        const updateQuery = `UPDATE users SET first_name = :first_name, last_name = :last_name WHERE id = :id` 
        await sequelize.query(updateQuery, {
            replacements: { id: userId, first_name, last_name },
            type: QueryTypes.UPDATE,
        });

        const selectQuery = `SELECT email, first_name, last_name, profile_image FROM users WHERE id = :id` 
        const [user] = await sequelize.query(selectQuery, {
            replacements: { id: userId },
            type: QueryTypes.SELECT,
        });

        return res.status(200).json({
            status: 0,
            message: 'Update Profile berhasil',
            data: user,
        });
    } catch (error) {
        console.error('[profileController]: Error updating profile:', error);
        res.status(500).json({ 
            status: 1, 
            message: 'Internal server error' 
        });
    }
};

// TODO: Implement
const updateProfileImage = async (req, res) => {
    return res.status(501).json({
        status: 1,
        message: "Update Profile Image not implemented yet",
        data: null,
    });
};

module.exports = {
    getProfile,
    updateProfile,
    updateProfileImage,
};
