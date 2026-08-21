import { Restaurant, MenuItem, Order, UserProfile, UserPreferences, LocationZone } from '../types';
import { INITIAL_RESTAURANTS, INITIAL_USER_PROFILE } from '../constants/mockData';
import { TVM_DISTRICT_ZONES } from '../constants/locations';

const API_BASE = '/api';

export class ApiService {
  // --- Restaurants ---
  static async getRestaurants(zoneId?: string, cuisine?: string, tag?: string): Promise<Restaurant[]> {
    try {
      const params = new URLSearchParams();
      if (zoneId) params.append('zone', zoneId);
      if (cuisine) params.append('cuisine', cuisine);
      if (tag) params.append('tag', tag);
      
      const res = await fetch(`${API_BASE}/restaurants?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) return data.data;
      }
    } catch {
      // Fallback
    }
    return INITIAL_RESTAURANTS;
  }

  static async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      const res = await fetch(`${API_BASE}/restaurants/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Fallback
    }
    return INITIAL_RESTAURANTS.find(r => r.id === id) || null;
  }

  static async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      const res = await fetch(`${API_BASE}/menu-items`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Fallback
    }
    const allItems: MenuItem[] = [];
    INITIAL_RESTAURANTS.forEach(r => {
      if (r.menu) allItems.push(...r.menu);
    });
    return allItems;
  }

  // --- Locations ---
  static async getZones(): Promise<LocationZone[]> {
    try {
      const res = await fetch(`${API_BASE}/locations/zones`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Fallback
    }
    return TVM_DISTRICT_ZONES;
  }

  // --- User / Preferences ---
  static async getUserProfile(): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/user/profile`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Fallback
    }
    return INITIAL_USER_PROFILE;
  }

  static async updatePreferences(prefs: UserPreferences): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/user/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- Orders ---
  static async createOrder(orderPayload: Partial<Order>): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Fallback
    }
    
    // Client fallback generation
    const newOrder: Order = {
      id: `QB-TVM-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: orderPayload.userId || 'user-demo-tvm',
      userName: orderPayload.userName || 'Alex Thomas',
      userPhone: orderPayload.userPhone || '+91 98470 12345',
      restaurantId: orderPayload.restaurantId || '',
      restaurantName: orderPayload.restaurantName || 'Quick Bite Partner',
      restaurantAddress: orderPayload.restaurantAddress || 'Thiruvananthapuram',
      items: orderPayload.items || [],
      itemTotal: orderPayload.itemTotal || 0,
      deliveryFee: orderPayload.deliveryFee || 25,
      taxesAndCharges: orderPayload.taxesAndCharges || 15,
      discount: orderPayload.discount || 0,
      couponCode: orderPayload.couponCode,
      grandTotal: orderPayload.grandTotal || 0,
      status: 'placed',
      paymentMethod: orderPayload.paymentMethod || 'upi',
      paymentStatus: 'paid',
      deliveryAddress: orderPayload.deliveryAddress || INITIAL_USER_PROFILE.savedAddresses[0],
      estimatedDeliveryTime: `${20 + Math.floor(Math.random() * 10)} mins`,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'placed',
          title: 'Order Placed with Quick Bite',
          description: 'Payment verified & order transmitted to kitchen',
          timestamp: 'Just now',
          completed: true
        },
        {
          status: 'accepted',
          title: 'Restaurant Accepted',
          description: 'Chef acknowledged order and started preparation',
          timestamp: 'In 2 mins',
          completed: false
        },
        {
          status: 'preparing',
          title: 'Cooking in Progress',
          description: 'Fresh ingredients being assembled to your specifications',
          timestamp: 'In 6 mins',
          completed: false
        },
        {
          status: 'out_for_delivery',
          title: 'Delivery Partner Assigned',
          description: 'Rider Rajesh K. (Hero Electric Flash) on the way',
          timestamp: 'In 14 mins',
          completed: false
        },
        {
          status: 'delivered',
          title: 'Delivered at your Doorstep',
          description: 'Enjoy your hot Quick Bite!',
          timestamp: 'In 22 mins',
          completed: false
        }
      ],
      deliveryPartner: {
        id: 'dp-1',
        name: 'Rajesh K.',
        phone: '+91 98471 88990',
        vehicleType: 'Hero Electric Flash (Eco Express)',
        vehicleNumber: 'KL 01 CB 4421',
        rating: 4.9,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        currentLat: 8.5520,
        currentLng: 76.8850
      }
    };

    return newOrder;
  }

  static async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Fallback
    }
    return [];
  }
}
