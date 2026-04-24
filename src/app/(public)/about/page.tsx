import { Metadata } from 'next';
import { BookOpen, Target, Users, TrendingUp, Shield, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — GridAcademy',
  description: 'Learn about GridAcademy, India\'s trusted marketplace for competitive exam mock tests.',
};

const stats = [
  { label: 'Students Enrolled', value: '50,000+' },
  { label: 'Mock Tests Available', value: '1,200+' },
  { label: 'Coaching Partners', value: '100+' },
  { label: 'Exams Covered', value: '25+' },
];

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To democratise access to quality exam preparation by connecting students with top coaching institutes across India.' },
  { icon: Shield, title: 'Quality Assurance', desc: 'Every test on our platform is verified and curated by subject-matter experts to ensure exam-level accuracy.' },
  { icon: Users, title: 'Student-First', desc: 'We design every feature with the student in mind — adaptive learning, clear analytics, and fair pricing.' },
  { icon: TrendingUp, title: 'Measurable Results', desc: 'Our students see a measurable improvement in mock test scores, translating to real exam success.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-orange-100 mb-3">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">About Us</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">About GridAcademy</h1>
          <p className="text-orange-100 text-lg max-w-2xl">
            India&apos;s trusted marketplace for competitive exam mock tests — empowering students to prepare smarter.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              GridAcademy was founded with a single goal: make quality exam preparation accessible to every student in India,
              regardless of geography or budget. We saw talented students struggle not because of lack of effort, but because
              they lacked access to the right resources.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Today, we partner with 100+ coaching institutes to bring their best mock tests directly to students across India.
              From SSC to UPSC, from banking exams to railway recruitment — GridAcademy covers it all.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe in transparent pricing, real exam simulations, and detailed analytics that help students understand
              exactly where they stand and what to work on next.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ label, value }) => (
              <div key={label} className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-orange-500 mb-1">{value}</p>
                <p className="text-sm text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">What We Stand For</h2>
          <p className="text-gray-500 text-center mb-8 text-sm">The principles that guide everything we do.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
          <Award className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h2 className="text-xl font-bold mb-2">Ready to Start Preparing?</h2>
          <p className="text-orange-100 text-sm mb-5 max-w-md mx-auto">
            Join 50,000+ students who are preparing smarter with GridAcademy&apos;s curated mock tests.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/exams" className="bg-white text-orange-600 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-50 transition">
              Browse Exams
            </a>
            <a href="/contact" className="bg-white/20 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-white/30 transition">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
