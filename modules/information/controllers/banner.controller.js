const { Database } = require('../../../config/db');
const sequelize = Database.getInstance().getSequelizeInstance();
const { QueryTypes } = require('sequelize');

const getAllBanners = async (req, res) => {
    try {
        const banners = await sequelize.query(
            'SELECT banner_name, banner_image, description FROM banners',
            { type: QueryTypes.SELECT }
        );

        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: banners,
        });
    } catch (error) {
        console.error('[bannerController]: Error fetching banners', error);
        res.status(500).json({ status: 99, message: 'Internal server error' });
    }
};

// UTIL
const createBanner = async (req, res) => {
    const { banner_name, banner_image, description } = req.body;

    if (!banner_name || !banner_image) {
        return res.status(400).json({ message: 'banner_name and banner_image are required' });
    }

    try {
        await sequelize.query(
            'INSERT INTO banners (banner_name, banner_image, description, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
            {
                replacements: [banner_name, banner_image, description || null],
                type: QueryTypes.INSERT,
            }
        );
        res.status(201).json({ message: 'Banner created successfully' });
    } catch (error) {
        console.error('[bannerController]: Error creating banner', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// UTIL
const deleteBanner = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await sequelize.query(
            'DELETE FROM banners WHERE id = ?',
            {
                replacements: [id],
                type: QueryTypes.DELETE,
            }
        );

        if (result[1] === 0) {
        return res.status(404).json({ message: 'Banner not found' });
        }

        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
        console.error('[bannerController]: Error deleting banner', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllBanners,
    createBanner,
    deleteBanner,
};
