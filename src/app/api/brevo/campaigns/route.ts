import { getCampaigns } from "@/lib/brevo-api";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getCampaigns(20);

    const campaigns = data.campaigns.map((c) => {
      const stats = c.statistics?.globalStats;
      const sent = stats?.sent || 0;
      const viewed = stats?.uniqueViews || 0;
      const clicked = stats?.uniqueClicks || 0;

      return {
        id: c.id,
        name: c.name,
        status: c.status,
        sentDate: c.sentDate || null,
        sent,
        opened: viewed,
        openRate: sent > 0 ? Math.round((viewed / sent) * 100 * 10) / 10 : 0,
        clicked,
        clickRate: sent > 0 ? Math.round((clicked / sent) * 100 * 10) / 10 : 0,
        unsubscribed: stats?.unsubscriptions || 0,
      };
    });

    return NextResponse.json({
      campaigns,
      totalCampaigns: data.count,
    });
  } catch (error) {
    console.error("Brevo campaigns API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign data" },
      { status: 500 }
    );
  }
}
