import { DietaryTag } from '../types';

export const LIFESTYLE_CATEGORIES: DietaryTag[] = [
  { id: 'fitness', label: 'Fitness Focused', icon: '🏋️', category: 'lifestyle', color: 'from-amber-500/20 to-orange-500/20 text-orange-700' },
  { id: 'high-protein', label: 'High Protein', icon: '💪', category: 'lifestyle', color: 'from-blue-500/20 to-indigo-500/20 text-indigo-700' },
  { id: 'healthy', label: 'Healthy Choice', icon: '🥗', category: 'lifestyle', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-700' },
  { id: 'budget', label: 'Budget Bites', icon: '💰', category: 'lifestyle', color: 'from-yellow-500/20 to-amber-500/20 text-amber-800' },
  { id: 'quick15', label: 'Quick 15', icon: '⚡', category: 'lifestyle', color: 'from-rose-500/20 to-red-500/20 text-rose-700' },
  { id: 'late-night', label: 'Late Night', icon: '🌙', category: 'lifestyle', color: 'from-purple-500/20 to-indigo-500/20 text-purple-700' },
  { id: 'family-meals', label: 'Family Meals', icon: '👨‍👩‍👧', category: 'lifestyle', color: 'from-cyan-500/20 to-sky-500/20 text-sky-800' },
  { id: 'office-meals', label: 'Office Meals', icon: '🧑‍💻', category: 'lifestyle', color: 'from-slate-500/20 to-zinc-500/20 text-slate-800' }
];

export const FOOD_PREFERENCE_CATEGORIES: DietaryTag[] = [
  { id: 'kerala-favs', label: 'Kerala Favourites', icon: '🍛', category: 'food_pref', color: 'from-amber-500/20 to-yellow-500/20 text-yellow-900' },
  { id: 'veg', label: 'Vegetarian', icon: '🌱', category: 'food_pref', color: 'from-green-500/20 to-emerald-500/20 text-green-800' },
  { id: 'non-veg', label: 'Non-Vegetarian', icon: '🍗', category: 'food_pref', color: 'from-red-500/20 to-rose-500/20 text-red-800' },
  { id: 'spicy-lovers', label: 'Spicy Lovers', icon: '🌶️', category: 'food_pref', color: 'from-red-500/20 to-orange-500/20 text-red-700' },
  { id: 'comfort-food', label: 'Comfort Food', icon: '🍔', category: 'food_pref', color: 'from-amber-500/20 to-orange-500/20 text-amber-900' },
  { id: 'breakfast', label: 'Breakfast', icon: '🍳', category: 'food_pref', color: 'from-orange-500/20 to-yellow-500/20 text-orange-800' },
  { id: 'lunch', label: 'Lunch Boxes', icon: '🍱', category: 'food_pref', color: 'from-teal-500/20 to-emerald-500/20 text-teal-800' },
  { id: 'dinner', label: 'Dinner Delights', icon: '🌃', category: 'food_pref', color: 'from-indigo-500/20 to-purple-500/20 text-indigo-800' },
  { id: 'tea-snacks', label: 'Tea & Chaya Kadi', icon: '☕', category: 'food_pref', color: 'from-amber-500/20 to-stone-500/20 text-stone-800' }
];

export const HEALTH_CONSCIOUS_TAGS: DietaryTag[] = [
  { id: 'lower-sugar', label: 'Lower Added Sugar', icon: '🍃', category: 'health_conscious', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-800' },
  { id: 'less-oil', label: 'Less Oil / Steamed', icon: '💧', category: 'health_conscious', color: 'from-cyan-500/20 to-blue-500/20 text-cyan-800' },
  { id: 'less-spicy', label: 'Mild / Less Spicy', icon: '🥣', category: 'health_conscious', color: 'from-yellow-500/20 to-amber-500/20 text-amber-800' },
  { id: 'lower-sodium', label: 'Lower Sodium', icon: '🧂', category: 'health_conscious', color: 'from-sky-500/20 to-indigo-500/20 text-sky-800' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛', category: 'health_conscious', color: 'from-purple-500/20 to-violet-500/20 text-purple-800' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾', category: 'health_conscious', color: 'from-amber-500/20 to-orange-500/20 text-amber-900' }
];

export const BUDGET_TIERS = [
  { id: 'under-100', label: 'Under ₹100', max: 100, badge: 'Budget Super-Saver' },
  { id: 'under-150', label: 'Under ₹150', max: 150, badge: 'Pocket Friendly' },
  { id: 'under-200', label: 'Under ₹200', max: 200, badge: 'Popular Daily Bite' },
  { id: 'under-300', label: 'Under ₹300', max: 300, badge: 'Hearty Meal' },
  { id: 'under-500', label: 'Under ₹500', max: 500, badge: 'Premium Feast' },
  { id: 'above-500', label: '₹500+', max: 9999, badge: 'Gourmet & Platter' }
];
