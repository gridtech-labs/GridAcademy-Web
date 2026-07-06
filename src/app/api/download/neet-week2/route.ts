import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const FILE_PATH = path.join(
  process.cwd(),
  'src', 'app', 'NEET-2027-Week-2-Target-8-14-july.pdf'
);
const FILE_NAME = 'NEET-2027-Week-2-Target-8-14-july.pdf';

export async function GET() {
  try {
    const buffer = await readFile(FILE_PATH);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${FILE_NAME}"`,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'private, no-store',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found.' }, { status: 404 });
  }
}
