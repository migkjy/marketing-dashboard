"use client";

import { useEffect, useState, useCallback } from "react";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { SourceChart } from "@/components/dashboard/source-chart";
import { PipelineSummary } from "@/components/dashboard/pipeline-summary";
import { RecentPosts } from "@/components/dashboard/recent-posts";
import { DateRangeFilter } from "@/components/dashboard/date-range-filter";
import { SiteSelector } from "@/components/dashboard/site-selector";
import { SubscriberKpi } from "@/components/dashboard/subscriber-kpi";
import { SubscriberTrendChart } from "@/components/dashboard/subscriber-trend-chart";
import { CampaignTable } from "@/components/dashboard/campaign-table";

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

interface SubscriberData {
  totalContacts: number;
  newSubscribers: number;
  days: number;
  lists: { id: number; name: string; subscribers: number }[];
  dailyCounts: Record<string, number>;
  kr21Target: number;
  kr21Progress: number;
}

interface TrendData {
  trend: { date: string; newSubscribers: number; cumulative: number }[];
  totalNew: number;
  avgDaily: number;
  daysToTarget: number | null;
  days: number;
}

interface CampaignData {
  campaigns: {
    id: number;
    name: string;
    status: string;
    sentDate: string | null;
    sent: number;
    opened: number;
    openRate: number;
    clicked: number;
    clickRate: number;
    unsubscribed: number;
  }[];
  totalCampaigns: number;
}

type Tab = "subscribers" | "crm";

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("subscribers");
  const [days, setDays] = useState(30);
  const [site, setSite] = useState("all");

  // CRM data
  const [crmData, setCrmData] = useState<MetricsData | null>(null);
  const [crmError, setCrmError] = useState<string | null>(null);
  const [crmLoading, setCrmLoading] = useState(true);

  // Brevo data
  const [subData, setSubData] = useState<SubscriberData | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [brevoLoading, setBrevoLoading] = useState(true);
  const [brevoError, setBrevoError] = useState<string | null>(null);

  // Fetch CRM data
  useEffect(() => {
    fetch("/api/metrics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch CRM metrics");
        return res.json();
      })
      .then(setCrmData)
      .catch((err) => setCrmError(err.message))
      .finally(() => setCrmLoading(false));
  }, []);

  // Fetch Brevo data
  const fetchBrevo = useCallback(async (d: number) => {
    setBrevoLoading(true);
    setBrevoError(null);
    try {
      const [subRes, trendRes, campRes] = await Promise.all([
        fetch(`/api/brevo/subscribers?days=${d}`),
        fetch(`/api/brevo/trends?days=${d}`),
        fetch("/api/brevo/campaigns"),
      ]);

      if (!subRes.ok || !trendRes.ok || !campRes.ok) {
        throw new Error("Failed to fetch Brevo data");
      }

      const [sub, trend, camp] = await Promise.all([
        subRes.json(),
        trendRes.json(),
        campRes.json(),
      ]);

      setSubData(sub);
      setTrendData(trend);
      setCampaignData(camp);
    } catch (err) {
      setBrevoError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBrevoLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrevo(days);
  }, [days, fetchBrevo]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Marketing Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Subscribers, CRM & content metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SiteSelector value={site} onChange={setSite} />
              <DateRangeFilter value={days} onChange={setDays} />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mt-4 border-b -mb-px">
            <button
              onClick={() => setTab("subscribers")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === "subscribers"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Subscribers
            </button>
            <button
              onClick={() => setTab("crm")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === "crm"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              CRM & Content
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {tab === "subscribers" && (
          <>
            {brevoLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading Brevo data...</div>
              </div>
            ) : brevoError ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-destructive">Error: {brevoError}</div>
              </div>
            ) : (
              <>
                {subData && <SubscriberKpi data={subData} />}
                {trendData && <SubscriberTrendChart data={trendData} />}
                {campaignData && (
                  <CampaignTable campaigns={campaignData.campaigns} />
                )}
              </>
            )}
          </>
        )}

        {tab === "crm" && (
          <>
            {crmLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading CRM data...</div>
              </div>
            ) : crmError ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-destructive">Error: {crmError}</div>
              </div>
            ) : crmData ? (
              <>
                <KpiCards data={crmData.kpi} />
                <div className="grid gap-6 md:grid-cols-2">
                  <SourceChart data={crmData.sourceDistribution} />
                  <PipelineSummary data={crmData.dealPipeline} />
                </div>
                <RecentPosts data={crmData.recentPosts} />
              </>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
