export type Mode = 'BALANCE' | 'SEPARATE' | 'EXIT';
export type PlanType = 'FAST' | 'STEADY';
export type GoalType = 'EXIT_BUFFER' | 'PRIVATE_BUFFER' | 'BALANCE';

export type User = {
  userId: string;
  email?: string;
  mode: Mode;
  householdId: string;
  preferences: {
    defaultPlan: PlanType;
  };
};

export type Household = {
  householdId: string;
  members: string[];
  sharedRules?: string;
};

export type Transaction = {
  transactionId: string;
  nessieAccountId: string;
  amount: number;
  merchant: string;
  category: string;
  timestamp: string;
};

export type Goal = {
  goalId: string;
  type: GoalType;
  targetAmount: number;
  deadline?: string;
};

export type RecurringBill = {
  id: string;
  name: string;
  amount: number;
  category: 'HOUSING' | 'UTILITIES' | 'DEBT' | 'INSURANCE' | 'OTHER_FIXED';
};

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  essential?: boolean;
};

export type GoalInputs = {
  numPeople: number;
  incomeMonthly: number;
  targetAmount: number;
  currentBuffer: number;
  recurringBills: RecurringBill[];
  subscriptions: Subscription[];
};

export type CategoryDelta = {
  category: string;
  before: number;
  after: number;
  change: number;
};

export type Plan = {
  planId: string;
  type: PlanType;
  savedPerMonth: number;
  monthsToGoal: number | null;
  deltasByCategory: CategoryDelta[];
  weeklyChecklist: string[];
  aiSummary: string;
  topChanges: string[];
  incomeBoost: number;
  extraSavings: number;
  deficit: number;
};

export type DemoProfile = {
  user: User;
  household: Household;
  currentBuffer: number;
  monthlyIncome: number;
  monthlyBills: number;
  partnerIncome?: number;
};

export type PlanInput = {
  profile: DemoProfile;
  goal: Goal;
  goalInputs: GoalInputs;
  transactions: Transaction[];
};

export type Snapshot = {
  people: number;
  incomeMonthly: number;
  fixedSpend: number;
  subsSpend: number;
  spendByCategory: Record<string, number>;
  variableSpend: number;
  totalSpend: number;
  baselineSavings: number;
  deficit: number;
};

export type PlanUpdate = {
  planType: PlanType;
  cadence: 'WEEKLY' | 'BIWEEKLY';
  lastUpdate: string;
  savedSoFar: number;
};
