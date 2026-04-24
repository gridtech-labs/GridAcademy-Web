import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const SMTP_HOST     = process.env.SMTP_HOST     ?? 'smtpout.secureserver.net';
const SMTP_PORT     = parseInt(process.env.SMTP_PORT ?? '465');
const SMTP_USER     = process.env.SMTP_USER     ?? 'info@gridacademy.in';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD ?? '';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? 'info@gridacademy.in';

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true, // SSL — required for port 465
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    tls: { rejectUnauthorized: false }, // GoDaddy cert compatibility
  });
}

function internalHtml(name: string, email: string, phone: string, subject: string, message: string) {
  return `
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
}

function ackHtml(name: string, subject: string, message: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:20px;border-radius:10px;">
      <div style="background:#f97316;padding:20px 24px;border-radius:8px 8px 0 0;text-align:center;">
        <h2 style="color:#fff;margin:0;font-size:1.25rem;">Thanks for reaching out, ${name}!</h2>
        <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:.875rem;">GridAcademy — We've received your message.</p>
      </div>
      <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none;">
        <p style="color:#374151;font-size:14px;line-height:1.6;">
          Hi <strong>${name}</strong>,<br/><br/>
          Thank you for contacting GridAcademy. We have received your message regarding <strong>"${subject}"</strong>
          and our team will get back to you within <strong>24 hours</strong>.
        </p>
        <div style="background:#fafafa;border-left:3px solid #f97316;padding:14px;border-radius:4px;color:#6b7280;font-size:13px;white-space:pre-wrap;margin:16px 0;">${message}</div>
        <p style="color:#6b7280;font-size:13px;line-height:1.6;">
          In the meantime, you can browse our mock tests at
          <a href="https://www.gridacademy.in" style="color:#f97316;">gridacademy.in</a>
          or reach us directly at
          <a href="mailto:info@gridacademy.in" style="color:#f97316;">info@gridacademy.in</a>.
        </p>
        <hr style="border:none;border-top:1px solid #f3f4f6;margin:20px 0 16px;" />
        <p style="font-size:12px;color:#9ca3af;margin:0;text-align:center;">
          © ${new Date().getFullYear()} GridAcademy — India's trusted exam preparation platform
        </p>
      </div>
    </div>`;
}

export async function POST(req: NextRequest) {
  const { name, email, phone, subject, message } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  if (!SMTP_PASSWORD || SMTP_PASSWORD.startsWith('REPLACE')) {
    console.warn('[Contact] SMTP_PASSWORD not configured — email not sent.');
    return NextResponse.json({ ok: true });
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();

    // 1. Notify info@gridacademy.in
    await transporter.sendMail({
      from:    `"GridAcademy" <${SMTP_USER}>`,
      to:      CONTACT_EMAIL,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html:    internalHtml(name, email, phone, subject, message),
    });

    // 2. Acknowledge the sender
    await transporter.sendMail({
      from:    `"GridAcademy" <${SMTP_USER}>`,
      to:      email,
      subject: `We received your message — GridAcademy`,
      html:    ackHtml(name, subject, message),
    });

    console.log(`[Contact] Emails sent — internal: ${CONTACT_EMAIL}, ack: ${email}`);
    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error('[Contact] SMTP error:', err?.message ?? err);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again or email us at info@gridacademy.in' },
      { status: 500 }
    );
  }
}
