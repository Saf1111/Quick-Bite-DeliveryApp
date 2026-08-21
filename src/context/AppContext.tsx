import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LocationZone,
  UserPreferences,
  CartItem,
  MenuItem,
  Restaurant,
  Order,
  CartCustomization,
  OrderStatus,
  Address,
  UserProfile
} from '../types';
import { TVM_DISTRICT_ZONES, DEFAULT_LOCATION } from '../constants/locations';
import { INITIAL_USER_PROFILE, INITIAL_RESTAURANTS } from '../constants/mockData';
import { orderService } from '../services/orderService';

export interface AppliedPromo {
  code: string;
  discountAmount: number;
  description: string;
}

interface AppContextType {
  // Navigation & Views
  activeView: string;
  setActiveView: (view: string) => void;
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  activeOrderId: string | null; // Alias for activeTrackingOrderId
  setActiveOrderId: (id: string | null) => void;
  accountSubTab: 'profile' | 'addresses' | 'favorites';
  setAccountSubTab: (tab: 'profile' | 'addresses' | 'favorites') => void;

  // Location
  locationZone: LocationZone;
  setLocationZone: (zone: LocationZone) => void;
  allZones: LocationZone[];

  // User Profile & Preferences
  userProfile: UserProfile;
  updateUserProfile: (newProfile: Partial<UserProfile>) => void;
  userPreferences: UserPreferences;
  updateUserPreferences: (newPrefs: UserPreferences) => void;

  // Data & Restaurants
  restaurants: Restaurant[];
  updateRestaurant: (updated: Restaurant) => void;
  addRestaurant: (newRest: Restaurant) => void;

  // Cart
  cart: CartItem[];
  cartItems: CartItem[]; // Compatibility alias
  addToCart: (item: MenuItem, quantity?: number, customizations?: CartCustomization[], specialInstructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  updateCartItemQuantity: (cartItemId: string, newQty: number) => void; // Compatibility alias
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  cartRestaurantId: string | null;
  cartRestaurantName: string | null;

  // Promo Code
  appliedPromo: AppliedPromo | null;
  applyPromoCode: (promo: AppliedPromo) => void;
  removePromoCode: () => void;

  // Favorites
  favoriteRestaurantIds: string[];
  favoriteItemIds: string[];
  toggleFavoriteRestaurant: (id: string) => void;
  toggleFavoriteItem: (id: string) => void;

  // Orders
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  createOrderFromCart: (options?: {
    address?: Address;
    paymentMethod?: 'upi' | 'card' | 'cod' | 'quickbite_wallet';
    notes?: string;
    couponCode?: string;
    discount?: number;
  }) => Promise<Order>;
  placeOrder: (options?: any) => Promise<Order>; // Compatibility alias
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, reason?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isSurpriseModalOpen: boolean;
  setIsSurpriseModalOpen: (open: boolean) => void;
  isMealBuilderOpen: boolean;
  setIsMealBuilderOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Toast
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active View State
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [accountSubTab, setAccountSubTab] = useState<'profile' | 'addresses' | 'favorites'>('profile');

  // Location State
  const [locationZone, setLocationZone] = useState<LocationZone>(DEFAULT_LOCATION);
  const allZones = TVM_DISTRICT_ZONES;

  // User Profile & Preferences State
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(INITIAL_USER_PROFILE.preferences);

  // Restaurants State
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);

  // Favorites State
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(['rest-technopark-malabar-spices']);
  const [favoriteItemIds, setFavoriteItemIds] = useState<string[]>(['item-charred-chicken-bowl']);

  // Orders State (synced from centralized OrderService)
  const [orders, setOrders] = useState<Order[]>(() => orderService.getOrders());

  // Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);
  const [isMealBuilderOpen, setIsMealBuilderOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Subscribe to centralized OrderService for real-time synchronization between Admin and Customer
  useEffect(() => {
    const unsubscribe = orderService.subscribeToOrderUpdates((freshOrders) => {
      setOrders(freshOrders);
      if (!activeTrackingOrderId && freshOrders.length > 0) {
        setActiveTrackingOrderId(freshOrders[0].id);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Load persisted preferences on mount
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem('qb_preferences');
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        setUserPreferences(parsed);
      }
      const savedProfile = localStorage.getItem('qb_user_profile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      const savedZone = localStorage.getItem('qb_zone');
      if (savedZone) {
        const found = allZones.find(z => z.id === savedZone);
        if (found) setLocationZone(found);
      }
      const savedFavRests = localStorage.getItem('qb_fav_rests');
      if (savedFavRests) setFavoriteRestaurantIds(JSON.parse(savedFavRests));
      const savedFavItems = localStorage.getItem('qb_fav_items');
      if (savedFavItems) setFavoriteItemIds(JSON.parse(savedFavItems));
    } catch {
      // Ignore
    }
  }, []);

  const updateUserProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...newProfile };
      try {
        localStorage.setItem('qb_user_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateUserPreferences = (newPrefs: UserPreferences) => {
    setUserPreferences(newPrefs);
    try {
      localStorage.setItem('qb_preferences', JSON.stringify(newPrefs));
    } catch {}
    showToast('Dietary preferences updated. Quick Match scores recalculated!', 'info');
  };

  const handleSetLocationZone = (zone: LocationZone) => {
    setLocationZone(zone);
    try {
      localStorage.setItem('qb_zone', zone.id);
    } catch {}
    showToast(`Delivery zone switched to ${zone.name}`, 'info');
  };

  // Cart operations
  const cartRestaurantId = cart.length > 0 ? cart[0].menuItem.restaurantId : null;
  const cartRestaurantName = cart.length > 0 ? cart[0].menuItem.restaurantName : null;

  const addToCart = (
    item: MenuItem,
    quantity = 1,
    customizations: CartCustomization[] = [],
    specialInstructions = ''
  ) => {
    if (cart.length > 0 && cart[0].menuItem.restaurantId !== item.restaurantId) {
      if (
        !window.confirm(
          `Your bag contains items from "${cartRestaurantName}". Discard current bag and add items from "${item.restaurantName}"?`
        )
      ) {
        return;
      }
      setCart([]);
    }

    const customizationPrice = customizations.reduce((sum, c) => sum + c.priceDelta, 0);
    const unitPrice = item.price + customizationPrice;
    const cartItemId = `${item.id}-${customizations.map(c => c.selectedOption).sort().join('-') || 'default'}`;

    setCart(prev => {
      const existingIdx = prev.findIndex(c => c.cartItemId === cartItemId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          itemTotal: newQty * unitPrice,
          specialInstructions: specialInstructions || updated[existingIdx].specialInstructions
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          menuItem: item,
          quantity,
          customizations,
          itemTotal: unitPrice * quantity,
          specialInstructions
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${quantity}x ${item.name} to your bag`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(c => c.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(c => {
          if (c.cartItemId === cartItemId) {
            const newQty = c.quantity + delta;
            if (newQty <= 0) return null;
            const unitPrice = c.itemTotal / c.quantity;
            return {
              ...c,
              quantity: newQty,
              itemTotal: newQty * unitPrice
            };
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const updateCartItemQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(c => {
        if (c.cartItemId === cartItemId) {
          const unitPrice = c.itemTotal / c.quantity;
          return {
            ...c,
            quantity: newQty,
            itemTotal: newQty * unitPrice
          };
        }
        return c;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromoCode = (promo: AppliedPromo) => {
    setAppliedPromo(promo);
    showToast(`Promo ${promo.code} applied: Saved ₹${promo.discountAmount}!`);
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  // Favorites
  const toggleFavoriteRestaurant = (id: string) => {
    setFavoriteRestaurantIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('qb_fav_rests', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleFavoriteItem = (id: string) => {
    setFavoriteItemIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('qb_fav_items', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Orders creation via centralized OrderService
  const createOrderFromCart = async (options?: {
    address?: Address;
    paymentMethod?: 'upi' | 'card' | 'cod' | 'quickbite_wallet';
    notes?: string;
    couponCode?: string;
    discount?: number;
  }): Promise<Order> => {
    const deliveryFee = cartTotal > 300 ? 0 : 25;
    const taxes = Math.round(cartTotal * 0.05);
    const discount = options?.discount ?? (appliedPromo ? appliedPromo.discountAmount : 0);
    const grandTotal = Math.max(0, cartTotal + deliveryFee + taxes - discount);

    const targetRest = restaurants.find(r => r.id === cartRestaurantId);
    const deliveryAddress = options?.address || userProfile.savedAddresses[0];

    const newOrder = orderService.createOrder({
      userId: userProfile.id,
      userName: userProfile.name,
      userPhone: userProfile.phone,
      restaurantId: cartRestaurantId || 'rest-technopark-malabar-spices',
      restaurantName: cartRestaurantName || targetRest?.name || 'Quick Bite Partner Kitchen',
      restaurantAddress: targetRest?.address || `${locationZone.name}, Thiruvananthapuram`,
      items: cart,
      itemTotal: cartTotal,
      deliveryFee,
      taxesAndCharges: taxes,
      discount,
      couponCode: options?.couponCode || appliedPromo?.code,
      grandTotal,
      paymentMethod: options?.paymentMethod || 'upi',
      paymentStatus: 'paid',
      deliveryAddress,
      locationZone,
      notes: options?.notes
    });

    clearCart();
    setIsCartOpen(false);
    setActiveTrackingOrderId(newOrder.id);
    setActiveView('orders');
    showToast(`Order #${newOrder.id} placed successfully!`);

    return newOrder;
  };

  const placeOrder = async (options?: any) => {
    return createOrderFromCart(options);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, reason?: string) => {
    const updated = orderService.updateOrderStatus(orderId, newStatus, reason);
    if (updated) {
      showToast(`Order #${orderId} status changed to ${newStatus.toUpperCase()}`, 'info');
    }
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    const cancelled = orderService.cancelOrder(orderId, reason);
    if (cancelled) {
      showToast(`Order #${orderId} cancelled`, 'error');
    }
  };

  const updateRestaurant = (updated: Restaurant) => {
    setRestaurants(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  const addRestaurant = (newRest: Restaurant) => {
    setRestaurants(prev => [newRest, ...prev]);
    showToast(`Restaurant ${newRest.name} added!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedRestaurantId,
        setSelectedRestaurantId,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        activeOrderId: activeTrackingOrderId,
        setActiveOrderId: setActiveTrackingOrderId,
        accountSubTab,
        setAccountSubTab,
        locationZone,
        setLocationZone: handleSetLocationZone,
        allZones,
        userProfile,
        updateUserProfile,
        userPreferences,
        updateUserPreferences,
        restaurants,
        updateRestaurant,
        addRestaurant,
        cart,
        cartItems: cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartItemQuantity,
        clearCart,
        cartTotal,
        cartCount,
        cartRestaurantId,
        cartRestaurantName,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        favoriteRestaurantIds,
        favoriteItemIds,
        toggleFavoriteRestaurant,
        toggleFavoriteItem,
        orders,
        setOrders,
        createOrderFromCart,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        isCartOpen,
        setIsCartOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isSurpriseModalOpen,
        setIsSurpriseModalOpen,
        isMealBuilderOpen,
        setIsMealBuilderOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
