import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  ViewChild,
  signal
} from '@angular/core';
import * as L from 'leaflet';
import { PickupAddress } from '../../orders/models/order'
import { RouteService } from '../../orders/services/route';

@Component({
  selector: 'app-order-route-map',
  imports: [],
  templateUrl: './order-route-map.html',
  styleUrl: './order-route-map.css'
})
export class OrderRouteMap implements AfterViewInit, OnDestroy {
  private readonly routeService = inject(RouteService);

  @ViewChild('mapContainer')
  private mapContainer?: ElementRef<HTMLDivElement>;

  @Input({ required: true })
  pickupAddress!: PickupAddress;

  readonly isLoadingRoute = signal(false);
  readonly routeError = signal('');
  readonly routeDistance = signal<number | null>(null);
  readonly routeDuration = signal<number | null>(null);

  private map?: L.Map;
  private sellerMarker?: L.Marker;
  private buyerMarker?: L.Marker;
  private routeLine?: L.Polyline;

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  showRoute(): void {
    this.routeError.set('');
    this.routeDistance.set(null);
    this.routeDuration.set(null);

    if (!navigator.geolocation) {
      this.routeError.set(
        'Tvoj browser ne podržava određivanje trenutne lokacije.'
      );
      return;
    }

    this.isLoadingRoute.set(true);

    navigator.geolocation.getCurrentPosition(
      position => {
        this.loadRoute(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      error => {
        this.isLoadingRoute.set(false);
        this.handleGeolocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  }

  formatDistance(distance: number): string {
    if (distance < 1000) {
      return `${Math.round(distance)} m`;
    }

    return `${(distance / 1000).toFixed(1)} km`;
  }

  formatDuration(duration: number): string {
    const minutes = Math.max(1, Math.round(duration / 60));

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} h`;
    }

    return `${hours} h ${remainingMinutes} min`;
  }

  private initializeMap(): void {
    if (
      !this.mapContainer ||
      !this.hasValidPickupCoordinates()
    ) {
      return;
    }

    const sellerCoordinates: L.LatLngExpression = [
      this.pickupAddress.latitude,
      this.pickupAddress.longitude
    ];

    this.map = L.map(
      this.mapContainer.nativeElement,
      {
        scrollWheelZoom: false
      }
    ).setView(sellerCoordinates, 15);

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);

    this.sellerMarker = L.marker(
  sellerCoordinates,
  {
    icon: this.createLocationMarker(
      'seller-location-marker',
      'P'
    )
  }
)
  .addTo(this.map)
  .bindPopup('Mesto preuzimanja');
  }

  private loadRoute(
    buyerLatitude: number,
    buyerLongitude: number
  ): void {
    this.routeService.getRoute(
      buyerLatitude,
      buyerLongitude,
      this.pickupAddress.latitude,
      this.pickupAddress.longitude
    ).subscribe({
      next: route => {
        this.isLoadingRoute.set(false);
        this.routeDistance.set(route.distance);
        this.routeDuration.set(route.duration);

        this.drawBuyerLocation(
          buyerLatitude,
          buyerLongitude
        );

        this.drawRoute(route.coordinates);
      },
      error: () => {
        this.isLoadingRoute.set(false);
        this.routeError.set(
          'Putanju trenutno nije moguće izračunati.'
        );
      }
    });
  }

  private drawBuyerLocation(
    latitude: number,
    longitude: number
  ): void {
    if (!this.map) {
      return;
    }

    const coordinates: L.LatLngExpression = [
      latitude,
      longitude
    ];

    if (this.buyerMarker) {
      this.buyerMarker.setLatLng(coordinates);
      return;
    }

    this.buyerMarker = L.marker(
  coordinates,
  {
    icon: this.createLocationMarker(
      'buyer-location-marker',
      'T'
    )
  }
)
  .addTo(this.map)
  .bindPopup('Tvoja trenutna lokacija');
  }

  private drawRoute(
    coordinates: [number, number][]
  ): void {
    if (!this.map) {
      return;
    }

    this.routeLine?.remove();

    this.routeLine = L.polyline(
      coordinates,
      {
        weight: 5,
        opacity: 0.85
      }
    ).addTo(this.map);

    this.map.fitBounds(
      this.routeLine.getBounds(),
      {
        padding: [30, 30],
        maxZoom: 16
      }
    );
  }

  private handleGeolocationError(
    error: GeolocationPositionError
  ): void {
    if (error.code === error.PERMISSION_DENIED) {
      this.routeError.set(
        'Pristup lokaciji je odbijen. Dozvoli lokaciju u browseru pa pokušaj ponovo.'
      );
      return;
    }

    if (error.code === error.POSITION_UNAVAILABLE) {
      this.routeError.set(
        'Trenutna lokacija nije dostupna.'
      );
      return;
    }

    if (error.code === error.TIMEOUT) {
      this.routeError.set(
        'Određivanje lokacije je trajalo predugo. Pokušaj ponovo.'
      );
      return;
    }

    this.routeError.set(
      'Trenutnu lokaciju nije moguće odrediti.'
    );
  }

  private hasValidPickupCoordinates(): boolean {
    return (
      Number.isFinite(this.pickupAddress.latitude) &&
      Number.isFinite(this.pickupAddress.longitude)
    );
  }


  private createLocationMarker(
  className: string,
  label: string
): L.DivIcon {
  return L.divIcon({
    html: `
      <div class="location-marker ${className}">
        ${label}
      </div>
    `,
    className: '',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22]
  });
}
}