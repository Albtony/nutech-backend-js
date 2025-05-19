const { DataTypes } = require('sequelize');
const { Database } = require('../../../config/db');

const sequelize = Database.getInstance().getSequelizeInstance();

const Banner = sequelize.define('Banner', {
    banner_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    banner_image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'banners',
    timestamps: true,
});

module.exports = Banner;
