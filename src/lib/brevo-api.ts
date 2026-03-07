const BREVO_API_BASE = "https://api.brevo.com/v3";

function getHeaders(): HeadersInit {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY is not set");
  return {
    "api-key": apiKey,
    "Content-Type": "application/json",
  };
}

async function brevoFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BREVO_API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: getHeaders(),
    next: { revalidate: 300 }, // 5min cache
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo API error ${res.status}: ${text}`);
  }
  return res.json();
}

// --- Types ---

export interface BrevoList {
  id: number;
  name: string;
  uniqueSubscribers: number;
  totalBlacklisted: number;
  totalSubscribers: number;
  folderId: number;
}

export interface BrevoContact {
  id: number;
  email: string;
  emailBlacklisted: boolean;
  createdAt: string;
  modifiedAt: string;
  listIds: number[];
  attributes: Record<string, string>;
}

export interface BrevoCampaign {
  id: number;
  name: string;
  status: string;
  sentDate?: string;
  statistics?: {
    globalStats?: {
      uniqueClicks: number;
      clickers: number;
      complaints: number;
      delivered: number;
      sent: number;
      softBounces: number;
      hardBounces: number;
      uniqueViews: number;
      trackableViews: number;
      unsubscriptions: number;
      viewed: number;
    };
  };
}

// --- API Functions (READ-ONLY) ---

export async function getLists(): Promise<{ lists: BrevoList[]; count: number }> {
  return brevoFetch("/contacts/lists");
}

export async function getContacts(
  limit = 50,
  offset = 0,
  sort: "asc" | "desc" = "desc"
): Promise<{ contacts: BrevoContact[]; count: number }> {
  return brevoFetch("/contacts", {
    limit: String(limit),
    offset: String(offset),
    sort,
  });
}

export async function getContactsByList(
  listId: number,
  limit = 50,
  offset = 0
): Promise<{ contacts: BrevoContact[]; count: number }> {
  return brevoFetch(`/contacts/lists/${listId}/contacts`, {
    limit: String(limit),
    offset: String(offset),
  });
}

export async function getCampaigns(
  limit = 20,
  offset = 0,
  status?: string
): Promise<{ campaigns: BrevoCampaign[]; count: number }> {
  const params: Record<string, string> = {
    limit: String(limit),
    offset: String(offset),
    sort: "desc",
  };
  if (status) params.status = status;
  return brevoFetch("/emailCampaigns", params);
}

export async function getTotalContacts(): Promise<number> {
  const data = await getContacts(1, 0);
  return data.count;
}

export async function getRecentSubscribers(
  days: number,
  listId?: number
): Promise<BrevoContact[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceISO = since.toISOString();

  const allContacts: BrevoContact[] = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const data = listId
      ? await getContactsByList(listId, limit, offset)
      : await getContacts(limit, offset, "desc");

    if (!data.contacts || data.contacts.length === 0) break;

    for (const contact of data.contacts) {
      if (contact.createdAt >= sinceISO) {
        allContacts.push(contact);
      } else {
        return allContacts;
      }
    }

    offset += limit;
    if (offset >= data.count) break;
    // Safety: max 500 contacts to prevent runaway
    if (allContacts.length >= 500) break;
  }

  return allContacts;
}
