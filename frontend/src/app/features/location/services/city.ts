import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import { CitiesResponse } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private readonly http = inject(HttpClient);
  private readonly citiesUrl = `${API_BASE_URL}/cities`;

  getCities(): Observable<CitiesResponse> {
    return this.http.get<CitiesResponse>(this.citiesUrl);
  }
}