export type UserRole = 'customer' | 'partner' | 'delivery' | 'admin';

export interface UserPreferences {
  dietType: 'all' | 'vegetarian' | 'non-vegetarian' | 'vegan';
  lifestyle: string[]; // e.g. 'fitness', 'high-protein', 'budget', 'quick'
  healthConcerns: string[]; // e.g. 'lower-sugar', 'less-oil', 'less-spicy', 'lower-sodium', 'dairy-free', 'gluten-free'
  spiceTolerance: 'mild' | 'medium' | 'high' | 'fire';
  maxBudget: number;
  favCuisines: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  preferences: UserPreferences;
  savedAddresses: Address[];
  defaultAddressId?: string;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  area: string; // e.g. 'Kowdiar', 'Technopark', 'Kazhakkoottam'
  district: string; // 'Thiruvananthapuram'
  landmark?: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export interface LocationZone {
  id: string;
  name: string;
  tagline: string;
  district: string;
  lat: number;
  lng: number;
  radiusKm: number;
  avgDeliveryMin: number;
  activeRestaurantsCount: number;
}

export interface DietaryTag {
  id: string;
  label: string;
  icon: string;
  category: 'lifestyle' | 'food_pref' | 'health_conscious';
  color: string;
}

export interface NutritionalInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number;
  sugarGrams?: number;
  sodiumMg?: number;
}

export interface MenuItemOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface MenuItemOptionGroup {
  id: string;
  title: string;
  required: boolean;
  minSelect: number;
  maxSelect: number;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isQuick15?: boolean;
  prepTimeMinutes: number;
  rating: number;
  ratingCount: number;
  category: string;
  cuisine: string;
  tags: string[];
  spiceLevel: 1 | 2 | 3 | 4; // 1: Mild, 2: Medium, 3: Spicy, 4: Extra Hot
  nutrition: NutritionalInfo;
  optionGroups?: MenuItemOptionGroup[];
  available: boolean;
  matchScore?: number;
  matchReasons?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  coverImage: string;
  logo: string;
  isPartner: boolean; // Quick Bite Partner vs Nearby Discovered Place
  cuisines: string[];
  rating: number;
  ratingCount: number;
  area: string;
  address: string;
  district: string;
  lat: number;
  lng: number;
  distanceKm: number;
  avgPrepTimeMin: number;
  avgDeliveryTimeMin: number;
  priceForTwo: number;
  isOpen: boolean;
  openingHours: string;
  pureVeg: boolean;
  featuredTags: string[];
  menuCategories: string[];
  menu: MenuItem[];
  reviews: RestaurantReview[];
  phone: string;
}

export interface RestaurantReview {
  id: string;
  restaurantId?: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  foodItemName?: string;
  helpfulCount: number;
}

export interface CartCustomization {
  groupTitle: string;
  selectedOption: string;
  priceDelta: number;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: CartCustomization[];
  itemTotal: number;
  specialInstructions?: string;
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: CartCustomization[];
  image: string;
  isVeg: boolean;
}

export const OrderStatus = {
  PLACED: 'placed' as const,
  CONFIRMED: 'confirmed' as const,
  PREPARING: 'preparing' as const,
  READY: 'ready' as const,
  OUT_FOR_DELIVERY: 'out_for_delivery' as const,
  DELIVERED: 'delivered' as const,
  CANCELLED: 'cancelled' as const
};

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTimelineEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  rating: number;
  photo: string;
  currentLat: number;
  currentLng: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  items: OrderItem[];
  itemTotal: number;
  deliveryFee: number;
  taxesAndCharges: number;
  discount: number;
  couponCode?: string;
  grandTotal: number;
  status: OrderStatus;
  paymentMethod: 'upi' | 'card' | 'cod' | 'quickbite_wallet';
  paymentStatus: 'paid' | 'pending' | 'failed';
  deliveryAddress: Address;
  estimatedDeliveryTime: string;
  createdAt: string;
  timeline: OrderTimelineEvent[];
  deliveryPartner?: DeliveryPartner;
}

export interface MealBuilderIngredient {
  id: string;
  name: string;
  category: 'base' | 'protein' | 'vegetable' | 'extra' | 'sauce';
  price: number;
  calories: number;
  proteinG: number;
  image: string;
  isVeg: boolean;
  color: string;
}

export interface CustomMeal {
  base: MealBuilderIngredient;
  protein: MealBuilderIngredient;
  vegetables: MealBuilderIngredient[];
  extras: MealBuilderIngredient[];
  sauce: MealBuilderIngredient;
  totalPrice: number;
  totalCalories: number;
  totalProtein: number;
  name: string;
}

export interface PromoCoupon {
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
}
