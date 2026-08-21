import { LocationZone, Restaurant, Address } from '../types';
import { TVM_DISTRICT_ZONES } from '../constants/locations';
import { INITIAL_RESTAURANTS } from '../constants/mockData';

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  title: string;
  lat: number;
  lng: number;
  isPartner: boolean;
  rating: number;
  cuisine: string;
  area: string;
  isOpen: boolean;
  avgDeliveryMin: number;
  priceForTwo: number;
  restaurantId: string;
}

export interface PlaceSearchResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  isPartner: boolean;
  type: 'restaurant' | 'landmark' | 'zone';
}

// Calculate Haversine distance in kilometers between two geo-points
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// Transform restaurants into uniform map marker entities
export function createMapMarkersFromRestaurants(restaurants: Restaurant[]): MapMarker[] {
  return restaurants.map(r => ({
    id: `marker-${r.id}`,
    title: r.name,
    lat: r.lat,
    lng: r.lng,
    isPartner: r.isPartner,
    rating: r.rating,
    cuisine: r.cuisines.slice(0, 2).join(', '),
    area: r.area,
    isOpen: r.isOpen,
    avgDeliveryMin: r.avgDeliveryTimeMin,
    priceForTwo: r.priceForTwo,
    restaurantId: r.id
  }));
}

// Map Provider Abstraction Layer
export interface MapProviderConfig {
  provider: 'google_maps' | 'interactive_vector_engine';
  apiKey?: string;
  center: MapCoordinates;
  zoom: number;
}

export class MapService {
  private static instance: MapService;
  private config: MapProviderConfig;
  private isInitialized = false;

  private constructor() {
    const envKey = (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_GOOGLE_MAPS_API_KEY) || '';
    this.config = {
      provider: envKey ? 'google_maps' : 'interactive_vector_engine',
      apiKey: envKey || undefined,
      center: { lat: 8.5241, lng: 76.9366 }, // Thiruvananthapuram center
      zoom: 12
    };
  }

  public static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  public async initializeMap(containerElement?: HTMLElement): Promise<boolean> {
    this.isInitialized = true;
    return true;
  }

  public getMapConfig(): MapProviderConfig {
    return this.config;
  }

  public async searchPlaces(query: string): Promise<PlaceSearchResult[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const results: PlaceSearchResult[] = [];

    // Search TVM District Zones
    TVM_DISTRICT_ZONES.forEach(z => {
      if (z.name.toLowerCase().includes(q) || z.tagline.toLowerCase().includes(q)) {
        results.push({
          id: `zone-${z.id}`,
          name: z.name,
          address: `${z.name}, Thiruvananthapuram District`,
          lat: z.lat,
          lng: z.lng,
          isPartner: true,
          type: 'zone'
        });
      }
    });

    // Search Restaurants
    INITIAL_RESTAURANTS.forEach(r => {
      if (
        r.name.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.cuisines.some(c => c.toLowerCase().includes(q))
      ) {
        results.push({
          id: r.id,
          name: r.name,
          address: r.address,
          lat: r.lat,
          lng: r.lng,
          isPartner: r.isPartner,
          type: 'restaurant'
        });
      }
    });

    return results;
  }

  public async searchRestaurants(query: string, filter?: 'all' | 'partner' | 'nearby'): Promise<Restaurant[]> {
    let list = [...INITIAL_RESTAURANTS];
    if (filter === 'partner') list = list.filter(r => r.isPartner);
    if (filter === 'nearby') list = list.filter(r => !r.isPartner);

    if (!query.trim()) return list;
    const q = query.toLowerCase();

    return list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.area.toLowerCase().includes(q) ||
      r.cuisines.some(c => c.toLowerCase().includes(q)) ||
      r.menu.some(m => m.name.toLowerCase().includes(q))
    );
  }

  public async getPlaceDetails(placeId: string): Promise<Restaurant | PlaceSearchResult | null> {
    const foundRest = INITIAL_RESTAURANTS.find(r => r.id === placeId);
    if (foundRest) return foundRest;

    const foundZone = TVM_DISTRICT_ZONES.find(z => z.id === placeId || `zone-${z.id}` === placeId);
    if (foundZone) {
      return {
        id: `zone-${foundZone.id}`,
        name: foundZone.name,
        address: `${foundZone.name}, Thiruvananthapuram District`,
        lat: foundZone.lat,
        lng: foundZone.lng,
        isPartner: true,
        type: 'zone'
      };
    }

    return null;
  }

  public async geocode(address: string): Promise<MapCoordinates> {
    const q = address.toLowerCase();
    const zoneMatch = TVM_DISTRICT_ZONES.find(z => q.includes(z.name.toLowerCase()));
    if (zoneMatch) {
      return { lat: zoneMatch.lat, lng: zoneMatch.lng };
    }
    return { lat: 8.5241, lng: 76.9366 }; // Default TVM district center
  }

  public async reverseGeocode(lat: number, lng: number): Promise<string> {
    const nearestZone = this.findNearestZone(lat, lng, TVM_DISTRICT_ZONES);
    return `${nearestZone.name}, Thiruvananthapuram, Kerala 695001`;
  }

  public calculateDistance(from: MapCoordinates, to: MapCoordinates): number {
    return calculateDistanceKm(from.lat, from.lng, to.lat, to.lng);
  }

  public findNearestZone(lat: number, lng: number, zones: LocationZone[] = TVM_DISTRICT_ZONES): LocationZone {
    let minDistance = Infinity;
    let nearest = zones[0];

    zones.forEach(zone => {
      const dist = calculateDistanceKm(lat, lng, zone.lat, zone.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = zone;
      }
    });

    return nearest;
  }
}

export const mapService = MapService.getInstance();
