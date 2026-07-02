import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog-posts';

const BASE_URL = 'https://www.gridacademy.in';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

const ALL_CATEGORY_SLUGS = [
  'ssc', 'banking', 'railways', 'upsc',
  'police', 'defence', 'state-psc', 'teaching',
  'cuet', 'neet',
];

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL,                         priority: 1.0,  changeFrequency: 'daily'   },
  { url: `${BASE_URL}/exams`,              priority: 0.9,  changeFrequency: 'daily'   },
  { url: `${BASE_URL}/tests`,              priority: 0.9,  changeFrequency: 'daily'   },
  { url: `${BASE_URL}/about`,              priority: 0.5,  changeFrequency: 'monthly' },
  { url: `${BASE_URL}/contact`,            priority: 0.5,  changeFrequency: 'monthly' },
  { url: `${BASE_URL}/blog`,               priority: 0.6,  changeFrequency: 'weekly'  },
  { url: `${BASE_URL}/privacy`,            priority: 0.3,  changeFrequency: 'yearly'  },
  { url: `${BASE_URL}/terms`,              priority: 0.3,  changeFrequency: 'yearly'  },
  { url: `${BASE_URL}/refund-policy`,      priority: 0.3,  changeFrequency: 'yearly'  },
  { url: `${BASE_URL}/leaderboard`,        priority: 0.5,  changeFrequency: 'daily'   },
];

async function getExamSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/api/exam-pages`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    const items: { slug: string }[] = Array.isArray(json) ? json : (json?.data ?? []);
    return items.map(e => e.slug).filter(Boolean);
  } catch {
    return [];
  }
}

async function getPopulatedCategorySlugs(): Promise<string[]> {
  const results = await Promise.all(
    ALL_CATEGORY_SLUGS.map(async (slug) => {
      try {
        const res = await fetch(
          `${API_BASE}/api/storefront/tests?categorySlug=${slug}&page=1&pageSize=1`,
          { next: { revalidate: 3600 } },
        );
        if (!res.ok) return null;
        const json = await res.json();
        const items: unknown[] = json?.data?.items ?? json?.items ?? (Array.isArray(json) ? json : []);
        return items.length > 0 ? slug : null;
      } catch {
        return null;
      }
    }),
  );
  return results.filter((s): s is string => s !== null);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [examSlugs, populatedCategories] = await Promise.all([
    getExamSlugs(),
    getPopulatedCategorySlugs(),
  ]);

  const examCategoryRoutes: MetadataRoute.Sitemap = populatedCategories.map(slug => ({
    url: `${BASE_URL}/exams/${slug}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }));

  const examDetailRoutes: MetadataRoute.Sitemap = examSlugs.map(slug => ({
    url: `${BASE_URL}/exam/${slug}`,
    priority: 0.9,
    changeFrequency: 'weekly',
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
    lastModified: new Date(post.publishedAt),
  }));

  return [...STATIC_ROUTES, ...examCategoryRoutes, ...examDetailRoutes, ...blogRoutes];
}
