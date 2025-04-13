import prisma from "../db/db.config";
import { generateMockSuggestion } from "../helpers/mockSuggestions";
import { paperclipAPIscore } from "../helpers/paperclipScore";

export const getInsights = async (requestId: string) => {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!request) return;

  const logs = await prisma.requestLog.findMany({
    where: { requestId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Only generate insight after 5 logs
  if (logs.length < 5) return;

  // Calculate metrics
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

  // const score = Math.max(0, 100 - avgResponseTime - errorRate * 100 * 2);

  const tips = generateMockSuggestion({
    avgResponseTime,
    errorRate,
    slowestResponse,
  });

  const insights = {
    avgResponseTime,
    slowestResponse,
    errorRate,
    avgPayloadSizeKB,
    statusCodeDistribution,
  };

  const paperclipScore = paperclipAPIscore(insights);

  // Check if Insight already exists
  const existingInsight = await prisma.insight.findFirst({
    where: { requestId },
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
        score: paperclipScore,
        aiTips: tips,
        updatedAt: new Date(),
      },
    });
  } else {
    returnInsight = await prisma.insight.create({
      data: {
        requestId,
        avgResponseTime,
        errorRate,
        slowestResponse,
        avgPayloadSizeKB,
        statusCodeDistribution,
        mostCommonHeaders,
        recentOutputs,
        score: paperclipScore,
        aiTips: tips,
        summary: `Performance insight generated for ${request.method.toUpperCase()} ${
          request.url
        }`,
      },
    });
  }

  return returnInsight;
};
