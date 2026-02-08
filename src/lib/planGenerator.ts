import type { CategoryDelta, GoalInputs, Plan, PlanInput, PlanType, Snapshot } from '@/lib/types';

function round(amount: number) {
  return Math.round(amount);
}

function buildChecklist(planType: PlanType, topCategories: string[]) {
  const prefix = planType === 'FAST' ? 'This week' : 'This week, gently';
  return [
    `${prefix}, move your savings transfer to payday + 1 day.`,
    `Trim one ${topCategories[0]} expense by swapping to a lower-cost option.`,
    `Pause one unused subscription and redirect that cash to your buffer.`,
    `Schedule a 20-minute money check-in for mid-week.`
  ];
}

function buildSummary(planType: PlanType, monthlySavings: number, monthsToGoal: number) {
  const tone = planType === 'FAST' ? 'fastest' : 'steady';
  return `This ${tone} plan frees about $${monthlySavings} per month, which reaches your goal in roughly ${monthsToGoal} months. The biggest wins come from targeted cuts in your highest-spend categories while protecting essentials.`;
}

const CATEGORIES = ['SUBSCRIPTIONS', 'SHOPPING', 'ENTERTAINMENT', 'FOOD', 'TRANSPORT', 'OTHER'] as const;

const PLAN_RATES: Record<PlanType, Record<(typeof CATEGORIES)[number], number>> = {
  FAST: {
    SUBSCRIPTIONS: 0.8,
    SHOPPING: 0.6,
    ENTERTAINMENT: 0.8,
    FOOD: 0.25,
    TRANSPORT: 0.1,
    OTHER: 0.1
  },
  STEADY: {
    SUBSCRIPTIONS: 0.6,
    SHOPPING: 0.4,
    ENTERTAINMENT: 0.6,
    FOOD: 0.12,
    TRANSPORT: 0.05,
    OTHER: 0.05
  }
};

export function buildMonthlySnapshot(goalInputs: GoalInputs, transactions: PlanInput['transactions']): Snapshot {
  const spendByCategory: Record<string, number> = {};
  const fixedSpend = goalInputs.recurringBills.reduce((sum, bill) => sum + bill.amount, 0);
  const subsSpend = goalInputs.subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  if (goalInputs.variableSpendByCategory) {
    spendByCategory.FOOD = goalInputs.variableSpendByCategory.FOOD;
    spendByCategory.SHOPPING = goalInputs.variableSpendByCategory.SHOPPING;
    spendByCategory.ENTERTAINMENT = goalInputs.variableSpendByCategory.ENTERTAINMENT;
    spendByCategory.TRANSPORT = goalInputs.variableSpendByCategory.TRANSPORT;
    spendByCategory.OTHER = goalInputs.variableSpendByCategory.OTHER;
  } else {
    transactions.forEach((tx) => {
      if (tx.amount <= 0) return;
      spendByCategory[tx.category] = (spendByCategory[tx.category] || 0) + tx.amount;
    });
  }

  const variableSpend = ['FOOD', 'SHOPPING', 'ENTERTAINMENT', 'TRANSPORT', 'OTHER'].reduce(
    (sum, category) => sum + (spendByCategory[category] || 0),
    0
  );

  const totalSpend = fixedSpend + subsSpend + variableSpend;
  const baselineSavings = Math.max(0, goalInputs.incomeMonthly - totalSpend);
  const deficit = Math.max(0, totalSpend - goalInputs.incomeMonthly);

  return {
    people: goalInputs.numPeople,
    incomeMonthly: goalInputs.incomeMonthly,
    fixedSpend: round(fixedSpend),
    subsSpend: round(subsSpend),
    spendByCategory,
    variableSpend: round(variableSpend),
    totalSpend: round(totalSpend),
    baselineSavings: round(baselineSavings),
    deficit: round(deficit)
  };
}

function computeCuts(snapshot: Snapshot, goalInputs: GoalInputs, planType: PlanType) {
  const floors = {
    SUBSCRIPTIONS: 10,
    SHOPPING: 40 * goalInputs.numPeople,
    ENTERTAINMENT: 30 * goalInputs.numPeople,
    FOOD: 220 * goalInputs.numPeople,
    TRANSPORT: 60,
    OTHER: 50
  };

  const deltas: CategoryDelta[] = [];
  let extraSavings = 0;

  CATEGORIES.forEach((category) => {
    const current =
      category === 'SUBSCRIPTIONS'
        ? snapshot.subsSpend
        : snapshot.spendByCategory[category] || 0;
    if (current === 0) {
      deltas.push({ category, before: 0, after: 0, change: 0 });
      return;
    }
    const rate = PLAN_RATES[planType][category];
    const proposed = current * (1 - rate);
    const floor = floors[category];
    const newSpend = Math.max(proposed, floor);
    const saved = Math.max(0, current - newSpend);
    extraSavings += saved;
    deltas.push({
      category,
      before: round(current),
      after: round(newSpend),
      change: round(saved)
    });
  });

  return { deltas, extraSavings: round(extraSavings) };
}

export function generatePlan(input: PlanInput, planType: PlanType, snapshot: Snapshot): Plan {
  const { deltas, extraSavings } = computeCuts(snapshot, input.goalInputs, planType);
  const need = Math.max(0, input.goalInputs.targetAmount - input.goalInputs.currentBuffer);
  const netMonthly = snapshot.baselineSavings + extraSavings;
  const savedPerMonth = Math.max(0, netMonthly - snapshot.deficit);
  const monthsToGoal = savedPerMonth > 0 ? Math.ceil(need / savedPerMonth) : null;
  const incomeBoost = planType === 'FAST' ? 120 : 60;

  const topChanges = deltas
    .sort((a, b) => b.change - a.change)
    .slice(0, 3)
    .map((delta) => delta.category);

  return {
    planId: `${planType.toLowerCase()}_${input.goal.goalId}`,
    type: planType,
    savedPerMonth: round(savedPerMonth),
    monthsToGoal,
    deltasByCategory: deltas,
    weeklyChecklist: buildChecklist(planType, topChanges),
    aiSummary: monthsToGoal
      ? buildSummary(planType, round(savedPerMonth), monthsToGoal)
      : 'You are currently in a deficit. Reduce expenses or increase income to start progressing toward the goal.',
    topChanges,
    incomeBoost,
    extraSavings,
    deficit: snapshot.deficit
  };
}
