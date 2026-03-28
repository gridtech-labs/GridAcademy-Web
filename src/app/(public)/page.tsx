// NOTE: This file is never served — app/page.tsx handles the "/" route.
// app/(public)/layout.tsx (Header + Footer) wraps all other pages in this group.
// Keeping this file empty to avoid Next.js duplicate-route warnings.
export default function PublicIndexPage() {
  return null;
}
