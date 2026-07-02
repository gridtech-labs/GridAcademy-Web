import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with GridAcademy for support, partnerships, or exam enquiries.',
  alternates: { canonical: 'https://www.gridacademy.in/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
