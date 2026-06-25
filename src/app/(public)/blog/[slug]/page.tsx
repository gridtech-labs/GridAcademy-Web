import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Clock, Tag } from 'lucide-react';
import { getAllPosts, getPost } from '@/lib/blog-posts';

interface PageProps { params: { slug: string } }

export function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return { title: 'Article Not Found' };
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `https://www.gridacademy.in/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://www.gridacademy.in/blog/${post.slug}`,
      siteName: 'GridAcademy',
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const publishedFormatted = new Date(post.publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      {/* FAQPage JSON-LD */}
      {post.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: post.faqs.map(f => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            }),
          }}
        />
      )}

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.metaDescription,
            datePublished: post.publishedAt,
            publisher: { '@type': 'Organization', name: 'GridAcademy', url: 'https://www.gridacademy.in' },
            url: `https://www.gridacademy.in/blog/${post.slug}`,
          }),
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-orange-500 transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
              <Tag className="w-3 h-3" />{post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />{post.readingTimeMinutes} min read
            </span>
            <span className="text-xs text-gray-400">{publishedFormatted}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed border-l-4 border-orange-400 pl-4">
            {post.excerpt}
          </p>
        </header>

        {/* Article body */}
        <article
          className="
            text-gray-700
            [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-3
            [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-gray-600
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1.5
            [&_li]:text-sm [&_li]:text-gray-600 [&_li]:leading-relaxed
            [&_strong]:font-semibold [&_strong]:text-gray-800
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* FAQ section */}
        {post.faqs.length > 0 && (
          <section className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-5">Frequently Asked Questions</h2>
            <dl className="divide-y divide-gray-100">
              {post.faqs.map(({ question, answer }) => (
                <details key={question} className="group py-4 cursor-pointer">
                  <summary className="flex items-center justify-between gap-3 font-semibold text-sm text-gray-800 marker:hidden list-none">
                    {question}
                    <span className="shrink-0 text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{answer}</p>
                </details>
              ))}
            </dl>
          </section>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <p className="font-extrabold text-lg mb-1">Ready to practice?</p>
          <p className="text-orange-100 text-sm mb-4">
            Take a free mock test on GridAcademy — latest 2026 exam pattern, instant results and detailed analysis.
          </p>
          <Link
            href="/exams"
            className="inline-block bg-white text-orange-600 font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Browse Free Mock Tests
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Link href="/blog" className="text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </>
  );
}
