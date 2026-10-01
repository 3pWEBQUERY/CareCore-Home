import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/impressum/", "/datenschutz/"].map((path) => ({ url: new URL(path, site.url).toString() }));
}
