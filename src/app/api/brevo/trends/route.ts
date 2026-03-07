import { getRecentSubscribers, getTotalContacts } from "@/lib/brevo-api";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const days = Number(searchParams.get("days") || "30");

    const [recentSubs, currentTotal] = await Promise.all([
      getRecentSubscribers(days),
      getTotalContacts(),
    ]);

    // Build daily trend data
    const dailyMap: Record<string, number> = {};

    // Initialize all days with 0
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().split("T")[0]] = 0;
    }

    // Fill with actual data
    for (const sub of recentSubs) {
      const day = sub.createdAt.split("T")[0];
      if (dailyMap[day] !== undefined) {
        dailyMap[day]++;
      }
    }

    // Convert to sorted array with cumulative
    const trend = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, newSubscribers: count }));

    // Calculate cumulative
    let cumulative = 0;
    const trendWithCumulative = trend.map((t) => {
      cumulative += t.newSubscribers;
      return { ...t, cumulative };
    });

    // Average daily signup rate
    const totalNew = recentSubs.length;
    const avgDaily = days > 0 ? Math.round((totalNew / days) * 10) / 10 : 0;

    // Days to reach KR2-1 target (15,000)
    const remaining = 15000 - currentTotal;
    const daysToTarget = avgDaily > 0 ? Math.ceil(remaining / avgDaily) : null;

    return NextResponse.json({
      trend: trendWithCumulative,
      totalNew,
      avgDaily,
      daysToTarget,
      days,
    });
  } catch (error) {
    console.error("Brevo trends API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trend data" },
      { status: 500 }
    );
  }
}
