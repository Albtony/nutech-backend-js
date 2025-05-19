const { Sequelize } = require('sequelize');
require('dotenv').config();

class Database {
    constructor() {
        if (!Database.instance) {
        this.sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                dialect: process.env.DB_DIALECT || 'mysql',
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000,
                },
            }
        );

            Database.instance = this;
        }

        return Database.instance;
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
            return Database.instance;
    }

    getSequelizeInstance() {
        return this.sequelize;
    }

    async authenticate() {
        try {
            await this.sequelize.authenticate();
            console.log('[DB] Connected to the database.');
        } catch (err) {
            console.error('[DB] Connection failed:', err);
        }
    }

    async closeConnection() {
        try {
            await this.sequelize.close();
            console.log('[DB] Connection closed.');
        } catch (err) {
            console.error('[DB] Failed to close connection:', err);
        }
    }
}

module.exports = {
    Database
};
