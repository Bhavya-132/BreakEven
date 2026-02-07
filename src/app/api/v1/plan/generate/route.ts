import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildMonthlySnapshot, generatePlan } from '@/lib/planGenerator';
import { demoGoal, demoGoalInputs, demoProfile, demoTransactions } from '@/lib/demoData';

const InputSchema = z.object({
  profile: z.any().optional(),
  goal: z.any().optional(),
  goalInputs: z.any().optional(),
  transactions: z.array(z.any()).optional()
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const payload = await req.json();
  const input = InputSchema.parse(payload);
  const mergedInput = {
    profile: input.profile ?? demoProfile,
    goal: input.goal ?? demoGoal,
    goalInputs: input.goalInputs ?? demoGoalInputs,
    transactions: input.transactions ?? demoTransactions
  };
  const snapshot = buildMonthlySnapshot(mergedInput.goalInputs, mergedInput.transactions);
  const fastPlan = generatePlan(mergedInput, 'FAST', snapshot);
  const steadyPlan = generatePlan(mergedInput, 'STEADY', snapshot);

  return NextResponse.json({
    snapshot,
    plans: [fastPlan, steadyPlan]
  });
}
