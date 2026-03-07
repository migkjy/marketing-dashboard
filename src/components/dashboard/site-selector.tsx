"use client";

interface SiteSelectorProps {
  value: string;
  onChange: (site: string) => void;
}

const SITES = [
  { label: "All Sites", value: "all" },
  { label: "ai-architect", value: "ai-architect" },
  { label: "aihubkorea", value: "aihubkorea" },
  { label: "richbukae", value: "richbukae" },
  { label: "koreaai-hub", value: "koreaai-hub" },
  { label: "deafnuri", value: "deafnuri" },
  { label: "newbizsoft", value: "newbizsoft" },
];

export function SiteSelector({ value, onChange }: SiteSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border bg-background px-3 text-sm text-foreground"
    >
      {SITES.map((site) => (
        <option key={site.value} value={site.value}>
          {site.label}
        </option>
      ))}
    </select>
  );
}
