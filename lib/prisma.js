import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/client';
import ws from 'ws';

// Set up WebSocket constructor for Neon (required in Node.js server environments)
neonConfig.webSocketConstructor = ws;

let connectionString = process.env.DATABASE_URL;

// Strip quotes if they were accidentally included in the environment variable
if (connectionString && connectionString.startsWith('"') && connectionString.endsWith('"')) {
  connectionString = connectionString.slice(1, -1);
}

if (!connectionString || connectionString === 'undefined' || connectionString.trim() === '') {
  console.error("CRITICAL: DATABASE_URL is literally undefined or empty in this environment!");
  console.log("ENV LOG:", {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PHASE: process.env.NEXT_PHASE,
    NODE_ENV: process.env.NODE_ENV,
    keys: Object.keys(process.env).filter(k => k.includes('DB') || k.includes('DATA'))
  });
  connectionString = "postgresql://localhost"; // Fallback to prevent immediate crash, though queries will fail
}

const createPrismaClient = () => {
  try {
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter });
  } catch (err) {
    console.error("Prisma Client creation failed:", err);
    throw err;
  }
};

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
