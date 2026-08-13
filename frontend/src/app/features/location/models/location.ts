export interface City {
  id: string;
  name: string;
  slug: string;
}

export interface Address {
  street: string | null;
  streetNumber: string | null;
  additionalInfo: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
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