import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, email, phone, subject, message } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const smtpHost     = process.env.SMTP_HOST     ?? 'smtp.gmail.com';
  const smtpPort     = parseInt(process.env.SMTP_PORT ?? '587');
  const smtpUser     = process.env.SMTP_USER     ?? 'info@gridacademy.in';
  const smtpPassword = process.env.SMTP_PASSWORD ?? '';
  const contactEmail = process.env.CONTACT_EMAIL ?? 'info@gridacademy.in';

  if (!smtpPassword || smtpPassword.startsWith('REPLACE')) {
    console.warn('[Contact] SMTP_PASSWORD not configured — email not sent.');
    // Return success in dev so the form flow can be tested
    return NextResponse.json({ ok: true });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPassword },
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:20px;border-radius:10px;">
      <div style="background:#f97316;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h2 style="color:#fff;margin:0;font-size:1.25rem;">New Contact Form Message</h2>
        <p style="color:rgba(255,255,255,.85);margin:4px 0 0;font-size:.875rem;">GridAcademy — info@gridacademy.in</p>
      </div>
      <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#6b7280;width:110px;"><strong>Name:</strong></td><td style="padding:8px 0;color:#111827;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;"><strong>Email:</strong></td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#f97316;">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;"><strong>Phone:</strong></td><td style="padding:8px 0;color:#111827;">${phone || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;"><strong>Subject:</strong></td><td style="padding:8px 0;color:#111827;font-weight:600;">${subject}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #f3f4f6;margin:16px 0;" />
        <p style="color:#6b7280;font-size:13px;margin:0 0 8px;"><strong>Message:</strong></p>
        <div style="background:#fafafa;border-left:3px solid #f97316;padding:14px;border-radius:4px;color:#374151;font-size:14px;white-space:pre-wrap;">${message}</div>
        <hr style="border:none;border-top:1px solid #f3f4f6;margin:20px 0 14px;" />
        <p style="font-size:11px;color:#9ca3af;margin:0;">Sent via <a href="https://www.gridacademy.in/contact" style="color:#f97316;">gridacademy.in/contact</a></p>
      </div>
    </div>`;

  await transporter.sendMail({
    from:    `"GridAcademy" <${smtpUser}>`,
    to:      contactEmail,
    subject: `[Contact] ${subject}`,
    html,
  });

  return NextResponse.json({ ok: true });
}
