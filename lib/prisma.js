import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/client';
import ws from 'ws';

// Set up WebSocket constructor for Neon (required in Node.js server environments)
neonConfig.webSocketConstructor = ws;

let connectionString = process.env.DATABASE_URL;

// Strip quotes if they were accidentally included in the environment variable (common in Vercel/Netlify)
if (connectionString && connectionString.startsWith('"') && connectionString.endsWith('"')) {
  connectionString = connectionString.slice(1, -1);
}

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

// Helper to configure the adapter and Prisma Client
const createPrismaClient = () => {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
