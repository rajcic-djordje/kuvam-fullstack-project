export interface OfferSeller {
  _id: string;
  businessName: string;
  description: string;
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