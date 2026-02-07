import { NextResponse } from 'next/server';
import { demoProfile } from '@/lib/demoData';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ profile: demoProfile });
}
