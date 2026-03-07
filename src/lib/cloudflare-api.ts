const CF_GRAPHQL_URL = "https://api.cloudflare.com/client/v4/graphql";

function getToken(): string {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) throw new Error("CLOUDFLARE_API_TOKEN is not set");
  return token;
}

export const ZONE_MAP: Record<string, string> = {
  "ai-architect": "1fcd3eed4c8f10602423f9290d7bbdd0",
  "aihubkorea": "be5d33ac36996663961f9793a972345e",
  "richbukae": "3b3b7f86297037edc3b87449b816da7e",
  "koreaai-hub": "5acb0a4a8d1a5290de5a5ad0e778f263",
  "deafnuri": "f7725679cf2643093ef891b9709f7392",
  "newbizsoft": "fde218d51e1c7fd63c24c72bca976feb",
};

export interface DailyStats {
  date: string;
  requests: number;
  visitors: number;
  bytes: number;
  countryMap: { clientCountryName: string; requests: number }[];
}

export interface ZoneAnalytics {
  site: string;
  days: DailyStats[];
  totals: {
    requests: number;
    visitors: number;
    bytes: number;
  };
}

interface GraphQLResponse {
  data: {
    viewer: {
      zones: {
        httpRequests1dGroups: {
          dimensions: { date: string };
          sum: {
            requests: number;
            bytes: number;
            countryMap: { clientCountryName: string; requests: number }[];
          };
          uniq: { uniques: number };
        }[];
      }[];
    };
  } | null;
  errors?: { message: string }[];
}

export async function fetchZoneAnalytics(
  zoneId: string,
  startDate: string,
  endDate: string
): Promise<DailyStats[]> {
  const query = `{
    viewer {
      zones(filter: { zoneTag: "${zoneId}" }) {
        httpRequests1dGroups(
          limit: 100
          filter: { date_gt: "${startDate}", date_lt: "${endDate}" }
          orderBy: [date_ASC]
        ) {
          dimensions { date }
          sum { requests bytes countryMap { clientCountryName requests } }
          uniq { uniques }
        }
      }
    }
  }`;

  const res = await fetch(CF_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Cloudflare API error: ${res.status}`);
  }

  const json: GraphQLResponse = await res.json();

  if (json.errors?.length) {
    throw new Error(`Cloudflare GraphQL: ${json.errors[0].message}`);
  }

  const groups = json.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];

  return groups.map((g) => ({
    date: g.dimensions.date,
    requests: g.sum.requests,
    visitors: g.uniq.uniques,
    bytes: g.sum.bytes,
    countryMap: g.sum.countryMap,
  }));
}

export async function fetchAllZonesAnalytics(
  days: number,
  siteFilter?: string
): Promise<ZoneAnalytics[]> {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - days * 86400000)
    .toISOString()
    .split("T")[0];

  const entries =
    siteFilter && siteFilter !== "all"
      ? [[siteFilter, ZONE_MAP[siteFilter]] as const].filter(([, v]) => v)
      : Object.entries(ZONE_MAP);

  const results = await Promise.allSettled(
    entries.map(async ([site, zoneId]) => {
      const dailyStats = await fetchZoneAnalytics(zoneId, startDate, endDate);
      const totals = dailyStats.reduce(
        (acc, d) => ({
          requests: acc.requests + d.requests,
          visitors: acc.visitors + d.visitors,
          bytes: acc.bytes + d.bytes,
        }),
        { requests: 0, visitors: 0, bytes: 0 }
      );
      return { site, days: dailyStats, totals } as ZoneAnalytics;
    })
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<ZoneAnalytics> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);
}
