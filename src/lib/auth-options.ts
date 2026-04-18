import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  pages: { signIn: '/login', error: '/login' },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });
          if (!res.ok) return null;
          const json = await res.json();
          const d = json.data;
          return { id: String(d.userId), name: d.fullName, email: d.email, role: d.role, accessToken: d.accessToken };
        } catch { return null; }
      },
    }),
    CredentialsProvider({
      id: 'otp',
      name: 'OTP',
      credentials: {
        contact: { label: 'Email or Mobile', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.contact || !credentials?.otp) return null;
        try {
          const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contact: credentials.contact, otp: credentials.otp }),
          });
          if (!res.ok) return null;
          const json = await res.json();
          const d = json.data;
          return { id: String(d.userId), name: d.fullName, email: d.email, role: d.role, accessToken: d.accessToken };
        } catch { return null; }
      },
    }),
    CredentialsProvider({
      id: 'quick-access',
      name: 'Quick Access',
      credentials: {
        email:  { label: 'Email',  type: 'email' },
        mobile: { label: 'Mobile', type: 'text'  },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.mobile) return null;
        try {
          const res = await fetch(`${API_BASE}/api/auth/quick-access`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: credentials.email, mobile: credentials.mobile }),
          });
          if (!res.ok) return null;
          const json = await res.json();
          const d = json.data;
          return { id: String(d.userId), name: d.fullName, email: d.email, role: d.role, accessToken: d.accessToken };
        } catch { return null; }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID
      ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! })]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
};
