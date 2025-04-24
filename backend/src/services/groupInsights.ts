import prisma from "../db/db.config";

interface GroupedInsight {
  method: string;
  url: string;
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  avgPayloadSize: number;
  statusCodes: Record<string, number>;
  lastAccessed: Date;
}

export async function getGroupedInsights(
  userId: string
): Promise<GroupedInsight[]> {
  const requests = await prisma.request.findMany({
    where: { userId },
    include: {
      requestLogs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const groupedData: Map<string, GroupedInsight> = new Map();

  for (const request of requests) {
    const key = `${request.method}-${request.url}`;
    const logs = request.requestLogs;
    if (!logs.length) continue;

    const totalRequests = logs.length;
    const avgResponseTime = Math.round(
      logs.reduce((sum, log) => sum + log.responseTimeMs, 0) / totalRequests
    );
    const errorCount = logs.filter((log) => log.isError).length;
    const errorRate = Number((errorCount / totalRequests).toFixed(2));
    const avgPayloadSize = Number(
      (
        logs.reduce((sum, log) => sum + log.responseSizeKB, 0) / totalRequests
      ).toFixed(2)
    );

    const statusCodes: Record<string, number> = {};
    logs.forEach((log) => {
      const code = log.status.toString();
      statusCodes[code] = (statusCodes[code] || 0) + 1;
    });

    groupedData.set(key, {
      method: request.method,
      url: request.url,
      totalRequests,
      avgResponseTime,
      errorRate,
      avgPayloadSize,
      statusCodes,
      lastAccessed: logs[0].createdAt,
    });
  }

  return Array.from(groupedData.values()).sort(
    (a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime()
  );
}
