export function calculateSurgePrice(baseAmount, maxBudget, createdAt, deadline) {
  // If no deadline or max budget is set, or if base amount is already maxed, return base
  if (!deadline || !maxBudget || baseAmount >= maxBudget) return baseAmount;
  
  const now = new Date();
  const start = new Date(createdAt);
  const end = new Date(deadline);
  
  if (now >= end) return maxBudget; // Deadline passed, hit the max budget
  if (now <= start) return baseAmount; // Just started
  
  const totalDuration = end.getTime() - start.getTime();
  const timeElapsed = now.getTime() - start.getTime();
  const percentageSpent = timeElapsed / totalDuration;
  
  // SURGE LOGIC: Price stays normal for the first 50% of the time, 
  // then scales linearly up to the max budget as the deadline approaches.
  if (percentageSpent < 0.5) return baseAmount;
  
  const surgeFactor = (percentageSpent - 0.5) * 2; // Scales from 0.0 to 1.0
  const surgeAmount = baseAmount + ((maxBudget - baseAmount) * surgeFactor);
  
  return Math.round(surgeAmount);
}