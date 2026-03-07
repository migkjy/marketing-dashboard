/**
 * GA4 Data API 클라이언트
 * google-auth-library 없이 순수 REST API + JWT 직접 생성
 */

export interface GA4PropertyMap {
  [site: string]: string; // site name -> property ID
}

// 환경변수에서 property ID 맵 로드
// GA4_PROPERTY_IDS=ai-architect:123456789,koreaai-hub:987654321,...
function getPropertyIds(): GA4PropertyMap {
  const raw = process.env.GA4_PROPERTY_IDS || "";
  if (!raw) return {};
  return Object.fromEntries(
    raw
      .split(",")
      .map((pair) => pair.trim().split(":"))
      .filter(([k, v]) => k && v)
      .map(([k, v]) => [k.trim(), v.trim()])
  );
}

interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  token_uri: string;
}

function getServiceAccount(): ServiceAccount {
  const raw = process.env.GA4_ADMIN_SERVICE_ACCOUNT;
  if (!raw) throw new Error("GA4_ADMIN_SERVICE_ACCOUNT is not set");
  const cleaned = raw.startsWith("'") ? raw.slice(1, raw.lastIndexOf("'")) : raw;
  return JSON.parse(cleaned);
}

// JWT 생성 (RS256) — Web Crypto API 사용
async function createJWT(
  serviceAccount: ServiceAccount,
  scopes: string[]
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    scope: scopes.join(" "),
    aud: serviceAccount.token_uri,
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const headerB64 = encode(header);
  const payloadB64 = encode(payload);
  const signingInput = `${headerB64}.${payloadB64}`;

  // PEM -> ArrayBuffer
  const pemContents = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const binaryKey = Buffer.from(pemContents, "base64");

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    Buffer.from(signingInput)
  );

  const signatureB64 = Buffer.from(signature)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${signingInput}.${signatureB64}`;
}

// Access token 발급
async function getAccessToken(serviceAccount: ServiceAccount): Promise<string> {
  const jwt = await createJWT(serviceAccount, [
    "https://www.googleapis.com/auth/analytics.readonly",
  ]);

  const res = await fetch(serviceAccount.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to get access token: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export interface GA4Metrics {
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
  engagementRate: number;
  averageSessionDuration: number;
  conversions: number;
}

export interface GA4DailyData {
  date: string;
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
}

export interface GA4TopPage {
  pagePath: string;
  screenPageViews: number;
  activeUsers: number;
}

export interface GA4SourceData {
  sessionSource: string;
  sessions: number;
  activeUsers: number;
}

export interface GA4SiteData {
  site: string;
  propertyId: string;
  totals: GA4Metrics;
  dailyTrend: GA4DailyData[];
  topPages: GA4TopPage[];
  sourceDistribution: GA4SourceData[];
  error?: string;
}

export interface GA4Response {
  totals: GA4Metrics;
  dailyTrend: GA4DailyData[];
  topPages: GA4TopPage[];
  sourceDistribution: GA4SourceData[];
  sites: GA4SiteData[];
  days: number;
  propertyIds: GA4PropertyMap;
}

interface RunReportRow {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

interface RunReportResponse {
  rows?: RunReportRow[];
  error?: { message: string; status: string };
}

async function runReport(
  propertyId: string,
  accessToken: string,
  body: object
): Promise<RunReportResponse> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    return { error: data.error };
  }
  return data;
}

async function fetchSiteGA4(
  site: string,
  propertyId: string,
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<GA4SiteData> {
  const dateRange = { startDate, endDate };

  try {
    // 총합 + 일별 트렌드
    const [totalsRes, dailyRes, topPagesRes, sourceRes] = await Promise.all([
      runReport(propertyId, accessToken, {
        dateRanges: [dateRange],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "engagementRate" },
          { name: "averageSessionDuration" },
          { name: "conversions" },
        ],
      }),
      runReport(propertyId, accessToken, {
        dateRanges: [dateRange],
        dimensions: [{ name: "date" }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
        ],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      runReport(propertyId, accessToken, {
        dateRanges: [dateRange],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        orderBys: [
          {
            metric: { metricName: "screenPageViews" },
            desc: true,
          },
        ],
        limit: 10,
      }),
      runReport(propertyId, accessToken, {
        dateRanges: [dateRange],
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }],
        orderBys: [
          {
            metric: { metricName: "sessions" },
            desc: true,
          },
        ],
        limit: 10,
      }),
    ]);

    // 총합 파싱
    const totalsRow = totalsRes.rows?.[0];
    const totals: GA4Metrics = {
      activeUsers: Number(totalsRow?.metricValues?.[0]?.value || 0),
      sessions: Number(totalsRow?.metricValues?.[1]?.value || 0),
      screenPageViews: Number(totalsRow?.metricValues?.[2]?.value || 0),
      engagementRate: Number(totalsRow?.metricValues?.[3]?.value || 0),
      averageSessionDuration: Number(totalsRow?.metricValues?.[4]?.value || 0),
      conversions: Number(totalsRow?.metricValues?.[5]?.value || 0),
    };

    // 일별 트렌드 파싱 (YYYYMMDD -> YYYY-MM-DD)
    const dailyTrend: GA4DailyData[] = (dailyRes.rows || []).map((row) => {
      const raw = row.dimensionValues[0].value;
      const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      return {
        date,
        activeUsers: Number(row.metricValues[0].value),
        sessions: Number(row.metricValues[1].value),
        screenPageViews: Number(row.metricValues[2].value),
      };
    });

    // Top Pages 파싱
    const topPages: GA4TopPage[] = (topPagesRes.rows || []).map((row) => ({
      pagePath: row.dimensionValues[0].value,
      screenPageViews: Number(row.metricValues[0].value),
      activeUsers: Number(row.metricValues[1].value),
    }));

    // Source Distribution 파싱
    const sourceDistribution: GA4SourceData[] = (sourceRes.rows || []).map(
      (row) => ({
        sessionSource: row.dimensionValues[0].value,
        sessions: Number(row.metricValues[0].value),
        activeUsers: Number(row.metricValues[1].value),
      })
    );

    return {
      site,
      propertyId,
      totals,
      dailyTrend,
      topPages,
      sourceDistribution,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return {
      site,
      propertyId,
      totals: {
        activeUsers: 0,
        sessions: 0,
        screenPageViews: 0,
        engagementRate: 0,
        averageSessionDuration: 0,
        conversions: 0,
      },
      dailyTrend: [],
      topPages: [],
      sourceDistribution: [],
      error: msg,
    };
  }
}

export async function fetchGA4Analytics(
  days: number,
  siteFilter?: string
): Promise<GA4Response> {
  const propertyIds = getPropertyIds();

  if (Object.keys(propertyIds).length === 0) {
    throw new Error(
      "GA4_PROPERTY_IDS 환경변수가 설정되지 않았습니다. " +
        "예: GA4_PROPERTY_IDS=ai-architect:123456789,koreaai-hub:987654321"
    );
  }

  const sa = getServiceAccount();
  const accessToken = await getAccessToken(sa);

  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - days * 86400000)
    .toISOString()
    .split("T")[0];

  const entries =
    siteFilter && siteFilter !== "all"
      ? Object.entries(propertyIds).filter(([k]) => k === siteFilter)
      : Object.entries(propertyIds);

  if (entries.length === 0) {
    throw new Error(
      `사이트 '${siteFilter}'의 Property ID가 설정되지 않았습니다.`
    );
  }

  const results = await Promise.all(
    entries.map(([site, pid]) =>
      fetchSiteGA4(site, pid, accessToken, startDate, endDate)
    )
  );

  // 집계 totals
  const totals = results.reduce(
    (acc, r) => ({
      activeUsers: acc.activeUsers + r.totals.activeUsers,
      sessions: acc.sessions + r.totals.sessions,
      screenPageViews: acc.screenPageViews + r.totals.screenPageViews,
      engagementRate: acc.engagementRate + r.totals.engagementRate,
      averageSessionDuration:
        acc.averageSessionDuration + r.totals.averageSessionDuration,
      conversions: acc.conversions + r.totals.conversions,
    }),
    {
      activeUsers: 0,
      sessions: 0,
      screenPageViews: 0,
      engagementRate: 0,
      averageSessionDuration: 0,
      conversions: 0,
    }
  );
  if (results.length > 1) {
    totals.engagementRate /= results.length;
    totals.averageSessionDuration /= results.length;
  }

  // 일별 트렌드 집계
  const dailyMap = new Map<string, GA4DailyData>();
  for (const r of results) {
    for (const d of r.dailyTrend) {
      const existing = dailyMap.get(d.date);
      if (existing) {
        existing.activeUsers += d.activeUsers;
        existing.sessions += d.sessions;
        existing.screenPageViews += d.screenPageViews;
      } else {
        dailyMap.set(d.date, { ...d });
      }
    }
  }
  const dailyTrend = Array.from(dailyMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // Top Pages 집계
  const pageMap = new Map<string, GA4TopPage>();
  for (const r of results) {
    for (const p of r.topPages) {
      const existing = pageMap.get(p.pagePath);
      if (existing) {
        existing.screenPageViews += p.screenPageViews;
        existing.activeUsers += p.activeUsers;
      } else {
        pageMap.set(p.pagePath, { ...p });
      }
    }
  }
  const topPages = Array.from(pageMap.values())
    .sort((a, b) => b.screenPageViews - a.screenPageViews)
    .slice(0, 10);

  // Source Distribution 집계
  const sourceMap = new Map<string, GA4SourceData>();
  for (const r of results) {
    for (const s of r.sourceDistribution) {
      const existing = sourceMap.get(s.sessionSource);
      if (existing) {
        existing.sessions += s.sessions;
        existing.activeUsers += s.activeUsers;
      } else {
        sourceMap.set(s.sessionSource, { ...s });
      }
    }
  }
  const sourceDistribution = Array.from(sourceMap.values())
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10);

  return {
    totals,
    dailyTrend,
    topPages,
    sourceDistribution,
    sites: results,
    days,
    propertyIds,
  };
}
