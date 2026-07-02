import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Tag, ChevronRight } from 'lucide-react';
import { getAllPosts } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Blog — Exam Tips, Preparation Guides & Syllabus Updates',
  description:
    'Expert articles on SSC CGL, CUET, RRB ALP, NEET and more — exam patterns, syllabus breakdowns, preparation strategies and free mock test guides.',
  alternates: { canonical: 'https://www.gridacademy.in/blog' },
};

const CATEGORY_COLORS: Record<string, string> = {
  SSC:     'bg-blue-100 text-blue-700',
  CUET:    'bg-violet-100 text-violet-700',
  Railway: 'bg-green-100 text-green-700',
  NEET:    'bg-red-100 text-red-700',
  Banking: 'bg-amber-100 text-amber-700',
  UPSC:    'bg-slate-100 text-slate-700',
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-orange-100 text-orange-700';
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-orange-100 mb-3 flex items-center gap-1.5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Blog</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">GridAcademy Blog</h1>
          <p className="text-orange-100 text-lg">
            Exam patterns, syllabus guides, and preparation strategies for SSC, CUET, Railway, NEET and more.
          </p>
        </div>
      </div>

      {/* Post grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map(post => {
            const publishedFormatted = new Date(post.publishedAt).toLocaleDateString('en-IN', {
              year: 'numeric', month: 'short', day: 'numeric',
            });
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColor(post.category)}`}>
                      <Tag className="w-3 h-3" />{post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                      <Clock className="w-3 h-3" />{post.readingTimeMinutes} min
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-gray-900 leading-snug group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <span className="text-xs text-gray-400">{publishedFormatted}</span>
                    <span className="text-xs font-semibold text-orange-500 group-hover:underline">
                      Read article →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
