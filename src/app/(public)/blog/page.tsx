import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog-posts';
import PageIntro from '@/components/ui/PageIntro';

export const metadata: Metadata = {
  title: 'Blog — Exam Tips, Preparation Guides & Syllabus Updates',
  description:
    'Expert articles on SSC CGL, CUET, RRB ALP, NEET and more — exam patterns, syllabus breakdowns, preparation strategies and free mock test guides.',
  alternates: { canonical: 'https://www.gridacademy.in/blog' },
};

const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

export default function BlogPage({ searchParams }: { searchParams?: { category?: string } }) {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map(p => p.category)));
  const active = categories.includes(searchParams?.category ?? '') ? searchParams!.category! : '';
  const visible = active ? posts.filter(p => p.category === active) : posts;
  const [lead, ...rest] = visible;

  const chip = (on: boolean) =>
    `h-9 inline-flex items-center px-3.5 rounded-full text-[13.5px] font-medium whitespace-nowrap ${on ? 'bg-ink text-white' : 'bg-white border border-line text-[#344054] hover:bg-[#f2f4f7]'}`;

  return (
    <div className="bg-white text-ink">
      <PageIntro
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
        eyebrow="Resources"
        title="Exam guides and preparation strategy"
        description="Exam patterns, syllabus breakdowns and study plans for SSC, CUET, Railways, NEET and more."
      >
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 mt-1">
          <Link href="/blog" className={chip(!active)}>All</Link>
          {categories.map(c => <Link key={c} href={`/blog?category=${encodeURIComponent(c)}`} className={chip(active === c)}>{c}</Link>)}
        </div>
      </PageIntro>

      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-8">
        {lead && (
          <Link href={`/blog/${lead.slug}`} className="group grid md:grid-cols-[1.4fr_1fr] gap-4 md:gap-10 border border-line rounded-xl p-6 md:p-8 hover:border-primary/40 transition-colors">
            <div className="flex flex-col gap-3">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-primary-dark">Latest · {lead.category}</p>
              <h2 className="text-2xl md:text-[30px] font-bold leading-tight tracking-[-0.01em] group-hover:text-primary-dark">{lead.title}</h2>
            </div>
            <div className="flex flex-col gap-3 justify-between">
              <p className="text-[15.5px] leading-relaxed text-[#475467] line-clamp-4">{lead.excerpt}</p>
              <p className="text-[13px] text-[#667085]">{fmt(lead.publishedAt)} · {lead.readingTimeMinutes} min read</p>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {rest.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 bg-white border border-line rounded-xl p-5 hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_rgba(14,23,38,.18)] transition">
                <span className="self-start h-[22px] inline-flex items-center px-2 rounded-full bg-primary-tint text-primary-dark text-[11.5px] font-medium">{post.category}</span>
                <h3 className="text-[17px] font-semibold leading-snug group-hover:text-primary-dark">{post.title}</h3>
                <p className="text-sm leading-relaxed text-[#475467] line-clamp-3 flex-1">{post.excerpt}</p>
                <p className="text-[12.5px] text-[#667085] pt-3 border-t border-line">{fmt(post.publishedAt)} · {post.readingTimeMinutes} min read</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
