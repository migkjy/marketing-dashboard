"use client";

import { useEffect, useState, useCallback } from "react";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { SourceChart } from "@/components/dashboard/source-chart";
import { PipelineSummary } from "@/components/dashboard/pipeline-summary";
import { RecentPosts } from "@/components/dashboard/recent-posts";
import { DateRangeFilter } from "@/components/dashboard/date-range-filter";
import { SiteSelector } from "@/components/dashboard/site-selector";
import {
  SubscriberKpi,
  SubscriberKpiSkeleton,
} from "@/components/dashboard/subscriber-kpi";
import {
  SubscriberTrendChart,
  SubscriberTrendChartSkeleton,
} from "@/components/dashboard/subscriber-trend-chart";
import {
  CampaignTable,
  CampaignTableSkeleton,
} from "@/components/dashboard/campaign-table";
import { TrafficKpi } from "@/components/dashboard/traffic-kpi";
import { TrafficTrendChart } from "@/components/dashboard/traffic-trend-chart";
import { CountryDistribution } from "@/components/dashboard/country-distribution";
import { SiteTrafficTable } from "@/components/dashboard/site-traffic-table";
import { AlertCircle, RefreshCw } from "lucide-react";

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

interface InfraData {
  totals: { requests: number; visitors: number; bytes: number };
  dailyTrend: { date: string; requests: number; visitors: number; bytes: number }[];
  countryDistribution: { country: string; requests: number }[];
  sites: { site: string; requests: number; visitors: number; bandwidth: number }[];
  days: number;
}

type Tab = "subscribers" | "crm" | "infrastructure";

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm font-medium">데이터를 불러오지 못했습니다</span>
      </div>
      <p className="text-xs text-muted-foreground max-w-xs text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <RefreshCw className="h-3 w-3" />
          다시 시도
        </button>
      )}
    </div>
  );
}

function CrmSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-xl p-4 space-y-3">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            <div className="h-3 w-16 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-xl h-64 bg-muted animate-pulse" />
        <div className="border rounded-xl h-64 bg-muted animate-pulse" />
      </div>
      <div className="border rounded-xl h-48 bg-muted animate-pulse" />
    </div>
  );
}

function InfraSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-xl p-4 space-y-3">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
      <div className="border rounded-xl h-72 bg-muted animate-pulse" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-xl h-48 bg-muted animate-pulse" />
        <div className="border rounded-xl h-48 bg-muted animate-pulse" />
      </div>
    </div>
  );
}

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

  // Infrastructure data
  const [infraData, setInfraData] = useState<InfraData | null>(null);
  const [infraLoading, setInfraLoading] = useState(false);
  const [infraError, setInfraError] = useState<string | null>(null);

  // Fetch CRM data
  const fetchCrm = useCallback(() => {
    setCrmLoading(true);
    setCrmError(null);
    fetch("/api/metrics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch CRM metrics");
        return res.json();
      })
      .then(setCrmData)
      .catch((err) => setCrmError(err.message))
      .finally(() => setCrmLoading(false));
  }, []);

  useEffect(() => {
    fetchCrm();
  }, [fetchCrm]);

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
        throw new Error("Brevo API 응답 오류. API 키를 확인해주세요.");
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
      setBrevoError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setBrevoLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrevo(days);
  }, [days, fetchBrevo]);

  // Fetch Infrastructure data
  const fetchInfra = useCallback(async (d: number, s: string) => {
    setInfraLoading(true);
    setInfraError(null);
    try {
      const res = await fetch(`/api/infrastructure?days=${d}&site=${s}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "인프라 데이터를 불러오지 못했습니다");
      }
      setInfraData(await res.json());
    } catch (err) {
      setInfraError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setInfraLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "infrastructure") {
      fetchInfra(days, site);
    }
  }, [tab, days, site, fetchInfra]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "subscribers", label: "Subscribers" },
    { id: "crm", label: "CRM & Content" },
    { id: "infrastructure", label: "Infrastructure" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                Marketing Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block mt-0.5">
                Subscribers, CRM & content metrics
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <SiteSelector value={site} onChange={setSite} />
              <DateRangeFilter value={days} onChange={setDays} />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-0 mt-3 border-b -mb-px overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {tab === "subscribers" && (
          <>
            {brevoLoading ? (
              <>
                <SubscriberKpiSkeleton />
                <SubscriberTrendChartSkeleton />
                <CampaignTableSkeleton />
              </>
            ) : brevoError ? (
              <ErrorBanner
                message={brevoError}
                onRetry={() => fetchBrevo(days)}
              />
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
              <CrmSkeleton />
            ) : crmError ? (
              <ErrorBanner message={crmError} onRetry={fetchCrm} />
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

        {tab === "infrastructure" && (
          <>
            {infraLoading ? (
              <InfraSkeleton />
            ) : infraError ? (
              <ErrorBanner
                message={infraError}
                onRetry={() => fetchInfra(days, site)}
              />
            ) : infraData ? (
              <>
                <TrafficKpi totals={infraData.totals} days={infraData.days} />
                <TrafficTrendChart data={infraData.dailyTrend} days={infraData.days} />
                <div className="grid gap-6 md:grid-cols-2">
                  <CountryDistribution data={infraData.countryDistribution} />
                  <SiteTrafficTable data={infraData.sites} />
                </div>
              </>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
