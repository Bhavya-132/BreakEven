import { NextResponse } from 'next/server';
import { demoGoal, demoGoalInputs, demoProfile, demoTransactions } from '@/lib/demoData';
import { buildMonthlySnapshot, generatePlan } from '@/lib/planGenerator';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { planId: string } }) {
  const input = { profile: demoProfile, goal: demoGoal, goalInputs: demoGoalInputs, transactions: demoTransactions };
  const snapshot = buildMonthlySnapshot(demoGoalInputs, demoTransactions);
  if (params.planId.toLowerCase().includes('steady')) {
    return NextResponse.json({ plan: generatePlan(input, 'STEADY', snapshot), snapshot });
  }
  if (params.planId.toLowerCase().includes('fast')) {
    return NextResponse.json({ plan: generatePlan(input, 'FAST', snapshot), snapshot });
  }
  return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
}
