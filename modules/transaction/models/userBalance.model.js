const { DataTypes } = require('sequelize');
const { Database } = require('../../../config/db');

const sequelize = Database.getInstance().getSequelizeInstance();

const UserBalance = sequelize.define('UserBalance', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
}, {
    tableName: 'user_balances',
    timestamps: false,
    underscored: true
});

module.exports = UserBalance;