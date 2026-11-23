/**
 * Curated RSS/Atom feeds for the "Tech Feed" tab.
 * Edit this list to add or remove sources — no other code changes needed.
 * Only the title, a short excerpt and the link are stored; readers are sent to the original site.
 */
export type FeedSource = {
  name: string;
  url: string;
  tags: string[];
  /** Max items imported per run for this feed. */
  limit?: number;
};

export const FEEDS: FeedSource[] = [
  { name: "Cloudflare Blog", url: "https://blog.cloudflare.com/rss/", tags: ["networking", "security"], limit: 8 },
  { name: "APNIC Blog", url: "https://blog.apnic.net/feed/", tags: ["networking", "internet"], limit: 8 },
  { name: "Packet Pushers", url: "https://packetpushers.net/feed/", tags: ["networking"], limit: 8 },
  { name: "Krebs on Security", url: "https://krebsonsecurity.com/feed/", tags: ["cybersecurity"], limit: 6 },
  { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews", tags: ["cybersecurity"], limit: 6 },
  { name: "Dev.to · Networking", url: "https://dev.to/feed/tag/networking", tags: ["networking", "dev"], limit: 6 },
  { name: "Dev.to · Cybersecurity", url: "https://dev.to/feed/tag/cybersecurity", tags: ["cybersecurity", "dev"], limit: 6 },
  { name: "Dev.to · DevOps", url: "https://dev.to/feed/tag/devops", tags: ["devops", "dev"], limit: 6 },
];
