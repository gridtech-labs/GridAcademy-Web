import { Metadata } from 'next';
import { Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers — GridAcademy',
  description: 'Join the GridAcademy team and help shape the future of exam preparation in India.',
};

export default function CareersPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-orange-100 mb-3">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">Careers</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Careers at GridAcademy</h1>
          <p className="text-orange-100 text-lg">Help us shape the future of exam preparation in India.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Briefcase className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No Open Positions Right Now</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">
          We&apos;re not actively hiring at this moment, but we&apos;re always interested in meeting talented people.
          Send us your resume and we&apos;ll reach out when something comes up.
        </p>
        <a
          href="mailto:info@gridacademy.in?subject=Career Enquiry"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl text-sm transition"
        >
          Send Your Resume
        </a>
        <p className="text-xs text-gray-400 mt-3">Email: info@gridacademy.in</p>
      </div>
    </>
  );
}
