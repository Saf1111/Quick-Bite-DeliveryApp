import { LocationZone } from '../types';

export const TVM_DISTRICT_ZONES: LocationZone[] = [
  {
    id: 'technopark',
    name: 'Technopark & Kazhakkoottam',
    tagline: 'IT Corridor & Tech Parks (Phase 1, 2, 3)',
    district: 'Thiruvananthapuram',
    lat: 8.5582,
    lng: 76.8812,
    radiusKm: 7.5,
    avgDeliveryMin: 22,
    activeRestaurantsCount: 48
  },
  {
    id: 'kowdiar',
    name: 'Kowdiar & Vellayambalam',
    tagline: 'Heritage, Cafes & Fine Dining Hub',
    district: 'Thiruvananthapuram',
    lat: 8.5241,
    lng: 76.9582,
    radiusKm: 6.0,
    avgDeliveryMin: 20,
    activeRestaurantsCount: 52
  },
  {
    id: 'palayam',
    name: 'Palayam & Central TVM',
    tagline: 'University, Secretariat & Urban Heart',
    district: 'Thiruvananthapuram',
    lat: 8.5061,
    lng: 76.9525,
    radiusKm: 5.5,
    avgDeliveryMin: 18,
    activeRestaurantsCount: 64
  },
  {
    id: 'vazhuthacaud',
    name: 'Vazhuthacaud & Cotton Hill',
    tagline: 'Cultural District & Bakery Avenue',
    district: 'Thiruvananthapuram',
    lat: 8.4983,
    lng: 76.9637,
    radiusKm: 4.5,
    avgDeliveryMin: 19,
    activeRestaurantsCount: 41
  },
  {
    id: 'pattom',
    name: 'Pattom & Kesavadasapuram',
    tagline: 'Bustling Junction & Traditional Eateries',
    district: 'Thiruvananthapuram',
    lat: 8.5284,
    lng: 76.9429,
    radiusKm: 5.0,
    avgDeliveryMin: 21,
    activeRestaurantsCount: 39
  },
  {
    id: 'sreekaryam',
    name: 'Sreekaryam & Ulloor',
    tagline: 'College of Engineering (CET) & Medical College Belt',
    district: 'Thiruvananthapuram',
    lat: 8.5471,
    lng: 76.9168,
    radiusKm: 6.0,
    avgDeliveryMin: 23,
    activeRestaurantsCount: 35
  },
  {
    id: 'thampanoor',
    name: 'Thampanoor & Overbridge',
    tagline: 'Central Railway Station & Transit Gateway',
    district: 'Thiruvananthapuram',
    lat: 8.4875,
    lng: 76.9515,
    radiusKm: 4.5,
    avgDeliveryMin: 17,
    activeRestaurantsCount: 55
  },
  {
    id: 'peroorkada',
    name: 'Peroorkada & Ambalamukku',
    tagline: 'Residential Enclaves & Authentic Kerala Grills',
    district: 'Thiruvananthapuram',
    lat: 8.5358,
    lng: 76.9744,
    radiusKm: 5.5,
    avgDeliveryMin: 24,
    activeRestaurantsCount: 29
  },
  {
    id: 'kovalam',
    name: 'Kovalam & Vizhinjam Port',
    tagline: 'Coastal Sea Breeze, Seafood & Tourist Belt',
    district: 'Thiruvananthapuram',
    lat: 8.4004,
    lng: 76.9787,
    radiusKm: 9.0,
    avgDeliveryMin: 28,
    activeRestaurantsCount: 24
  },
  {
    id: 'attingal',
    name: 'Attingal & Chirayinkeezhu',
    tagline: 'North District Commercial & Historic Hub',
    district: 'Thiruvananthapuram',
    lat: 8.6965,
    lng: 76.8142,
    radiusKm: 8.5,
    avgDeliveryMin: 27,
    activeRestaurantsCount: 22
  },
  {
    id: 'varkala',
    name: 'Varkala Cliff & Helipad',
    tagline: 'Boho Beach Cafes & Global Cuisines',
    district: 'Thiruvananthapuram',
    lat: 8.7379,
    lng: 76.7163,
    radiusKm: 7.0,
    avgDeliveryMin: 25,
    activeRestaurantsCount: 31
  },
  {
    id: 'neyyattinkara',
    name: 'Neyyattinkara & Balaramapuram',
    tagline: 'Southern Handloom Capital & Street Food',
    district: 'Thiruvananthapuram',
    lat: 8.4011,
    lng: 77.0858,
    radiusKm: 8.0,
    avgDeliveryMin: 26,
    activeRestaurantsCount: 20
  },
  {
    id: 'nedumangad',
    name: 'Nedumangad & Vembayam',
    tagline: 'Foothill Spice Town & Traditional Sadhya Spots',
    district: 'Thiruvananthapuram',
    lat: 8.6041,
    lng: 77.0019,
    radiusKm: 9.0,
    avgDeliveryMin: 30,
    activeRestaurantsCount: 18
  },
  {
    id: 'kattakada',
    name: 'Kattakada & Malayinkeezhu',
    tagline: 'Highland Gateway & Country Kitchens',
    district: 'Thiruvananthapuram',
    lat: 8.5086,
    lng: 77.0789,
    radiusKm: 8.5,
    avgDeliveryMin: 29,
    activeRestaurantsCount: 16
  }
];

export const DEFAULT_LOCATION: LocationZone = TVM_DISTRICT_ZONES[0]; // Technopark default
