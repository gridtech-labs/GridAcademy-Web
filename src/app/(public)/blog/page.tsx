import { Metadata } from 'next';
import { BookOpen, Bell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog — GridAcademy',
  description: 'Exam tips, preparation strategies, and updates from GridAcademy.',
};

export default function BlogPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-orange-100 mb-3">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">Blog</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">GridAcademy Blog</h1>
          <p className="text-orange-100 text-lg">Exam tips, strategies and preparation guides.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Blog Coming Soon</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">
          We&apos;re working on bringing you expert articles, exam strategies, and preparation guides.
          Check back soon or follow us on social media for updates.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/exams" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition">
            Browse Mock Tests
          </a>
          <a href="/contact" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl text-sm transition">
            Contact Us
          </a>
        </div>
      </div>
    </>
  );
}
