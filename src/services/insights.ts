import prisma from "../db/db.config";

export const getInsights = async (
  userId: string,
  method: string,
  url: string
) => {
  const endpoint = `${method.toUpperCase()} ${url}`;
  const logs = await prisma.requestLog.findMany({
    where: { userId, method, url },
    orderBy: { createdAt: "desc" },
    take: 50, // limit 50 logs for performance
  });

  if (logs.length < 5) return; // not enough logs yet

  // Insight Calculations
  const avgResponseTime = Math.round(
    logs.reduce((sum, log) => sum + log.responseTimeMs, 0) / logs.length
  );
  const errorRate = logs.filter((log) => log.isError).length / logs.length;
  const slowestResponse = Math.max(...logs.map((log) => log.responseTimeMs));
  const avgPayloadSizeKB = parseFloat(
    (
      logs.reduce((sum, log) => sum + (log.responseSizeKB || 0), 0) /
      logs.length
    ).toFixed(2)
  );

  const statusCodeDistribution: Record<string, number> = {};
  logs.forEach((log) => {
    const code = log.status.toString();
    statusCodeDistribution[code] = (statusCodeDistribution[code] || 0) + 1;
  });

  const mostCommonHeaders = logs[0]?.headers || {};
  const recentOutputs = logs.slice(0, 3).map((log) => log.responseBody);

  const score = Math.max(0, 100 - avgResponseTime - errorRate * 100 * 2);

  // Check if Insight already exists
  const existingInsight = await prisma.insight.findFirst({
    where: { userId, endpoint },
  });

  let returnInsight;

  if (existingInsight) {
    returnInsight = await prisma.insight.update({
      where: { id: existingInsight.id },
      data: {
        avgResponseTime,
        errorRate,
        slowestResponse,
        avgPayloadSizeKB,
        statusCodeDistribution,
        mostCommonHeaders,
        recentOutputs,
        score,
        updatedAt: new Date(),
      },
    });
  } else {
    returnInsight = await prisma.insight.create({
      data: {
        userId,
        endpoint,
        avgResponseTime,
        errorRate,
        slowestResponse,
        avgPayloadSizeKB,
        statusCodeDistribution,
        mostCommonHeaders,
        recentOutputs,
        summary: `Performance insight generated for ${endpoint}`,
        score,
      },
    });
  }

  return returnInsight;
};
