import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rng-labs.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/company`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/quix`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ai-labs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/sitemap-page`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];
}
