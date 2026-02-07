import { NextResponse } from 'next/server';
import { demoTransactions } from '@/lib/demoData';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ transactions: demoTransactions });
}
