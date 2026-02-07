import { NextResponse } from 'next/server';
import { demoProfile, demoTransactions } from '@/lib/demoData';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json({
    profile: demoProfile,
    transactions: demoTransactions
  });
}
