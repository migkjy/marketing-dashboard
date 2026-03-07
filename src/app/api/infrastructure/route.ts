import { fetchAllZonesAnalytics } from "@/lib/cloudflare-api";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const days = Number(searchParams.get("days") || "30");
    const site = searchParams.get("site") || "all";

    const zones = await fetchAllZonesAnalytics(days, site);

    // Aggregate totals
    const totals = zones.reduce(
      (acc, z) => ({
        requests: acc.requests + z.totals.requests,
        visitors: acc.visitors + z.totals.visitors,
        bytes: acc.bytes + z.totals.bytes,
      }),
      { requests: 0, visitors: 0, bytes: 0 }
    );

    // Aggregate daily trend (sum across zones)
    const dailyMap = new Map<
      string,
      { requests: number; visitors: number; bytes: number }
    >();
    for (const zone of zones) {
      for (const day of zone.days) {
        const existing = dailyMap.get(day.date) || {
          requests: 0,
          visitors: 0,
          bytes: 0,
        };
        dailyMap.set(day.date, {
          requests: existing.requests + day.requests,
          visitors: existing.visitors + day.visitors,
          bytes: existing.bytes + day.bytes,
        });
      }
    }
    const dailyTrend = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]) => ({ date, ...stats }));

    // Aggregate country distribution (top 10)
    const countryMap = new Map<string, number>();
    for (const zone of zones) {
      for (const day of zone.days) {
        for (const c of day.countryMap) {
          countryMap.set(
            c.clientCountryName,
            (countryMap.get(c.clientCountryName) || 0) + c.requests
          );
        }
      }
    }
    const countryDistribution = Array.from(countryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, requests]) => ({ country, requests }));

    // Per-site summary
    const sites = zones.map((z) => ({
      site: z.site,
      requests: z.totals.requests,
      visitors: z.totals.visitors,
      bandwidth: z.totals.bytes,
    }));

    return NextResponse.json({
      totals,
      dailyTrend,
      countryDistribution,
      sites,
      days,
    });
  } catch (error) {
    console.error("Infrastructure API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch analytics",
      },
      { status: 500 }
    );
  }
}
