export interface City {
  id: string;
  name: string;
  slug: string;
}

export interface Address {
  street: string | null;
  streetNumber: string | null;
  additionalInfo: string | null;
}

export interface CitiesResponse {
  message: string;
  cities: City[];
}

export interface UpdateLocationRequest {
  cityId: string;
  street: string;
  streetNumber: string;
  additionalInfo?: string;
}