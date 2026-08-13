export interface CreateReviewRequest {
  orderId: string;
  rating: number;
  comment?: string;
}

export interface ReviewBuyer {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface ReviewOffer {
  _id: string;
  name: string;
  category: string;
  imageUrl: string | null;
}

export interface Review {
  _id: string;
  buyer: ReviewBuyer;
  seller: string;
  offer: ReviewOffer;
  order: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewResponse {
  message: string;
  review: Review;
}

export interface SellerReviewsResponse {
  message: string;
  reviewsCount: number;
  averageRating: number;
  reviews: Review[];
}