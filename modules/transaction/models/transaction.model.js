const { DataTypes } = require('sequelize');
const { Database } = require('../../../config/db');

const sequelize = Database.getInstance().getSequelizeInstance();

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    invoice_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    service_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    service_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    transaction_type: {
        type: DataTypes.ENUM('PAYMENT', 'TOPUP'),
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,   
        allowNull: true,       
    },
    created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'transactions',
    timestamps: false,
});

module.exports = Transaction;