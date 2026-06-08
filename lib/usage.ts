import type { Plan } from "@prisma/client";

import { PLAN_LIMITS } from "@/lib/plans";
import { prisma } from "@/lib/prisma";

function utcDay() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function getDailyUsage(userId: string) {
  const date = utcDay();

  return prisma.dailyUsage.upsert({
    where: {
      userId_date: {
        userId,
        date
      }
    },
    create: {
      userId,
      date,
      matchesGenerated: 0
    },
    update: {}
  });
}

export async function getRemainingMatches(userId: string, plan: Plan) {
  const limit = PLAN_LIMITS[plan].dailyMatches;

  if (!Number.isFinite(limit)) {
    return Number.POSITIVE_INFINITY;
  }

  const usage = await getDailyUsage(userId);
  return Math.max(0, limit - usage.matchesGenerated);
}

export async function incrementMatchUsage(userId: string, count: number) {
  if (count <= 0) {
    return;
  }

  const date = utcDay();

  await prisma.dailyUsage.upsert({
    where: {
      userId_date: {
        userId,
        date
      }
    },
    create: {
      userId,
      date,
      matchesGenerated: count
    },
    update: {
      matchesGenerated: {
        increment: count
      }
    }
  });
}
