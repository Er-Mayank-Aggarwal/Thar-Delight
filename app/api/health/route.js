import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "connected";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    console.error("Healthcheck DB ping error:", err);
    dbStatus = "disconnected";
  }

  const responseTime = Date.now() - startTime;
  const isHealthy = dbStatus === "connected";

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbStatus,
      latencyMs: responseTime,
    },
    { status: isHealthy ? 200 : 503 }
  );
}

