import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  OnInit,
  output,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { UserProfile } from '../../../profile/models/profile';
import { ProfileService } from '../../../profile/services/profile';
import {
  City,
  UpdateLocationRequest
} from '../../models/location';
import { CityService } from '../../services/city';

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

@Component({
  selector: 'app-location-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './location-modal.html',
  styleUrl: './location-modal.css'
})
export class LocationModal implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly cityService = inject(CityService);
  private readonly profileService = inject(ProfileService);

  readonly saved = output<UserProfile>();
  readonly dismissed = output<void>();

  readonly cities = signal<City[]>([]);
  readonly isLoadingCities = signal(true);
  readonly isSaving = signal(false);
  readonly errorMessage = signal('');

  readonly locationForm = this.formBuilder.nonNullable.group({
    cityId: [
      '',
      [
        Validators.required
      ]
    ],
    street: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150)
      ]
    ],
    streetNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(20)
      ]
    ],
    additionalInfo: [
      '',
      [
        Validators.maxLength(300)
      ]
    ]
  });

  ngOnInit(): void {
    this.loadCities();
  }

  saveLocation(): void {
    this.errorMessage.set('');

    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    const values = this.locationForm.getRawValue();

    const request: UpdateLocationRequest = {
      cityId: values.cityId,
      street: values.street.trim(),
      streetNumber: values.streetNumber.trim(),
      additionalInfo:
        values.additionalInfo.trim() || undefined
    };

    this.isSaving.set(true);

    this.profileService.updateLocation(request).subscribe({
      next: response => {
        this.isSaving.set(false);
        this.saved.emit(response.user);
      },
      error: error => {
        this.isSaving.set(false);
        this.handleError(error);
      }
    });
  }

  dismiss(): void {
    if (this.isSaving()) {
      return;
    }

    this.dismissed.emit();
  }

  private loadCities(): void {
    this.isLoadingCities.set(true);
    this.errorMessage.set('');

    this.cityService.getCities().subscribe({
      next: response => {
        this.cities.set(response.cities);
        this.isLoadingCities.set(false);
      },
      error: () => {
        this.isLoadingCities.set(false);
        this.errorMessage.set(
          'Gradovi trenutno nisu dostupni. Pokušaj ponovo kasnije.'
        );
      }
    });
  }

  private handleError(error: HttpErrorResponse): void {
    const response =
      error.error as ApiErrorBody | undefined;

    const code = response?.error?.code;

    if (code === 'VALIDATION_ERROR') {
      this.errorMessage.set(
        'Proveri unete podatke i pokušaj ponovo.'
      );

      return;
    }

    if (code === 'CITY_NOT_FOUND') {
      this.errorMessage.set(
        'Izabrani grad više nije dostupan.'
      );

      return;
    }

    this.errorMessage.set(
      response?.error?.message ??
      'Čuvanje lokacije trenutno nije uspelo.'
    );
  }
}