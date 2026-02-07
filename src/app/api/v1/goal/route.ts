import { NextResponse } from 'next/server';
import { z } from 'zod';

const RecurringBillSchema = z.object({
  name: z.string(),
  amount: z.number().min(0),
  category: z.enum(['HOUSING', 'UTILITIES', 'DEBT', 'INSURANCE', 'OTHER_FIXED'])
});

const SubscriptionSchema = z.object({
  name: z.string(),
  amount: z.number().min(0),
  essential: z.boolean().optional()
});

const GoalInputsSchema = z.object({
  numPeople: z.number().int().min(1),
  incomeMonthly: z.number().min(0),
  targetAmount: z.number().min(0),
  currentBuffer: z.number().min(0),
  recurringBills: z.array(RecurringBillSchema),
  subscriptions: z.array(SubscriptionSchema)
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const payload = await req.json();
  const inputs = GoalInputsSchema.parse(payload);
  return NextResponse.json({ ok: true, goalInputs: inputs });
}
