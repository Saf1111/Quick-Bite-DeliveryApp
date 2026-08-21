import { MenuItem, UserPreferences } from '../types';

export interface MatchScoreResult {
  overallScore: number; // 0 - 100
  breakdown: {
    fitness: number;
    highProtein: number;
    healthConscious: number;
    budget: number;
    dietaryFit: number;
    spiceFit: number;
  };
  reasons: string[];
}

export function computeQuickMatch(item: MenuItem, prefs: UserPreferences): MatchScoreResult {
  let reasons: string[] = [];
  
  // 1. Dietary Type Check
  let dietaryFit = 100;
  if (prefs.dietType === 'vegetarian' || prefs.dietType === 'vegan') {
    if (!item.isVeg) {
      dietaryFit = 0;
    }
  }

  // 2. High Protein Score (Protein density)
  const protein = item.nutrition?.proteinGrams || 0;
  const calories = item.nutrition?.calories || 300;
  const proteinRatio = (protein * 4) / Math.max(calories, 100); // % calories from protein
  let highProtein = Math.min(100, Math.round(proteinRatio * 200 + (protein > 25 ? 25 : protein > 15 ? 15 : 0)));
  if (protein >= 30) highProtein = Math.min(100, Math.max(88, highProtein));

  // 3. Fitness Score
  let fitness = 60;
  if (item.tags.includes('fitness') || item.tags.includes('high-protein')) fitness += 25;
  if (item.tags.includes('less-oil') || item.tags.includes('healthy')) fitness += 10;
  if (protein >= 25 && calories <= 550) fitness += 10;
  if (item.spiceLevel <= 2) fitness += 5;
  fitness = Math.min(99, Math.max(25, fitness));

  // 4. Health Conscious Score
  let healthConscious = 70;
  if (item.tags.includes('healthy')) healthConscious += 15;
  if (item.tags.includes('less-oil')) healthConscious += 10;
  if (item.tags.includes('lower-sugar')) healthConscious += 10;
  if (item.tags.includes('lower-sodium')) healthConscious += 10;
  if (item.tags.includes('gluten-free') || item.tags.includes('dairy-free')) healthConscious += 5;
  if (calories > 700) healthConscious -= 15;
  healthConscious = Math.min(98, Math.max(30, healthConscious));

  // 5. Budget Score
  let budget = 80;
  if (item.price <= 100) budget = 98;
  else if (item.price <= 150) budget = 92;
  else if (item.price <= 200) budget = 85;
  else if (item.price <= 300) budget = 75;
  else if (item.price <= 500) budget = 60;
  else budget = 45;

  // 6. Spice Tolerance Fit
  let spiceFit = 90;
  if (prefs.spiceTolerance === 'mild') {
    if (item.spiceLevel === 1) spiceFit = 98;
    else if (item.spiceLevel === 2) spiceFit = 80;
    else if (item.spiceLevel >= 3) spiceFit = 35;
  } else if (prefs.spiceTolerance === 'fire' || prefs.spiceTolerance === 'high') {
    if (item.spiceLevel >= 3) spiceFit = 98;
    else spiceFit = 75;
  }

  // Weightings based on user's active preferences
  let totalWeight = 0;
  let weightedSum = 0;

  // Dietary filter is strict
  if (dietaryFit === 0) {
    return {
      overallScore: 0,
      breakdown: { fitness: 0, highProtein: 0, healthConscious: 0, budget: 0, dietaryFit: 0, spiceFit: 0 },
      reasons: ['Does not match your vegetarian/vegan dietary filter']
    };
  }

  // Calculate customized weighted score
  const isFitnessUser = prefs.lifestyle.includes('fitness') || prefs.lifestyle.includes('high-protein');
  const isBudgetUser = prefs.lifestyle.includes('budget') || item.price <= prefs.maxBudget;
  const isHealthyUser = prefs.lifestyle.includes('healthy') || prefs.healthConcerns.length > 0;

  const wFitness = isFitnessUser ? 30 : 15;
  const wProtein = isFitnessUser ? 25 : 15;
  const wHealth = isHealthyUser ? 25 : 15;
  const wBudget = isBudgetUser ? 25 : 15;
  const wSpice = 10;

  totalWeight = wFitness + wProtein + wHealth + wBudget + wSpice;
  weightedSum = (fitness * wFitness) + (highProtein * wProtein) + (healthConscious * wHealth) + (budget * wBudget) + (spiceFit * wSpice);

  let overallScore = Math.min(99, Math.round(weightedSum / totalWeight));

  // Build transparent reasons
  if (isFitnessUser && protein >= 25) {
    reasons.push(`High protein content (${protein}g) aligns with your fitness goals`);
  }
  if (item.tags.includes('quick15')) {
    reasons.push(`Express preparation (${item.prepTimeMinutes} min) for quick bites`);
  }
  if (item.price <= 200) {
    reasons.push(`Pocket-friendly value at ₹${item.price}`);
  }
  if (prefs.healthConcerns.some(h => item.tags.includes(h))) {
    reasons.push(`Matches health preference: ${item.tags.filter(t => prefs.healthConcerns.includes(t)).join(', ')}`);
  }
  if (item.rating >= 4.8) {
    reasons.push(`Highly rated in Thiruvananthapuram (${item.rating} ★)`);
  }

  if (reasons.length === 0) {
    reasons.push(`Balanced nutrient & flavor profile for daily nutrition`);
  }

  return {
    overallScore,
    breakdown: {
      fitness,
      highProtein,
      healthConscious,
      budget,
      dietaryFit,
      spiceFit
    },
    reasons
  };
}

export function pickSurpriseMeal(items: MenuItem[], prefs: UserPreferences): { item: MenuItem; result: MatchScoreResult; tagline: string } | null {
  const eligible = items.filter(item => {
    if (prefs.dietType === 'vegetarian' && !item.isVeg) return false;
    return item.available;
  });

  if (eligible.length === 0) return null;

  // Compute scores and pick from top tiered items
  const scored = eligible.map(item => ({
    item,
    result: computeQuickMatch(item, prefs)
  })).sort((a, b) => b.result.overallScore - a.result.overallScore);

  // Take one of top 3 with slight randomness for delight
  const topPool = scored.slice(0, Math.min(3, scored.length));
  const picked = topPool[Math.floor(Math.random() * topPool.length)];

  const hour = new Date().getHours();
  let timeContext = 'Tonight\'s Surprise Bite';
  if (hour >= 6 && hour < 11) timeContext = 'Morning Sunrise Pick';
  else if (hour >= 11 && hour < 16) timeContext = 'Afternoon Power Lunch';
  else if (hour >= 16 && hour < 19) timeContext = 'Evening Chaya & Snack';

  return {
    item: picked.item,
    result: picked.result,
    tagline: timeContext
  };
}
