import { Order, OrderStatus, CartItem, Address, LocationZone, DeliveryPartner } from '../types';
import { INITIAL_USER_PROFILE } from '../constants/mockData';

export interface CreateOrderParams {
  userId?: string;
  userName?: string;
  userPhone?: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  taxesAndCharges: number;
  discount: number;
  couponCode?: string;
  grandTotal: number;
  paymentMethod: 'upi' | 'card' | 'cod' | 'quickbite_wallet';
  paymentStatus?: 'paid' | 'pending' | 'failed';
  deliveryAddress: Address;
  locationZone: LocationZone;
  notes?: string;
}

type OrderListener = (orders: Order[]) => void;

class OrderService {
  private static instance: OrderService;
  private orders: Order[] = [];
  private listeners: Set<OrderListener> = new Set();
  private storageKey = 'qb_central_orders_state';

  private constructor() {
    this.loadInitialOrders();
  }

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  private loadInitialOrders() {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          this.orders = JSON.parse(saved);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Default seeded demonstration orders in TVM corridors (Active + History)
    this.orders = [
      {
        id: 'QB-2026-1024',
        userId: INITIAL_USER_PROFILE.id,
        userName: INITIAL_USER_PROFILE.name,
        userPhone: INITIAL_USER_PROFILE.phone,
        restaurantId: 'rest-technopark-malabar-spices',
        restaurantName: 'Malabar Spices Kitchen',
        restaurantAddress: 'Technopark Main Road, Near Phase 1 Gate, Kazhakkoottam, Thiruvananthapuram',
        items: [
          {
            itemId: 'item-malabar-biryani',
            name: 'Thalassery Dum Biryani (Kaima Rice)',
            price: 260,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
            isVeg: false
          },
          {
            itemId: 'item-sulaimani-tea',
            name: 'Spiced Travancore Sulaimani',
            price: 45,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
            isVeg: true
          }
        ],
        itemTotal: 610,
        deliveryFee: 0,
        taxesAndCharges: 31,
        discount: 50,
        couponCode: 'QUICKBITE',
        grandTotal: 591,
        status: 'out_for_delivery',
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        deliveryAddress: INITIAL_USER_PROFILE.savedAddresses[0],
        estimatedDeliveryTime: '16 mins',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        timeline: [
          {
            status: 'placed',
            title: 'Order Placed (Demo Checkout)',
            description: 'Order registered and dispatched to partner kitchen',
            timestamp: '15 mins ago',
            completed: true
          },
          {
            status: 'accepted',
            title: 'Kitchen Accepted',
            description: 'Master Chef accepted ticket and queued items',
            timestamp: '12 mins ago',
            completed: true
          },
          {
            status: 'preparing',
            title: 'Cooking in Progress',
            description: 'Fresh Kaima rice and spices simmered to perfection',
            timestamp: '8 mins ago',
            completed: true
          },
          {
            status: 'ready',
            title: 'Packed & Ready',
            description: 'Sealed with tamper-evident thermal insulation bag',
            timestamp: '4 mins ago',
            completed: true
          },
          {
            status: 'out_for_delivery',
            title: 'Rider on the Way',
            description: 'Rider Vishnu K. (Eco Electric KL 01 CB 4421) traversing Technopark corridor',
            timestamp: 'Just now',
            completed: true
          },
          {
            status: 'delivered',
            title: 'Delivered at Doorstep',
            description: 'Delivered to Flat 4B, Silicon Heights',
            timestamp: 'Estimated in 8 mins',
            completed: false
          }
        ],
        deliveryPartner: {
          id: 'dp-tvm-01',
          name: 'Vishnu K.',
          phone: '+91 98471 88990',
          vehicleType: 'Hero Electric Flash EV',
          vehicleNumber: 'KL 01 CB 4421',
          rating: 4.9,
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          currentLat: 8.5583,
          currentLng: 76.8812
        }
      },
      {
        id: 'QB-2026-1019',
        userId: INITIAL_USER_PROFILE.id,
        userName: INITIAL_USER_PROFILE.name,
        userPhone: INITIAL_USER_PROFILE.phone,
        restaurantId: 'rest-kowdiar-artisan-cafe',
        restaurantName: 'The Kowdiar Roast & Brew',
        restaurantAddress: 'Kowdiar Main Avenue, Near Golf Club, Thiruvananthapuram',
        items: [
          {
            itemId: 'item-travancore-filter-coffee',
            name: 'Artisan Malabar Roast Pour-over',
            price: 160,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
            isVeg: true
          },
          {
            itemId: 'item-avocado-sourdough-toast',
            name: 'Wayanad Hass Avocado Sourdough',
            price: 290,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=600&auto=format&fit=crop&q=80',
            isVeg: true
          }
        ],
        itemTotal: 610,
        deliveryFee: 0,
        taxesAndCharges: 30,
        discount: 190,
        couponCode: 'WELCOME50',
        grandTotal: 450,
        status: 'delivered',
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        deliveryAddress: INITIAL_USER_PROFILE.savedAddresses[0],
        estimatedDeliveryTime: 'Delivered',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        timeline: [
          {
            status: 'placed',
            title: 'Order Placed',
            description: 'Order confirmed and paid via UPI',
            timestamp: '2 days ago',
            completed: true
          },
          {
            status: 'accepted',
            title: 'Kitchen Accepted',
            description: 'Barista began fresh coffee brew',
            timestamp: '2 days ago',
            completed: true
          },
          {
            status: 'preparing',
            title: 'Prepared Fresh',
            description: 'Sourdough toasted & plated',
            timestamp: '2 days ago',
            completed: true
          },
          {
            status: 'ready',
            title: 'Packed & Dispatched',
            description: 'Sealed for thermal freshness',
            timestamp: '2 days ago',
            completed: true
          },
          {
            status: 'out_for_delivery',
            title: 'Out for Delivery',
            description: 'Rider Rajesh on way',
            timestamp: '2 days ago',
            completed: true
          },
          {
            status: 'delivered',
            title: 'Delivered',
            description: 'Delivered safely at door',
            timestamp: '2 days ago',
            completed: true
          }
        ],
        deliveryPartner: {
          id: 'dp-tvm-02',
          name: 'Rajesh K.',
          phone: '+91 98471 22334',
          vehicleType: 'Eco Electric Scooter',
          vehicleNumber: 'KL 01 EF 8820',
          rating: 4.9,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          currentLat: 8.5281,
          currentLng: 76.9602
        }
      },
      {
        id: 'QB-2026-1012',
        userId: INITIAL_USER_PROFILE.id,
        userName: INITIAL_USER_PROFILE.name,
        userPhone: INITIAL_USER_PROFILE.phone,
        restaurantId: 'rest-palayam-authentic-kerala',
        restaurantName: 'Palayam Heritage Mess',
        restaurantAddress: 'MG Road, Palayam, Near University Stadium, Thiruvananthapuram',
        items: [
          {
            itemId: 'item-kerala-meals',
            name: 'Travancore Sadhya Special Box',
            price: 240,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80',
            isVeg: true
          },
          {
            itemId: 'item-payasam-bowl',
            name: 'Ada Pradhaman Bowl',
            price: 80,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
            isVeg: true
          }
        ],
        itemTotal: 320,
        deliveryFee: 0,
        taxesAndCharges: 16,
        discount: 16,
        grandTotal: 320,
        status: 'delivered',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        deliveryAddress: INITIAL_USER_PROFILE.savedAddresses[0],
        estimatedDeliveryTime: 'Delivered',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        timeline: [
          {
            status: 'placed',
            title: 'Order Placed',
            description: 'Paid via Card',
            timestamp: '5 days ago',
            completed: true
          },
          {
            status: 'delivered',
            title: 'Delivered',
            description: 'Delivered to reception',
            timestamp: '5 days ago',
            completed: true
          }
        ]
      }
    ];
    this.saveOrders();
  }

  private saveOrders() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.orders));
      }
    } catch {
      // Ignore storage quota
    }
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(fn => {
      try {
        fn([...this.orders]);
      } catch (err) {
        console.error('Order listener error:', err);
      }
    });
  }

  public subscribeToOrderUpdates(listener: OrderListener): () => void {
    this.listeners.add(listener);
    // Trigger initial emission
    listener([...this.orders]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getOrders(): Order[] {
    return [...this.orders];
  }

  public getOrder(orderId: string): Order | undefined {
    return this.orders.find(o => o.id === orderId);
  }

  public createOrder(params: CreateOrderParams): Order {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `QB-2026-${randomSuffix}`;

    const defaultPartner: DeliveryPartner = {
      id: `dp-tvm-${randomSuffix}`,
      name: 'Rajesh K.',
      phone: '+91 98471 22334',
      vehicleType: 'Eco Electric Scooter',
      vehicleNumber: 'KL 01 EF 8820',
      rating: 4.9,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      currentLat: params.locationZone.lat + 0.003,
      currentLng: params.locationZone.lng + 0.003
    };

    const newOrder: Order = {
      id: orderId,
      userId: params.userId || INITIAL_USER_PROFILE.id,
      userName: params.userName || INITIAL_USER_PROFILE.name,
      userPhone: params.userPhone || INITIAL_USER_PROFILE.phone,
      restaurantId: params.restaurantId,
      restaurantName: params.restaurantName,
      restaurantAddress: params.restaurantAddress,
      items: params.items.map(c => ({
        itemId: c.menuItem.id,
        name: c.menuItem.name,
        price: c.itemTotal / c.quantity,
        quantity: c.quantity,
        customizations: c.customizations,
        image: c.menuItem.image,
        isVeg: c.menuItem.isVeg
      })),
      itemTotal: params.itemTotal,
      deliveryFee: params.deliveryFee,
      taxesAndCharges: params.taxesAndCharges,
      discount: params.discount,
      couponCode: params.couponCode,
      grandTotal: params.grandTotal,
      status: 'placed',
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentStatus || 'paid',
      deliveryAddress: params.deliveryAddress,
      estimatedDeliveryTime: `${params.locationZone.avgDeliveryMin || 22} mins`,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'placed',
          title: 'Order Placed (Demo Order)',
          description: 'Payment deferred / Demo checkout verified without charge',
          timestamp: 'Just now',
          completed: true
        },
        {
          status: 'accepted',
          title: 'Restaurant Accepted',
          description: 'Kitchen partner verified order details & kitchen capacity',
          timestamp: 'Pending acceptance',
          completed: false
        },
        {
          status: 'preparing',
          title: 'Preparing Food',
          description: 'Fresh ingredients being cooked and packed',
          timestamp: 'Estimated in 6 mins',
          completed: false
        },
        {
          status: 'ready',
          title: 'Order Ready',
          description: 'Packed and verified in tamper-proof container',
          timestamp: 'Estimated in 12 mins',
          completed: false
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Delivery partner picked up parcel and is en route',
          timestamp: 'Estimated in 15 mins',
          completed: false
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Order safely delivered to destination in Thiruvananthapuram',
          timestamp: 'Estimated in 22 mins',
          completed: false
        }
      ],
      deliveryPartner: defaultPartner
    };

    this.orders = [newOrder, ...this.orders];
    this.saveOrders();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Order | null {
    const targetIdx = this.orders.findIndex(o => o.id === orderId);
    if (targetIdx < 0) return null;

    const order = this.orders[targetIdx];
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Canonical progression order
    const statusOrder: OrderStatus[] = [
      'placed',
      'accepted',
      'preparing',
      'ready',
      'out_for_delivery',
      'delivered'
    ];

    const currentRank = statusOrder.indexOf(newStatus);

    const updatedTimeline = order.timeline.map(step => {
      const stepRank = statusOrder.indexOf(step.status);
      if (newStatus === 'cancelled') {
        return step.status === 'cancelled'
          ? { ...step, completed: true, timestamp: `Cancelled at ${nowStr}` }
          : step;
      }

      if (stepRank <= currentRank && stepRank >= 0) {
        return {
          ...step,
          completed: true,
          timestamp: step.timestamp.includes('ago') || step.timestamp.includes('now') || step.timestamp.includes(':')
            ? step.timestamp
            : `Completed at ${nowStr}`
        };
      }
      return step;
    });

    const updatedOrder: Order = {
      ...order,
      status: newStatus,
      timeline: updatedTimeline
    };

    this.orders[targetIdx] = updatedOrder;
    this.saveOrders();
    return updatedOrder;
  }

  public cancelOrder(orderId: string, reason?: string): Order | null {
    return this.updateOrderStatus(orderId, 'cancelled', reason || 'Cancelled by user / store');
  }
}

export const orderService = OrderService.getInstance();
