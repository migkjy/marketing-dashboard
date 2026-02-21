import { db } from "@/db";
import { crmContacts, crmDeals, blogPosts } from "@/db/schema";
import { sql, eq, count, sum } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Total contacts (leads)
    const [contactsResult] = await db
      .select({ total: count() })
      .from(crmContacts);

    // Total deals + total deal amount
    const [dealsResult] = await db
      .select({
        total: count(),
        totalAmount: sum(crmDeals.amount),
      })
      .from(crmDeals);

    // Total published blog posts
    const [postsResult] = await db
      .select({ total: count() })
      .from(blogPosts)
      .where(eq(blogPosts.published, true));

    // Source distribution
    const sourceDistribution = await db
      .select({
        source: crmContacts.source,
        count: count(),
      })
      .from(crmContacts)
      .groupBy(crmContacts.source);

    // Deal pipeline by status
    const dealPipeline = await db
      .select({
        status: crmDeals.status,
        count: count(),
        totalAmount: sum(crmDeals.amount),
      })
      .from(crmDeals)
      .groupBy(crmDeals.status);

    // Recent blog posts (last 10)
    const recentPosts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        category: blogPosts.category,
        author: blogPosts.author,
        published: blogPosts.published,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
      })
      .from(blogPosts)
      .orderBy(sql`${blogPosts.createdAt} DESC`)
      .limit(10);

    return NextResponse.json({
      kpi: {
        totalContacts: contactsResult.total,
        totalDeals: dealsResult.total,
        totalDealAmount: Number(dealsResult.totalAmount) || 0,
        totalPublishedPosts: postsResult.total,
      },
      sourceDistribution,
      dealPipeline,
      recentPosts,
    });
  } catch (error) {
    console.error("Metrics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
