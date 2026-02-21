"use client";

import { useEffect, useState } from "react";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { SourceChart } from "@/components/dashboard/source-chart";
import { PipelineSummary } from "@/components/dashboard/pipeline-summary";
import { RecentPosts } from "@/components/dashboard/recent-posts";

interface MetricsData {
  kpi: {
    totalContacts: number;
    totalDeals: number;
    totalDealAmount: number;
    totalPublishedPosts: number;
  };
  sourceDistribution: { source: string; count: number }[];
  dealPipeline: {
    status: string;
    count: number;
    totalAmount: string | number | null;
  }[];
  recentPosts: {
    id: string;
    title: string;
    slug: string;
    category: string | null;
    author: string | null;
    published: boolean | null;
    publishedAt: string | null;
    createdAt: string | null;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/metrics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch metrics");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Marketing Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            CRM & content metrics overview
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        <KpiCards data={data.kpi} />
        <div className="grid gap-6 md:grid-cols-2">
          <SourceChart data={data.sourceDistribution} />
          <PipelineSummary data={data.dealPipeline} />
        </div>
        <RecentPosts data={data.recentPosts} />
      </main>
    </div>
  );
}
