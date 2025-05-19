const { DataTypes } = require('sequelize');
const { Database } = require('../../../config/db');

const sequelize = Database.getInstance().getSequelizeInstance();

const Service = sequelize.define('Service', {
    service_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    service_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    service_icon: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    service_tariff: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    }, {
    tableName: 'services',
    timestamps: true,
    underscored: true,
});

module.exports = Service;
