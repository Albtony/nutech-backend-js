const { Database } = require('../../../config/db');
const sequelize = Database.getInstance().getSequelizeInstance();
const { QueryTypes } = require('sequelize');
const { generateInvoiceNumber } = require('../../../utils/generateInvoiceNumber')

const postTransaction = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const { service_code } = req.body;

        if (!service_code || typeof service_code !== 'string') {
            return res.status(400).json({
                status: 1,
                message: 'Service code is required and must be a string',
            });
        }

        const serviceQuery = `SELECT service_code, service_name, service_tariff FROM services WHERE service_code = :service_code LIMIT 1`;
        const service = await sequelize.query(serviceQuery, {
            replacements: { service_code },
            type: QueryTypes.SELECT,
            transaction: t,
        });

        if (!service.length) {
            await t.rollback();
            return res.status(400).json({
                status: 102,
                message: 'Service ataus Layanan tidak ditemukan',
                data: null,
            });
        }

        const { service_code: code, service_name, service_tariff } = service[0];
        const balanceQuery = `SELECT balance FROM user_balances WHERE user_id = :userId LIMIT 1`;
        const balanceResult = await sequelize.query(balanceQuery, {
            replacements: { userId },
            type: QueryTypes.SELECT,
            transaction: t,
        });

        if (!balanceResult.length || balanceResult[0].balance < service_tariff) {
            await t.rollback();
            return res.status(400).json({
                status: 103,
                message: 'Saldo tidak cukup',
                data: null,
            });
        }

        const newBalance = balanceResult[0].balance - service_tariff;
        const updateBalanceQuery = `
            UPDATE user_balances 
            SET balance = :newBalance 
            WHERE user_id = :userId`;
        await sequelize.query(updateBalanceQuery, {
            replacements: { newBalance, userId },
            type: QueryTypes.UPDATE,
            transaction: t,
        });

        const invoice_number = await generateInvoiceNumber(sequelize, t);
        const transactionInsertQuery = `
            INSERT INTO transactions 
            (invoice_number, user_id, service_code, service_name, transaction_type, total_amount, created_on)
            VALUES (:invoice_number, :userId, :service_code, :service_name, 'PAYMENT', :total_amount, NOW())
        `;
        
        await sequelize.query(transactionInsertQuery, {
            replacements: {
                invoice_number,
                userId,
                service_code,
                service_name,
                total_amount: service_tariff,
            },
            type: QueryTypes.INSERT,
            transaction: t,
        });

        await t.commit();
        return res.status(200).json({
            status: 0,
            message: 'Transaksi berhasil',
            data: {
                invoice_number,
                service_code: code,
                service_name,
                transaction_type: 'PAYMENT',
                total_amount: service_tariff,
                created_on: new Date().toISOString(),
            },
        });
    } catch (error) {
        await t.rollback();
        console.error('[transactionController]: Error during transaction:', error);
        return res.status(500).json({
            status: 1,
            message: 'Internal server error',
        });
    }
};

const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        let { offset, limit } = req.query;
        offset = parseInt(offset) || 0;
        limit = parseInt(limit) || 10;

        const historyQuery = `
            SELECT 
                t.invoice_number,
                t.transaction_type,
                s.service_name AS description,
                t.total_amount,
                t.created_on
            FROM transactions t
            LEFT JOIN services s ON t.service_code = s.service_code
            WHERE t.user_id = :userId
            ORDER BY t.created_on DESC
            LIMIT :limit OFFSET :offset
        `;

        const records = await sequelize.query(historyQuery, {
            replacements: { userId, limit, offset },
            type: QueryTypes.SELECT,
        });

        return res.status(200).json({
            status: 0,
            message: 'Get History Berhasil',
            data: {
                offset,
                limit,
                records,
            },
        });
    } catch (error) {
        console.error('[transactionController]: Error getting history:', error);
        return res.status(500).json({
            status: 1,
            message: 'Internal server error',
        });
    }
};

module.exports = {
    postTransaction,
    getTransactionHistory
};