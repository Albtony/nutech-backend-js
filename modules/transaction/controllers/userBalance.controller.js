const { Database } = require('../../../config/db');
const sequelize = Database.getInstance().getSequelizeInstance();
const { QueryTypes } = require('sequelize');
const { generateInvoiceNumber } = require('../../../utils/generateInvoiceNumber')

const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        const selectQuery = `SELECT balance FROM user_balances WHERE user_id = :userId LIMIT 1`;
        const [result] = await sequelize.query(selectQuery, {
            replacements: { userId },
            type: QueryTypes.SELECT,
        });

        if (!result) {
        return res.status(404).json({
                status: 1,
                message: 'User balance not found',
            });
        }

        return res.status(200).json({
            status: 0,
            message: 'Get Balance Berhasil',
            data: {
                balance: result.balance,
            },
        });
    } catch (error) {
        console.error('[userBalanceController]: Error getting balance:', error);
        return res.status(500).json({
            status: 1,
            message: 'Internal server error',
        });
    }
};

const topUp = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const { top_up_amount } = req.body;
        if (top_up_amount === undefined ||
            typeof top_up_amount !== 'number' ||
            !Number.isInteger(top_up_amount) ||
            top_up_amount <= 0) {
            return res.status(400).json({
                status: 1,
                message: 'Invalid top up amount',
            });
        }

        const invoiceNumber = await generateInvoiceNumber(sequelize, t);
        const selectQuery = `SELECT balance FROM user_balances WHERE user_id = :userId LIMIT 1`;
        const [existing] = await sequelize.query(selectQuery, {
            replacements: { userId },
            type: QueryTypes.SELECT,
            transaction: t,
        });

        if (!existing) {
            const insertQuery = `INSERT INTO user_balances (user_id, balance) VALUES (:userId, :amount)`;
            await sequelize.query(insertQuery, {
                replacements: { userId, amount: top_up_amount },
                transaction: t,
                type: QueryTypes.INSERT,
            });
        } else {
            const newBalance = existing.balance + top_up_amount;
            const updateQuery = `UPDATE user_balances SET balance = :newBalance WHERE user_id = :userId`;
            await sequelize.query(updateQuery, {
                replacements: { newBalance, userId },
                transaction: t,
                type: QueryTypes.UPDATE,
            });
        }

        const insertTransactionQuery = `
            INSERT INTO transactions (
                invoice_number, user_id, transaction_type, description, total_amount, created_on, service_code, service_name
            ) VALUES (
                :invoiceNumber, :userId, 'TOPUP', 'Top Up balance', :amount, NOW(), 'TOPUP', 'Top Up'
            )
        `;
        await sequelize.query(insertTransactionQuery, {
            replacements: { invoiceNumber, userId, amount: top_up_amount },
            transaction: t,
            type: QueryTypes.INSERT,
        });

        await t.commit();
        const [updated] = await sequelize.query(selectQuery, {
            replacements: { userId },
            type: QueryTypes.SELECT,
        });

        return res.status(200).json({
            status: 0,
            message: 'Top Up Balance berhasil',
            data: { balance: updated.balance },
        });
    } catch (error) {
        await t.rollback();
        console.error('[userBalanceController]: Error during top up:', error);
        return res.status(500).json({
            status: 1,
            message: 'Internal server error',
        });
    }
};

module.exports = {
    getBalance,
    topUp,
};