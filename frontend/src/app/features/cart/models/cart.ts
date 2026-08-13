export interface CartSeller {
  id: string;
  businessName: string;
}

export interface CartItem {
  offerId: string;
  name: string;
  imageUrl: string | null;
  unit: string;
  unitPrice: number;
  quantity: number;
  availableQuantity: number;
}

export interface CartState {
  seller: CartSeller | null;
  items: CartItem[];
}