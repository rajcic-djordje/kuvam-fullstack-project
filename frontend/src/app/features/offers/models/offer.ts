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

export interface OffersResponse {
  message: string;
  offers: Offer[];
}