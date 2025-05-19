require('dotenv').config();
require('./modules/models');

const app = require('./app');
const { Database } = require('./config/db');
const PORT = process.env.PORT || 3000;

const db = Database.getInstance().getSequelizeInstance();

async function startServer() {
    try {
        await db.authenticate();
        console.log('[server]: Connected to the database');

        await db.sync({ alter: true });
        console.log('[server]: Models synchronized with the database');

        app.listen(PORT, () => {
            console.log(`[server]: Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('[server]: Error connecting to the database:', error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    console.log('[server]: Closing DB connection...');
    await db.close();
    process.exit(0);
});

startServer();