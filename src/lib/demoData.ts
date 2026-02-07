import type { DemoProfile, Goal, GoalInputs, Transaction } from '@/lib/types';

export const demoProfile: DemoProfile = {
  user: {
    userId: 'user_demo_1',
    email: 'demo@breakeven.app',
    mode: 'SEPARATE',
    householdId: 'house_1',
    preferences: {
      defaultPlan: 'STEADY'
    }
  },
  household: {
    householdId: 'house_1',
    members: ['user_demo_1']
  },
  currentBuffer: 600,
  monthlyIncome: 4200,
  monthlyBills: 1900,
  partnerIncome: 3800
};

export const demoGoal: Goal = {
  goalId: 'goal_demo_1',
  type: 'PRIVATE_BUFFER',
  targetAmount: 3000
};

export const demoGoalInputs: GoalInputs = {
  numPeople: 1,
  incomeMonthly: 4200,
  targetAmount: 3000,
  currentBuffer: 600,
  recurringBills: [
    { name: 'Rent', amount: 1200, category: 'HOUSING' },
    { name: 'Utilities', amount: 180, category: 'UTILITIES' },
    { name: 'Insurance', amount: 120, category: 'INSURANCE' }
  ],
  subscriptions: [
    { name: 'Streamly', amount: 18 },
    { name: 'Cloud storage', amount: 9 }
  ]
};

export const demoTransactions: Transaction[] = [
  {
    transactionId: 't1',
    nessieAccountId: 'acc_1',
    amount: 1250,
    merchant: 'Sunset Apartments',
    category: 'OTHER',
    timestamp: '2026-01-03T10:00:00Z'
  },
  {
    transactionId: 't2',
    nessieAccountId: 'acc_1',
    amount: 340,
    merchant: 'Whole Foods',
    category: 'FOOD',
    timestamp: '2026-01-06T12:10:00Z'
  },
  {
    transactionId: 't3',
    nessieAccountId: 'acc_1',
    amount: 220,
    merchant: 'City Gas',
    category: 'TRANSPORT',
    timestamp: '2026-01-08T09:00:00Z'
  },
  {
    transactionId: 't4',
    nessieAccountId: 'acc_1',
    amount: 185,
    merchant: 'Brightline Health',
    category: 'OTHER',
    timestamp: '2026-01-10T09:00:00Z'
  },
  {
    transactionId: 't5',
    nessieAccountId: 'acc_1',
    amount: 410,
    merchant: 'Local Dining',
    category: 'FOOD',
    timestamp: '2026-01-11T19:40:00Z'
  },
  {
    transactionId: 't6',
    nessieAccountId: 'acc_1',
    amount: 290,
    merchant: 'Style Market',
    category: 'SHOPPING',
    timestamp: '2026-01-12T15:10:00Z'
  },
  {
    transactionId: 't7',
    nessieAccountId: 'acc_1',
    amount: 120,
    merchant: 'Streamly',
    category: 'SUBSCRIPTIONS',
    timestamp: '2026-01-14T08:00:00Z'
  },
  {
    transactionId: 't8',
    nessieAccountId: 'acc_1',
    amount: 160,
    merchant: 'Wellness Studio',
    category: 'OTHER',
    timestamp: '2026-01-16T18:00:00Z'
  },
  {
    transactionId: 't9',
    nessieAccountId: 'acc_1',
    amount: 90,
    merchant: 'Museum Night',
    category: 'ENTERTAINMENT',
    timestamp: '2026-01-18T20:00:00Z'
  },
  {
    transactionId: 't10',
    nessieAccountId: 'acc_1',
    amount: 140,
    merchant: 'Weekend Travel',
    category: 'OTHER',
    timestamp: '2026-01-20T07:00:00Z'
  },
  {
    transactionId: 't11',
    nessieAccountId: 'acc_1',
    amount: 85,
    merchant: 'Gift Shop',
    category: 'OTHER',
    timestamp: '2026-01-21T12:00:00Z'
  },
  {
    transactionId: 't12',
    nessieAccountId: 'acc_1',
    amount: 75,
    merchant: 'Pet Pantry',
    category: 'OTHER',
    timestamp: '2026-01-22T09:00:00Z'
  }
];
