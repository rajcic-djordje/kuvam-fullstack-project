import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as L from 'leaflet';
import { PublicLocationZone } from '../../models/seller';

@Component({
  selector: 'app-seller-location-map',
  imports: [],
  templateUrl: './seller-location-map.html',
  styleUrl: './seller-location-map.css'
})
export class SellerLocationMap implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer')
  private mapContainer?: ElementRef<HTMLDivElement>;

  @Input({ required: true })
  publicLocationZone!: PublicLocationZone;

  private map?: L.Map;
  private locationCircle?: L.Circle;

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.map ||
      !changes['publicLocationZone']
    ) {
      return;
    }

    this.updateLocationCircle();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initializeMap(): void {
    if (
      !this.mapContainer ||
      !this.hasValidLocationZone()
    ) {
      return;
    }

    const center = this.publicLocationZone.center;

    this.map = L.map(
      this.mapContainer.nativeElement,
      {
        zoomControl: true,
        attributionControl: true,
        dragging: true,
        scrollWheelZoom: false,
        doubleClickZoom: true,
        boxZoom: false,
        keyboard: true,
        touchZoom: true
      }
    ).setView(
      [center.latitude, center.longitude],
      13
    );

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);

    this.updateLocationCircle();

    setTimeout(() => {
      this.map?.invalidateSize();
    });
  }

  private updateLocationCircle(): void {
    if (
      !this.map ||
      !this.hasValidLocationZone()
    ) {
      return;
    }

    const center = this.publicLocationZone.center;
    const coordinates: L.LatLngExpression = [
      center.latitude,
      center.longitude
    ];

    if (this.locationCircle) {
      this.locationCircle.setLatLng(coordinates);
      this.locationCircle.setRadius(
        this.publicLocationZone.radius
      );
    } else {
      this.locationCircle = L.circle(
        coordinates,
        {
          radius: this.publicLocationZone.radius,
          color: '#2f8f46',
          weight: 2,
          opacity: 0.85,
          fillColor: '#5ca96b',
          fillOpacity: 0.2,
          interactive: false
        }
      ).addTo(this.map);
    }

    this.map.fitBounds(
      this.locationCircle.getBounds(),
      {
        padding: [24, 24],
        maxZoom: 14
      }
    );
  }

  private hasValidLocationZone(): boolean {
    const zone = this.publicLocationZone;

    return Boolean(
      zone &&
      Number.isFinite(zone.center?.latitude) &&
      Number.isFinite(zone.center?.longitude) &&
      Number.isFinite(zone.radius) &&
      zone.radius > 0
    );
  }
}