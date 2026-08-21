import { Order, OrderStatus, Address, DeliveryPartner } from '../types';
import { orderService } from './orderService';

export interface DeliveryTripItem {
  id: string;
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  customerName: string;
  customerPhone: string;
  customerAddress: Address;
  itemsSummary: string;
  itemCount: number;
  grandTotal: number;
  payoutAmount: number;
  pickupDistanceKm: number;
  deliveryDistanceKm: number;
  estimatedTotalMinutes: number;
  specialInstructions?: string;
  status: 'available' | 'assigned' | 'at_pickup' | 'picked_up' | 'delivered' | 'cancelled';
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  paymentMethod: string;
}

export interface RiderProfile {
  id: string;
  name: string;
  phone: string;
  photo: string;
  vehicleType: string;
  vehicleNumber: string;
  rating: number;
  ratingCount: number;
  isOnline: boolean;
  currentZone: string;
  todayDeliveries: number;
  todayEarnings: number;
  totalDistanceKm: number;
  acceptanceRate: number;
  onTimeRate: number;
  walletBalance: number;
}

type DeliveryListener = () => void;

class DeliveryService {
  private static instance: DeliveryService;
  private storageKey = 'qb_central_delivery_state';
  private listeners: Set<DeliveryListener> = new Set();

  private profile: RiderProfile = {
    id: 'dp-tvm-01',
    name: 'Rajesh K.',
    phone: '+91 98471 22334',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    vehicleType: 'Hero Electric Flash EV',
    vehicleNumber: 'KL 01 EF 8820',
    rating: 4.9,
    ratingCount: 342,
    isOnline: true,
    currentZone: 'Technopark Corridor',
    todayDeliveries: 7,
    todayEarnings: 540,
    totalDistanceKm: 28.4,
    acceptanceRate: 98,
    onTimeRate: 99.2,
    walletBalance: 1840
  };

  private activeTrip: DeliveryTripItem | null = null;
  private tripHistory: DeliveryTripItem[] = [];

  private constructor() {
    this.loadState();

    // Subscribe to OrderService changes to keep trips in sync
    orderService.subscribeToOrderUpdates(orders => {
      this.syncWithOrders(orders);
    });
  }

  public static getInstance(): DeliveryService {
    if (!DeliveryService.instance) {
      DeliveryService.instance = new DeliveryService();
    }
    return DeliveryService.instance;
  }

  private loadState() {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.profile) this.profile = parsed.profile;
          if (parsed.activeTrip) this.activeTrip = parsed.activeTrip;
          if (parsed.tripHistory) this.tripHistory = parsed.tripHistory;
          return;
        }
      }
    } catch {}

    // Seed default trip history for realistic demo experience
    this.tripHistory = [
      {
        id: 'trip-demo-1',
        orderId: 'QB-2026-9042',
        restaurantId: 'rest-technopark-malabar-spices',
        restaurantName: 'Malabar Spices Kitchen',
        restaurantAddress: 'Technopark Main Road, Kazhakkoottam',
        restaurantPhone: '+91 471 2419870',
        customerName: 'Ananya Nair',
        customerPhone: '+91 94471 90234',
        customerAddress: {
          id: 'addr-demo-1',
          label: 'Work',
          street: 'Amstor Building, Technopark Phase 1',
          area: 'Kazhakkoottam',
          district: 'Thiruvananthapuram',
          lat: 8.558,
          lng: 76.881
        },
        itemsSummary: '2x Thalassery Dum Biryani, 1x Mint Lime',
        itemCount: 3,
        grandTotal: 580,
        payoutAmount: 75,
        pickupDistanceKm: 1.2,
        deliveryDistanceKm: 2.4,
        estimatedTotalMinutes: 18,
        status: 'delivered',
        deliveredAt: '1 hour ago',
        paymentMethod: 'UPI'
      },
      {
        id: 'trip-demo-2',
        orderId: 'QB-2026-8812',
        restaurantId: 'rest-kowdiar-coastal-curry',
        restaurantName: 'Coastal Curry Bistro',
        restaurantAddress: 'Golf Links Road, Kowdiar',
        restaurantPhone: '+91 471 2314567',
        customerName: 'Rahul Varma',
        customerPhone: '+91 98460 11223',
        customerAddress: {
          id: 'addr-demo-2',
          label: 'Home',
          street: 'Villa 7, Kowdiar Gardens',
          area: 'Kowdiar',
          district: 'Thiruvananthapuram',
          lat: 8.528,
          lng: 76.96
        },
        itemsSummary: '1x Travancore Fish Curry, 2x Appam',
        itemCount: 3,
        grandTotal: 420,
        payoutAmount: 65,
        pickupDistanceKm: 0.8,
        deliveryDistanceKm: 1.6,
        estimatedTotalMinutes: 15,
        status: 'delivered',
        deliveredAt: '3 hours ago',
        paymentMethod: 'Prepaid'
      }
    ];
    this.saveState();
  }

  private saveState() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          this.storageKey,
          JSON.stringify({
            profile: this.profile,
            activeTrip: this.activeTrip,
            tripHistory: this.tripHistory
          })
        );
      }
    } catch {}
    this.notify();
  }

  private notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Delivery listener error:', err);
      }
    });
  }

  public subscribe(listener: DeliveryListener): () => void {
    this.listeners.add(listener);
    listener();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private syncWithOrders(orders: Order[]) {
    // If active trip's order was modified externally
    if (this.activeTrip) {
      const liveOrder = orders.find(o => o.id === this.activeTrip?.orderId);
      if (liveOrder) {
        if (liveOrder.status === 'delivered' && this.activeTrip.status !== 'delivered') {
          this.activeTrip.status = 'delivered';
          this.archiveActiveTrip();
        } else if (liveOrder.status === 'cancelled') {
          this.activeTrip = null;
          this.saveState();
        }
      }
    }
  }

  public getProfile(): RiderProfile {
    return { ...this.profile };
  }

  public toggleOnlineStatus(): boolean {
    this.profile.isOnline = !this.profile.isOnline;
    this.saveState();
    return this.profile.isOnline;
  }

  public getActiveTrip(): DeliveryTripItem | null {
    return this.activeTrip;
  }

  public getTripHistory(): DeliveryTripItem[] {
    return [...this.tripHistory];
  }

  /**
   * Returns list of orders available for rider dispatch
   * (Orders that are placed, preparing, or marked ready)
   */
  public getAvailableTrips(): DeliveryTripItem[] {
    if (!this.profile.isOnline) return [];

    const allOrders = orderService.getOrders();
    const activeOrderId = this.activeTrip?.orderId;

    // Filter orders ready or actively cooking that are not yet delivered/cancelled
    const eligibleOrders = allOrders.filter(
      o =>
        o.id !== activeOrderId &&
        (o.status === 'ready' || o.status === 'preparing' || o.status === 'accepted')
    );

    return eligibleOrders.map(o => {
      const itemsCount = o.items.reduce((sum, i) => sum + i.quantity, 0);
      const itemsSummary = o.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
      const payout = Math.round(50 + (o.grandTotal > 500 ? 30 : 15));

      return {
        id: `trip-${o.id}`,
        orderId: o.id,
        restaurantId: o.restaurantId,
        restaurantName: o.restaurantName,
        restaurantAddress: o.restaurantAddress,
        restaurantPhone: '+91 471 2789100',
        customerName: o.userName,
        customerPhone: o.userPhone || '+91 98471 00000',
        customerAddress: o.deliveryAddress,
        itemsSummary,
        itemCount: itemsCount,
        grandTotal: o.grandTotal,
        payoutAmount: payout,
        pickupDistanceKm: 1.4,
        deliveryDistanceKm: 3.2,
        estimatedTotalMinutes: 20,
        specialInstructions: o.deliveryAddress.landmark ? `Landmark: ${o.deliveryAddress.landmark}` : undefined,
        status: 'available',
        paymentMethod: o.paymentMethod.toUpperCase()
      };
    });
  }

  /**
   * Rider accepts an order trip
   */
  public acceptTrip(orderId: string): boolean {
    const order = orderService.getOrder(orderId);
    if (!order) return false;

    const itemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
    const itemsSummary = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
    const payout = Math.round(50 + (order.grandTotal > 500 ? 30 : 15));

    this.activeTrip = {
      id: `trip-${order.id}`,
      orderId: order.id,
      restaurantId: order.restaurantId,
      restaurantName: order.restaurantName,
      restaurantAddress: order.restaurantAddress,
      restaurantPhone: '+91 471 2789100',
      customerName: order.userName,
      customerPhone: order.userPhone || '+91 98471 00000',
      customerAddress: order.deliveryAddress,
      itemsSummary,
      itemCount: itemsCount,
      grandTotal: order.grandTotal,
      payoutAmount: payout,
      pickupDistanceKm: 1.2,
      deliveryDistanceKm: 3.0,
      estimatedTotalMinutes: 18,
      specialInstructions: order.deliveryAddress.landmark ? `Landmark: ${order.deliveryAddress.landmark}` : undefined,
      status: 'assigned',
      acceptedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: order.paymentMethod.toUpperCase()
    };

    // Update order with rider information
    const partnerInfo: DeliveryPartner = {
      id: this.profile.id,
      name: this.profile.name,
      phone: this.profile.phone,
      vehicleType: this.profile.vehicleType,
      vehicleNumber: this.profile.vehicleNumber,
      rating: this.profile.rating,
      photo: this.profile.photo,
      currentLat: order.deliveryAddress.lat + 0.002,
      currentLng: order.deliveryAddress.lng + 0.002
    };

    // If order was in 'ready' state or earlier, keep synchronized
    this.saveState();
    return true;
  }

  /**
   * Rider arrives at the partner kitchen
   */
  public markArrivedAtPickup(): boolean {
    if (!this.activeTrip) return false;
    this.activeTrip.status = 'at_pickup';
    this.saveState();
    return true;
  }

  /**
   * Rider collects food and departs kitchen
   */
  public markPickedUp(): boolean {
    if (!this.activeTrip) return false;

    this.activeTrip.status = 'picked_up';
    this.activeTrip.pickedUpAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Advance order lifecycle in central OrderService
    orderService.updateOrderStatus(this.activeTrip.orderId, 'out_for_delivery', 'Rider Rajesh K. picked up order & en route');
    this.saveState();
    return true;
  }

  /**
   * Rider hands order to customer and completes delivery
   */
  public markDelivered(): boolean {
    if (!this.activeTrip) return false;

    const orderId = this.activeTrip.orderId;
    const payout = this.activeTrip.payoutAmount;

    this.activeTrip.status = 'delivered';
    this.activeTrip.deliveredAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Advance order lifecycle in central OrderService
    orderService.updateOrderStatus(orderId, 'delivered', 'Order successfully handed over to customer');

    // Credit rider wallet & statistics
    this.profile.todayDeliveries += 1;
    this.profile.todayEarnings += payout;
    this.profile.walletBalance += payout;
    this.profile.totalDistanceKm += Number((this.activeTrip.pickupDistanceKm + this.activeTrip.deliveryDistanceKm).toFixed(1));

    this.archiveActiveTrip();
    return true;
  }

  private archiveActiveTrip() {
    if (this.activeTrip) {
      this.tripHistory = [this.activeTrip, ...this.tripHistory];
      this.activeTrip = null;
      this.saveState();
    }
  }
}

export const deliveryService = DeliveryService.getInstance();
