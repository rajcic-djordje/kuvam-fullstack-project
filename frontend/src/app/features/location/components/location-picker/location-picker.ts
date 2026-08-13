import { HttpClient, HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  signal,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as L from 'leaflet';
import { Coordinates } from '../../models/location';

interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

type SearchMessageType = 'success' | 'error';

@Component({
  selector: 'app-location-picker',
  imports: [],
  templateUrl: './location-picker.html',
  styleUrl: './location-picker.css'
})
export class LocationPicker implements AfterViewInit, OnChanges, OnDestroy {
  private readonly http = inject(HttpClient);

  @ViewChild('mapContainer')
  private mapContainer?: ElementRef<HTMLDivElement>;

  @Input() latitude: number | null = null;
  @Input() longitude: number | null = null;
  @Input() street = '';
  @Input() streetNumber = '';
  @Input() cityName = '';
  @Input() readonly = false;

  @Output() readonly locationChange =
    new EventEmitter<Coordinates>();

  private map?: L.Map;
  private marker?: L.Marker;

  private readonly defaultLatitude = 44.0165;
  private readonly defaultLongitude = 21.0059;
  private readonly defaultZoom = 7;
  private readonly selectedZoom = 17;

  readonly isSearching = signal(false);
  readonly searchMessage = signal('');
  readonly searchMessageType =
    signal<SearchMessageType>('success');

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.map ||
      (!changes['latitude'] && !changes['longitude'])
    ) {
      return;
    }

    this.updateMapFromInputs();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  findAddress(): void {
    if (this.readonly || this.isSearching()) {
      return;
    }

    const street = this.street.trim();
    const streetNumber = this.streetNumber.trim();
    const cityName = this.cityName.trim();

    this.searchMessage.set('');

    if (!street || !streetNumber || !cityName) {
      this.setSearchMessage(
        'Pre pretrage unesi grad, ulicu i broj.',
        'error'
      );
      return;
    }

    const params = new HttpParams()
      .set('format', 'jsonv2')
      .set('limit', '1')
      .set('countrycodes', 'rs')
      .set('street', `${streetNumber} ${street}`)
      .set('city', cityName)
      .set('country', 'Srbija')
      .set('addressdetails', '1');

    this.isSearching.set(true);

    this.http
      .get<NominatimSearchResult[]>(
        'https://nominatim.openstreetmap.org/search',
        { params }
      )
      .subscribe({
        next: results => {
          this.isSearching.set(false);

          const result = results[0];

          if (!result) {
            this.setSearchMessage(
              'Adresa nije pronađena. Proveri podatke ili ručno izaberi mesto na mapi.',
              'error'
            );
            return;
          }

          const latitude = Number(result.lat);
          const longitude = Number(result.lon);

          if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
          ) {
            this.setSearchMessage(
              'Servis je vratio neispravne koordinate.',
              'error'
            );
            return;
          }

          this.setLocation(
            latitude,
            longitude,
            true
          );

          this.setSearchMessage(
            `Adresa je pronađena: ${result.display_name}`,
            'success'
          );
        },
        error: () => {
          this.isSearching.set(false);

          this.setSearchMessage(
            'Adresu trenutno nije moguće pronaći. Ručno izaberi mesto na mapi.',
            'error'
          );
        }
      });
  }

  useCurrentLocation(): void {
    if (
      this.readonly ||
      this.isSearching()
    ) {
      return;
    }

    this.searchMessage.set('');

    if (!navigator.geolocation) {
      this.setSearchMessage(
        'Browser ne podržava određivanje trenutne lokacije.',
        'error'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setLocation(
          position.coords.latitude,
          position.coords.longitude,
          true
        );

        this.setSearchMessage(
          'Trenutna lokacija je postavljena. Po potrebi pomeri pin.',
          'success'
        );
      },
      () => {
        this.setSearchMessage(
          'Trenutna lokacija nije dostupna ili dozvola nije odobrena.',
          'error'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  private initializeMap(): void {
    if (!this.mapContainer) {
      return;
    }

    const hasCoordinates =
      this.latitude !== null &&
      this.longitude !== null;

    const initialLatitude = hasCoordinates
      ? this.latitude as number
      : this.defaultLatitude;

    const initialLongitude = hasCoordinates
      ? this.longitude as number
      : this.defaultLongitude;

    this.map = L.map(
      this.mapContainer.nativeElement,
      {
        zoomControl: true,
        attributionControl: true
      }
    ).setView(
      [initialLatitude, initialLongitude],
      hasCoordinates
        ? this.selectedZoom
        : this.defaultZoom
    );

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);

    if (hasCoordinates) {
      this.createOrMoveMarker(
        initialLatitude,
        initialLongitude
      );
    }

    if (!this.readonly) {
      this.map.on('click', event => {
        this.searchMessage.set('');

        this.setLocation(
          event.latlng.lat,
          event.latlng.lng,
          true
        );
      });
    }

    setTimeout(() => {
      this.map?.invalidateSize();
    });
  }

  private updateMapFromInputs(): void {
    if (!this.map) {
      return;
    }

    if (
      this.latitude === null ||
      this.longitude === null
    ) {
      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = undefined;
      }

      return;
    }

    this.createOrMoveMarker(
      this.latitude,
      this.longitude
    );

    this.map.setView(
      [this.latitude, this.longitude],
      this.selectedZoom
    );
  }

  private setLocation(
    latitude: number,
    longitude: number,
    emitChange: boolean
  ): void {
    const normalizedLatitude =
      Number(latitude.toFixed(6));

    const normalizedLongitude =
      Number(longitude.toFixed(6));

    this.createOrMoveMarker(
      normalizedLatitude,
      normalizedLongitude
    );

    this.map?.setView(
      [
        normalizedLatitude,
        normalizedLongitude
      ],
      this.selectedZoom
    );

    if (emitChange) {
      this.locationChange.emit({
        latitude: normalizedLatitude,
        longitude: normalizedLongitude
      });
    }
  }

  private createOrMoveMarker(
    latitude: number,
    longitude: number
  ): void {
    if (!this.map) {
      return;
    }

    if (this.marker) {
      this.marker.setLatLng([
        latitude,
        longitude
      ]);
      return;
    }

    const markerIcon = L.divIcon({
      className:
        'location-picker-marker-wrapper',
      html:
        '<div class="location-picker-marker"><span></span></div>',
      iconSize: [32, 42],
      iconAnchor: [16, 42]
    });

    this.marker = L.marker(
      [latitude, longitude],
      {
        icon: markerIcon,
        draggable: !this.readonly
      }
    ).addTo(this.map);

    if (!this.readonly) {
      this.marker.on('dragend', () => {
        const position =
          this.marker?.getLatLng();

        if (!position) {
          return;
        }

        this.searchMessage.set('');

        this.setLocation(
          position.lat,
          position.lng,
          true
        );
      });
    }
  }

  private setSearchMessage(
    message: string,
    type: SearchMessageType
  ): void {
    this.searchMessage.set(message);
    this.searchMessageType.set(type);
  }
}