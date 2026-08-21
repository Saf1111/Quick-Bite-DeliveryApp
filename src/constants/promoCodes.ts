export interface PromoCodeItem {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
}

export const PROMO_CODES: PromoCodeItem[] = [
  {
    code: 'QUICKBITE',
    discountType: 'percentage',
    discountValue: 50,
    maxDiscount: 100,
    minOrder: 150,
    description: '50% OFF up to ₹100 on your first Quick Bite order'
  },
  {
    code: 'FIRSTBITE',
    discountType: 'flat',
    discountValue: 75,
    maxDiscount: 75,
    minOrder: 199,
    description: 'Flat ₹75 OFF on your discovery meal'
  },
  {
    code: 'TVMFIT',
    discountType: 'percentage',
    discountValue: 20,
    maxDiscount: 120,
    minOrder: 250,
    description: '20% OFF on high-protein, salad & healthy choices'
  },
  {
    code: 'TECHNO200',
    discountType: 'flat',
    discountValue: 150,
    maxDiscount: 150,
    minOrder: 499,
    description: 'Flat ₹150 OFF on Technopark & Kazhakkoottam campus group orders'
  }
];

export const PROMO_COUPONS = PROMO_CODES;
