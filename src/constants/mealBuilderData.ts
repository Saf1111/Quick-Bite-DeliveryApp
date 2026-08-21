import { MealBuilderIngredient } from '../types';

export const MEAL_BASES: MealBuilderIngredient[] = [
  {
    id: 'base-kerala-red-rice',
    name: 'Steamed Kerala Matta Rice',
    category: 'base',
    price: 49,
    calories: 210,
    proteinG: 4.5,
    image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#D97706'
  },
  {
    id: 'base-malabar-porotta',
    name: 'Flaky Malabar Porotta (2 pcs)',
    category: 'base',
    price: 45,
    calories: 320,
    proteinG: 5.2,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#F59E0B'
  },
  {
    id: 'base-quinoa-grain',
    name: 'Organic Quinoa & Brown Rice Bed',
    category: 'base',
    price: 79,
    calories: 180,
    proteinG: 7.0,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#10B981'
  },
  {
    id: 'base-whole-wheat-chapati',
    name: 'Handmade Whole Wheat Chapatis (3 pcs)',
    category: 'base',
    price: 39,
    calories: 190,
    proteinG: 6.2,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#B45309'
  },
  {
    id: 'base-crisp-salad-greens',
    name: 'Hydroponic Garden Greens Base',
    category: 'base',
    price: 69,
    calories: 45,
    proteinG: 2.5,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#059669'
  }
];

export const MEAL_PROTEINS: MealBuilderIngredient[] = [
  {
    id: 'prot-kerala-grilled-chicken',
    name: 'Kallu Shappu Spiced Grilled Chicken Breast',
    category: 'protein',
    price: 99,
    calories: 240,
    proteinG: 34,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop&q=80',
    isVeg: false,
    color: '#DC2626'
  },
  {
    id: 'prot-pan-seared-karimeen',
    name: 'Fresh Travancore Fish Fillet (Nadan Sear)',
    category: 'protein',
    price: 139,
    calories: 210,
    proteinG: 28,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
    isVeg: false,
    color: '#EA580C'
  },
  {
    id: 'prot-malabar-paneer-tikka',
    name: 'Char-Grilled Malabar Paneer Cubes',
    category: 'protein',
    price: 89,
    calories: 260,
    proteinG: 20,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#F59E0B'
  },
  {
    id: 'prot-spiced-boiled-eggs',
    name: 'Double Boiled Farm Eggs with Pepper Rub',
    category: 'protein',
    price: 49,
    calories: 155,
    proteinG: 14,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80',
    isVeg: false,
    color: '#FBBF24'
  },
  {
    id: 'prot-organic-soya-tofu',
    name: 'Crispy Herbed Tofu & Soya Chunks',
    category: 'protein',
    price: 69,
    calories: 160,
    proteinG: 22,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#10B981'
  }
];

export const MEAL_VEGETABLES: MealBuilderIngredient[] = [
  {
    id: 'veg-charred-broccoli',
    name: 'Charred Garlic Broccoli',
    category: 'vegetable',
    price: 35,
    calories: 40,
    proteinG: 3.2,
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#16A34A'
  },
  {
    id: 'veg-curry-leaf-beans',
    name: 'Kerala Beans & Carrot Thoran Sauté',
    category: 'vegetable',
    price: 29,
    calories: 55,
    proteinG: 2.1,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#65A30D'
  },
  {
    id: 'veg-roasted-bell-peppers',
    name: 'Flame Roasted Tri-Color Peppers',
    category: 'vegetable',
    price: 35,
    calories: 30,
    proteinG: 1.5,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#EF4444'
  },
  {
    id: 'veg-button-mushrooms',
    name: 'Pepper Tossed Button Mushrooms',
    category: 'vegetable',
    price: 39,
    calories: 35,
    proteinG: 3.5,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#78716C'
  },
  {
    id: 'veg-baby-corn',
    name: 'Crisp Grilled Baby Corn & Zucchini',
    category: 'vegetable',
    price: 35,
    calories: 45,
    proteinG: 2.0,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#CA8A04'
  }
];

export const MEAL_EXTRAS: MealBuilderIngredient[] = [
  {
    id: 'extra-roasted-cashews',
    name: 'Kerala Roasted Cashews & Curry Leaves',
    category: 'extra',
    price: 35,
    calories: 90,
    proteinG: 3.0,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#D97706'
  },
  {
    id: 'extra-flax-chia-seeds',
    name: 'Toasted Chia & Roasted Flax Seeds',
    category: 'extra',
    price: 25,
    calories: 50,
    proteinG: 2.5,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#71717A'
  },
  {
    id: 'extra-banana-chips',
    name: 'Crispy Nendran Banana Chips (Coconut Oil)',
    category: 'extra',
    price: 25,
    calories: 120,
    proteinG: 1.0,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#EAB308'
  },
  {
    id: 'extra-boiled-chickpeas',
    name: 'High-Fiber Spiced Black Chickpeas (Kadala)',
    category: 'extra',
    price: 29,
    calories: 85,
    proteinG: 4.5,
    image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#78350F'
  }
];

export const MEAL_SAUCES: MealBuilderIngredient[] = [
  {
    id: 'sauce-coconut-shallot',
    name: 'Travancore Roasted Coconut & Shallot Gravy',
    category: 'sauce',
    price: 25,
    calories: 70,
    proteinG: 1.2,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#92400E'
  },
  {
    id: 'sauce-green-mint-pepper',
    name: 'Mint, Kanthari Green Chili & Yogurt Drizzle',
    category: 'sauce',
    price: 20,
    calories: 35,
    proteinG: 1.8,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#15803D'
  },
  {
    id: 'sauce-smoky-tandoori-aioli',
    name: 'Smoky Light Garlic & Herb Emulsion',
    category: 'sauce',
    price: 25,
    calories: 60,
    proteinG: 0.8,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#EA580C'
  },
  {
    id: 'sauce-lemon-tahini',
    name: 'Zesty Lemon Herb & Cold-Pressed Sesame Dressing',
    category: 'sauce',
    price: 25,
    calories: 45,
    proteinG: 1.5,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    isVeg: true,
    color: '#CA8A04'
  }
];
