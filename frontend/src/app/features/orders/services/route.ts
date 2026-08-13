import {
  HttpBackend,
  HttpClient
} from '@angular/common/http';
import {
  inject,
  Injectable
} from '@angular/core';
import {
  map,
  Observable
} from 'rxjs';

interface RouteGeometry {
  type: 'LineString';
  coordinates: number[][];
}

interface OsrmRoute {
  distance: number;
  duration: number;
  geometry: RouteGeometry;
}

interface OsrmRouteResponse {
  code: string;
  routes: OsrmRoute[];
}

export interface RouteResult {
  distance: number;
  duration: number;
  coordinates: [number, number][];
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private readonly httpBackend = inject(HttpBackend);
  private readonly http = new HttpClient(this.httpBackend);

  private readonly routeUrl =
    'https://router.project-osrm.org/route/v1/driving';

  getRoute(
    startLatitude: number,
    startLongitude: number,
    destinationLatitude: number,
    destinationLongitude: number
  ): Observable<RouteResult> {
    const coordinates =
      `${startLongitude},${startLatitude};` +
      `${destinationLongitude},${destinationLatitude}`;

    const url =
      `${this.routeUrl}/${coordinates}` +
      '?overview=full&geometries=geojson&steps=false';

    return this.http.get<OsrmRouteResponse>(url).pipe(
      map(response => {
        const route = response.routes?.[0];

        if (
          response.code !== 'Ok' ||
          !route
        ) {
          throw new Error('Route not found.');
        }

        return {
          distance: route.distance,
          duration: route.duration,
          coordinates: route.geometry.coordinates.map(
            coordinate => [
              coordinate[1],
              coordinate[0]
            ] as [number, number]
          )
        };
      })
    );
  }
}