import { MetadataRoute } from "next";
import { PROGRAMS_DATA } from "@/constants/programs";
import { EXERCISES_DATA } from "@/constants/exercises";
import { BLOG_POSTS } from "@/constants/blog";
import { supabase } from "@/lib/supabase";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const staticRoutes = [
    "",
    "/baslangic",
    "/hesaplama",
    "/programlar",
    "/pilates",
    "/egzersizler",
    "/blog",
    "/topluluk",
    "/sss",
    "/bilimsel-temeller",
    "/hakkimizda",
    "/iletisim",
    "/gizlilik-politikasi",
    "/kullanim-sartlari",
    "/saglik-uyarisi",
    "/hesaplama/vki",
    "/hesaplama/kalori",
    "/hesaplama/makro",
    "/hesaplama/1rm",
    "/hesaplama/bel-kalca",
    "/hesaplama/bel-boy",
    "/hesaplama/ideal-kilo",
    "/hesaplama/su",
    "/hesaplama/plaka",
    "/hesaplama/antrenman-hacmi",
    "/hesaplama/nabiz",
    "/hesaplama/kardiyo-kalori",
    "/hesaplama/vucut-kompozisyonu",
    "/hesaplama/diyet-plani",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Admin panelinden Supabase'e eklenen içerik (statik kataloğa ek olarak).
  // RLS herkese açık SELECT'e izin verdiği için anon client burada güvenle kullanılır.
  let dbPrograms = { data: [] as any[] };
  let dbExercises = { data: [] as any[] };
  let dbBlogs = { data: [] as any[] };

  try {
    const [p, e, b] = await Promise.all([
      supabase.from("programs").select("id, created_at"),
      supabase.from("exercises").select("id, created_at"),
      supabase.from("blog_posts").select("id, created_at"),
    ]);
    dbPrograms = { data: p.data || [] };
    dbExercises = { data: e.data || [] };
    dbBlogs = { data: b.data || [] };
  } catch (err) {
    console.warn("Sitemap: Supabase connection failed. Falling back to static routes.");
  }

  const staticProgramIds = new Set(PROGRAMS_DATA.map((p) => p.id));
  const staticExerciseIds = new Set(EXERCISES_DATA.map((e) => e.id));
  const staticBlogIds = new Set(BLOG_POSTS.map((b) => b.id));

  const programRoutes = [
    ...PROGRAMS_DATA.map((p) => ({ id: p.id, created_at: undefined as string | undefined })),
    ...(dbPrograms.data || []).filter((p) => !staticProgramIds.has(p.id)),
  ].map((p) => ({
    url: `${baseUrl}/programlar/${p.id}`,
    lastModified: p.created_at ? new Date(p.created_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const exerciseRoutes = [
    ...EXERCISES_DATA.map((e) => ({ id: e.id, created_at: undefined as string | undefined })),
    ...(dbExercises.data || []).filter((e) => !staticExerciseIds.has(e.id)),
  ].map((e) => ({
    url: `${baseUrl}/egzersizler/${e.id}`,
    lastModified: e.created_at ? new Date(e.created_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = [
    ...BLOG_POSTS.map((b) => ({ id: b.id, created_at: undefined as string | undefined })),
    ...(dbBlogs.data || []).filter((b) => !staticBlogIds.has(b.id)),
  ].map((b) => ({
    url: `${baseUrl}/blog/${b.id}`,
    lastModified: b.created_at ? new Date(b.created_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...programRoutes, ...exerciseRoutes, ...blogRoutes];
}
