"use client";

interface SiteSelectorProps {
  value: string;
  onChange: (site: string) => void;
}

const SITES = [
  { label: "All Sites", value: "all" },
  { label: "richbukae", value: "richbukae" },
  { label: "ai-architect", value: "ai-architect" },
  { label: "koreaai-hub", value: "koreaai-hub" },
  { label: "apppro", value: "apppro" },
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
