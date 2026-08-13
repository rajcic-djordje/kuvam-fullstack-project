export interface OfferCity {
  _id: string;
  name: string;
  slug: string;
}

export interface OfferSeller {
  _id: string;
  businessName: string;
  slug: string | null;
  description: string;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  city: OfferCity | null;
  approvalStatus: string;
}

export interface Offer {
  _id: string;
  seller: OfferSeller;
  name: string;
  description: string;
  category: string;
  price: number;
  availableQuantity: number;
  unit: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SellerOffer {
  _id: string;
  seller: string;
  name: string;
  description: string;
  category: string;
  price: number;
  availableQuantity: number;
  unit: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfferRequest {
  name: string;
  description: string;
  category: string;
  price: number;
  availableQuantity: number;
  unit: string;
  imageUrl?: string;
}

export interface UpdateOfferRequest {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  availableQuantity?: number;
  unit?: string;
  imageUrl?: string | null;
}

export interface OffersResponse {
  message: string;
  offers: Offer[];
}

export interface OfferResponse {
  message: string;
  offer: Offer;
}

export interface SellerOffersResponse {
  message: string;
  offers: SellerOffer[];
}

export interface SellerOfferResponse {
  message: string;
  offer: SellerOffer;
}

export interface DeleteOfferResponse {
  message: string;
}