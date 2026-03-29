import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/editor", "/profile/setup", "/auth"],
    },
    sitemap: "https://glowcatcher.co.uk/sitemap.xml",
  };
}
