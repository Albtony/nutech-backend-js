const { Database } = require('../config/db');
const sequelize = Database.getInstance().getSequelizeInstance();
const { QueryTypes } = require('sequelize');

const generateInvoiceNumber = async (sequelize, transaction = null) => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `INV${dateStr}-%`;

    const lastInvoiceQuery = `
        SELECT invoice_number
        FROM transactions
        WHERE invoice_number LIKE :prefix
        ORDER BY invoice_number DESC
        LIMIT 1
    `;

    const [lastInvoice] = await sequelize.query(lastInvoiceQuery, {
        replacements: { prefix },
        type: QueryTypes.SELECT,
        transaction,
    });

    let seq = 1;
    if (lastInvoice && lastInvoice.invoice_number) {
        const lastSeqStr = lastInvoice.invoice_number.slice(-3);
        const lastSeqNum = parseInt(lastSeqStr, 10);
        if (!isNaN(lastSeqNum)) {
            seq = lastSeqNum + 1;
        }
    }

    const seqStr = seq.toString().padStart(3, '0');
    return `INV${dateStr}-${seqStr}`;
}

module.exports = { generateInvoiceNumber };
