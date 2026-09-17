import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Download } from 'lucide-react';
import { getAllPosts, getPost } from '@/lib/blog-posts';

interface PageProps { params: { slug: string } }

export function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return { title: 'Article Not Found' };
  const ogImage = post.image ? `https://www.gridacademy.in${post.image}` : 'https://www.gridacademy.in/og-image.jpg';
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
      modifiedTime: post.publishedAt,
      images: [{ url: ogImage, width: 1200, height: 630 }],
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
            url: `https://www.gridacademy.in/blog/${post.slug}`,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            image: {
              '@type': 'ImageObject',
              url: post.image ? `https://www.gridacademy.in${post.image}` : 'https://www.gridacademy.in/og-image.jpg',
            },
            author: {
              '@type': 'Organization',
              name: 'GridAcademy',
              url: 'https://www.gridacademy.in',
            },
            publisher: {
              '@type': 'Organization',
              name: 'GridAcademy',
              url: 'https://www.gridacademy.in',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.gridacademy.in/logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.gridacademy.in/blog/${post.slug}`,
            },
          }),
        }}
      />

      <div className="bg-white text-ink">
        <section className="bg-paper border-b border-line">
          <div className="max-w-[760px] mx-auto px-4 md:px-6 pt-5 md:pt-7 pb-8 md:pb-10 flex flex-col gap-4">
            <nav className="flex items-center gap-1.5 text-[13.5px] text-[#667085] overflow-x-auto whitespace-nowrap scrollbar-hide" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary-dark">Home</Link><ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/blog" className="hover:text-primary-dark">Blog</Link><ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[#344054]">{post.category}</span>
            </nav>
            <p className="text-[13px] text-[#667085]">
              <span className="h-[22px] inline-flex items-center px-2 rounded-full bg-primary-tint text-primary-dark text-[11.5px] font-medium mr-2">{post.category}</span>
              {publishedFormatted} · {post.readingTimeMinutes} min read
            </p>
            <h1 className="text-[28px] leading-[1.15] md:text-[40px] md:leading-[1.1] font-bold tracking-[-0.02em]">{post.title}</h1>
            <p className="text-base md:text-lg leading-relaxed text-[#475467]">{post.excerpt}</p>
          </div>
        </section>

        <div className="max-w-[760px] mx-auto px-4 md:px-6 py-8 md:py-10">
          <article
            className="
              text-[#344054]
              [&_h2]:text-[22px] md:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:leading-snug
              [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-7 [&_h3]:mb-2
              [&_p]:text-[16.5px] [&_p]:leading-[1.75] [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-5 [&_ol]:space-y-2
              [&_li]:text-[16.5px] [&_li]:leading-[1.7]
              [&_strong]:font-semibold [&_strong]:text-ink
              [&_a]:text-primary-dark [&_a]:font-medium [&_a]:underline
              [&_table]:w-full [&_table]:text-sm [&_table]:my-5 [&_table]:border [&_table]:border-line
              [&_th]:bg-[#f9fafb] [&_th]:text-left [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_td]:border-t [&_td]:border-line
              [&_.table-wrap]:overflow-x-auto
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.downloadCta && (
            <div className="mt-10 rounded-xl border border-line bg-paper p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-lg">Get the printable study tracker</p>
                <p className="text-[15px] text-[#475467] mt-1">Day-by-day targets, formula sheet reminders and MCQ counts — one page, print-ready.</p>
              </div>
              <a href={post.downloadCta.url} className="h-11 shrink-0 inline-flex items-center gap-2 px-5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark">
                <Download className="w-4 h-4" />{post.downloadCta.label}
              </a>
            </div>
          )}

          {post.faqs.length > 0 && (
            <section className="mt-12 flex flex-col gap-3.5">
              <h2 className="text-xl md:text-2xl font-semibold">Frequently asked questions</h2>
              <div className="border border-line rounded-xl divide-y divide-line">
                {post.faqs.map(({ question, answer }) => (
                  <details key={question} className="group px-5">
                    <summary className="min-h-[56px] flex items-center justify-between gap-3 font-semibold text-[15px] cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      {question}
                      <ChevronRight className="w-4 h-4 text-[#667085] shrink-0 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="pb-4 text-[15px] leading-relaxed text-[#475467]">{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 pt-8 border-t border-line flex gap-4">
            <span className="w-12 h-12 rounded-full bg-primary-tint text-primary-dark flex items-center justify-center font-semibold shrink-0">GA</span>
            <div>
              <p className="font-semibold">GridAcademy Team <span className="font-normal text-sm text-[#667085]">· Content &amp; Research</span></p>
              <p className="text-sm leading-relaxed text-[#475467] mt-1">
                Expert-curated content from GridAcademy&apos;s team of educators and competitive exam specialists.
                100+ coaching partners. 50,000+ students. Transparent, verified, exam-aligned.
              </p>
              <Link href="/about" className="inline-block text-sm font-semibold text-primary-dark hover:underline mt-2">About GridAcademy</Link>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-ink text-white p-6 md:p-7 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-lg">Ready to practise?</p>
              <p className="text-[15px] text-ink-muted mt-1">Take a free mock test on the real exam interface, with a solution for every question.</p>
            </div>
            <Link href="/exams" className="h-11 shrink-0 inline-flex items-center px-5 rounded-lg bg-primary font-semibold hover:bg-primary-dark">Browse mock tests</Link>
          </div>

          <Link href="/blog" className="inline-flex items-center gap-1 mt-8 text-[15px] font-semibold text-primary-dark hover:underline">
            <ChevronRight className="w-4 h-4 rotate-180" /> All articles
          </Link>
        </div>
      </div>
    </>
  );
}
