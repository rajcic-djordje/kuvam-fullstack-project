export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'ready'
  | 'completed'
  | 'cancelled';


export interface CreateOrderItemRequest {
  offerId: string;
  quantity: number;
}


export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
  buyerNote?: string;
}


export interface OrderOffer {
  _id: string;
  name: string;
  category: string;
  imageUrl: string | null;
  unit: string;
}


export interface OrderItem {
  offer: OrderOffer | string;
  name: string;
  category: string;
  imageUrl: string | null;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}


export interface OrderCity {
  _id: string;
  name: string;
  slug: string;
}


export interface PickupAddress {
  street: string | null;
  streetNumber: string | null;
  additionalInfo: string | null;
  latitude: number;
  longitude: number;
}


export interface OrderSeller {
  _id: string;
  businessName: string;
  description?: string;
  city?: OrderCity | null;
  pickupAddress?: PickupAddress | null;
}


export interface OrderBuyer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}


export interface BuyerOrder {
  _id: string;
  buyer: string;
  seller: OrderSeller;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  buyerNote: string;
  rejectionReason: string | null;
  estimatedPickupAt: string | null;
  createdAt: string;
  updatedAt: string;
  buyerOnTheWayAt: string | null;
  pickupCode?: string;
}


export interface SellerOrder {
  _id: string;
  buyer: OrderBuyer;
  seller: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  buyerNote: string;
  rejectionReason: string | null;
  estimatedPickupAt: string | null;
  createdAt: string;
  updatedAt: string;
  buyerOnTheWayAt: string | null;
}


export interface CreatedOrder {
  _id: string;
  buyer: string;
  seller: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  buyerNote: string;
  rejectionReason: string | null;
  estimatedPickupAt: string | null;
  createdAt: string;
  updatedAt: string;
  buyerOnTheWayAt: string | null;
}


export interface CreateOrderResponse {
  message: string;
  order: CreatedOrder;
}


export interface BuyerOrdersResponse {
  message: string;
  orders: BuyerOrder[];
}


export interface SellerOrdersResponse {
  message: string;
  orders: SellerOrder[];
}


export interface BuyerOrderActionResponse {
  message: string;
  order: BuyerOrder;
}


export interface SellerOrderActionResponse {
  message: string;
  order: SellerOrder;
}


export interface BuyerOrderResponse {
  message: string;
  order: BuyerOrder;
}


export interface AcceptOrderRequest {
  estimatedPickupAt: string;
}


export interface RejectOrderRequest {
  rejectionReason: string;
}


export interface CompleteOrderRequest {
  pickupCode: string;
}