import { getLists, getRecentSubscribers, getTotalContacts } from "@/lib/brevo-api";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const days = Number(searchParams.get("days") || "30");

    const [listsData, totalContacts, recentSubs] = await Promise.all([
      getLists(),
      getTotalContacts(),
      getRecentSubscribers(days),
    ]);

    // Group recent subscribers by day
    const dailyCounts: Record<string, number> = {};
    for (const sub of recentSubs) {
      const day = sub.createdAt.split("T")[0];
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    }

    // Lists summary (exclude test lists)
    const lists = listsData.lists
      .filter((l) => l.uniqueSubscribers > 0)
      .map((l) => ({
        id: l.id,
        name: l.name,
        subscribers: l.uniqueSubscribers,
        blacklisted: l.totalBlacklisted,
      }));

    return NextResponse.json({
      totalContacts,
      newSubscribers: recentSubs.length,
      days,
      lists,
      dailyCounts,
      kr21Target: 15000,
      kr21Progress: Math.round((totalContacts / 15000) * 100 * 10) / 10,
    });
  } catch (error) {
    console.error("Brevo subscribers API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriber data" },
      { status: 500 }
    );
  }
}
