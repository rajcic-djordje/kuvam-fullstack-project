import { City } from '../../location/models/location';

export type OfferCategory =
  | 'cooked_meals'
  | 'soups_and_stews'
  | 'grilled_and_roasted'
  | 'bakery_and_pies'
  | 'desserts'
  | 'salads_and_sides'
  | 'preserved_food'
  | 'breakfast_and_snacks'
  | 'drinks'
  | 'other';

export type OfferCategoryFilter =
  | 'all'
  | OfferCategory;

export interface SellerOfferPreview {
  id: string;
  name: string;
  description: string;
  category: OfferCategory;
  price: number;
  availableQuantity: number;
  unit: string;
  imageUrl: string | null;
}

export interface PublicSeller {
  id: string;
  businessName: string;
  slug: string;
  description: string;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  city: City;
  offers: SellerOfferPreview[];
}

export interface SellersResponse {
  message: string;
  sellers: PublicSeller[];
}

export interface SellerFilters {
  search?: string;
  category?: OfferCategory;
}

export interface CategoryOption {
  value: OfferCategoryFilter;
  label: string;
}