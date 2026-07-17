import './config/env.ts';

import app from './app.ts';
import db from './config/db.ts';
import prisma from './config/prisma.ts';

const PORT = process.env.PORT || 5000;

console.log("DB URL:", process.env.DATABASE_URL);

async function startServer() {
    try {
        await db.query('SELECT 1');
        console.log("PostgreSQL connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Failed to connect to PostgreSQL:", err);
        process.exit(1);
    }
}

startServer();

async function test() {
  await prisma.$connect();
  console.log("Prisma connected successfully");
}

test();