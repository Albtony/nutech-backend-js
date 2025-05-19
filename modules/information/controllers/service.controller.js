const { Database } = require('../../../config/db');
const sequelize = Database.getInstance().getSequelizeInstance();
const { QueryTypes } = require('sequelize');

const getAllServices = async (req, res) => {
    try {
        const selectQuery = 'SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY service_name ASC';
        const services = await sequelize.query(selectQuery, {
            type: QueryTypes.SELECT,
        });

        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: services,
        });
    } catch (error) {
            console.error('[serviceController] Error fetching services:', error);
            res.status(500).json({
            status: 1, 
            message: 'Internal server error' 
        });
    }
}


// UTIL
const createService = async (req, res) => {
    const { service_code, service_name, service_icon, service_tariff } = req.body;

    if (!service_code || !service_name || !service_icon || service_tariff == null) {
            return res.status(400).json({
            status: 1,
            message: 'Missing required fields',
        });
    }

    try {
        await sequelize.query(
            `INSERT INTO services (service_code, service_name, service_icon, service_tariff, created_at, updated_at)
            VALUES (?, ?, ?, ?, NOW(), NOW())`,
            {
                replacements: [service_code, service_name, service_icon, service_tariff],
                type: sequelize.QueryTypes.INSERT,
            }
        );

        return res.status(201).json({
            status: 0,
            message: 'Service created successfully',
            data: { service_code, service_name, service_icon, service_tariff },
        });
    } catch (error) {
        console.error('[serviceController] Error creating service:', error);
        return res.status(500).json({
            status: 1,
            message: 'Failed to create service',
        });
    }
}


// UTIL
const deleteService = async (req, res) => {
    const { service_code } = req.params;

    if (!service_code) {
        return res.status(400).json({
        status: 1,
        message: 'Service code is required',
        });
    }

    try {
        const [result] = await sequelize.query(
        `DELETE FROM services WHERE service_code = ?`,
        {
            replacements: [service_code],
            type: sequelize.QueryTypes.DELETE,
        }
        );

        return res.status(200).json({
        status: 0,
        message: 'Service deleted successfully',
        data: null,
        });
    } catch (error) {
        console.error('[serviceController] Error deleting service:', error);
        return res.status(500).json({
        status: 1,
        message: 'Failed to delete service',
        });
    }
}


module.exports = {
    getAllServices,
    createService,
    deleteService
};
