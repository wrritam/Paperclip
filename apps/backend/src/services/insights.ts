import prisma from "../db/db.config";
import { paperclipAPIscore } from "../helpers/paperclip-score";

export const getInsights = async (requestId: string) => {
  const [request, logs] = await Promise.all([
    prisma.request.findUnique({ where: { id: requestId } }),
    prisma.requestLog.findMany({
      where: { requestId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  if (!request || logs.length < 5) return;

  const metrics = logs.reduce(
    (acc, log) => ({
      totalResponseTime: acc.totalResponseTime + log.responseTimeMs,
      totalPayloadSize: acc.totalPayloadSize + (log.responseSizeKB || 0),
      errorCount: acc.errorCount + (log.isError ? 1 : 0),
      slowestResponse: Math.max(acc.slowestResponse, log.responseTimeMs),
      statusCodes: {
        ...acc.statusCodes,
        [log.status]: (acc.statusCodes[log.status] || 0) + 1,
      },
    }),
    {
      totalResponseTime: 0,
      totalPayloadSize: 0,
      errorCount: 0,
      slowestResponse: 0,
      statusCodes: {} as Record<string, number>,
    }
  );

  const mostCommonHeaders = logs[0]?.headers || {};
  const recentOutputs = logs.slice(0, 3).map((log) => log.responseBody);

  const insights = {
    avgResponseTime: Math.round(metrics.totalResponseTime / logs.length),
    slowestResponse: metrics.slowestResponse,
    errorRate: metrics.errorCount / logs.length,
    avgPayloadSizeKB: parseFloat(
      (metrics.totalPayloadSize / logs.length).toFixed(2)
    ),
    statusCodeDistribution: metrics.statusCodes,
  };

  const paperclipScore = paperclipAPIscore(insights);

  const existingInsight = await prisma.insight.findFirst({
    where: { requestId },
  });

  const insightData = {
    avgResponseTime: insights.avgResponseTime,
    errorRate: insights.errorRate,
    slowestResponse: insights.slowestResponse,
    avgPayloadSizeKB: insights.avgPayloadSizeKB,
    statusCodeDistribution: insights.statusCodeDistribution,
    mostCommonHeaders,
    recentOutputs,
    score: paperclipScore,
  };

  const returnInsight = existingInsight
    ? await prisma.insight.update({
        where: { id: existingInsight.id },
        data: { ...insightData, updatedAt: new Date() },
      })
    : await prisma.insight.create({
        data: { requestId, ...insightData },
      });

  return returnInsight;
};
