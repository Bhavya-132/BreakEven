import type { DemoProfile, Goal, GoalInputs, Plan, PlanUpdate, Snapshot, Transaction, Mode } from '@/lib/types';

const key = (name: string) => `breakeven_${name}`;

export function saveProfile(profile: DemoProfile) {
  localStorage.setItem(key('profile'), JSON.stringify(profile));
}

export function loadProfile(): DemoProfile | null {
  const value = localStorage.getItem(key('profile'));
  return value ? (JSON.parse(value) as DemoProfile) : null;
}

export function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem(key('transactions'), JSON.stringify(transactions));
}

export function loadTransactions(): Transaction[] {
  const value = localStorage.getItem(key('transactions'));
  return value ? (JSON.parse(value) as Transaction[]) : [];
}

export function saveGoal(goal: Goal) {
  localStorage.setItem(key('goal'), JSON.stringify(goal));
}

export function loadGoal(): Goal | null {
  const value = localStorage.getItem(key('goal'));
  return value ? (JSON.parse(value) as Goal) : null;
}

export function saveGoalInputs(inputs: GoalInputs) {
  localStorage.setItem(key('goal_inputs'), JSON.stringify(inputs));
}

export function loadGoalInputs(): GoalInputs | null {
  const value = localStorage.getItem(key('goal_inputs'));
  return value ? (JSON.parse(value) as GoalInputs) : null;
}

export function saveMode(mode: Mode) {
  localStorage.setItem(key('mode'), mode);
}

export function loadMode(): Mode | null {
  const value = localStorage.getItem(key('mode'));
  return value as Mode | null;
}

export function savePlans(plans: Plan[]) {
  localStorage.setItem(key('plans'), JSON.stringify(plans));
}

export function loadPlans(): Plan[] {
  const value = localStorage.getItem(key('plans'));
  return value ? (JSON.parse(value) as Plan[]) : [];
}

export function saveSnapshot(snapshot: Snapshot) {
  localStorage.setItem(key('snapshot'), JSON.stringify(snapshot));
}

export function loadSnapshot(): Snapshot | null {
  const value = localStorage.getItem(key('snapshot'));
  return value ? (JSON.parse(value) as Snapshot) : null;
}

export function savePlanContextKey(value: string) {
  localStorage.setItem(key('plan_context'), value);
}

export function loadPlanContextKey(): string | null {
  return localStorage.getItem(key('plan_context'));
}

export function savePlanUpdate(update: PlanUpdate) {
  localStorage.setItem(key(`plan_update_${update.planType}`), JSON.stringify(update));
}

export function loadPlanUpdate(planType: PlanUpdate['planType']): PlanUpdate | null {
  const value = localStorage.getItem(key(`plan_update_${planType}`));
  return value ? (JSON.parse(value) as PlanUpdate) : null;
}
