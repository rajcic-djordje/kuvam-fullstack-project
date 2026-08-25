import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  debounceTime,
  Subscription
} from 'rxjs';
import { API_BASE_URL } from '../../../../core/constants/api.constants';
import { ApiErrorService } from '../../../../shared/services/api-error';
import { FormDraftService } from '../../../../shared/services/form-draft';
import { ToastService } from '../../../../shared/services/toast';
import { AuthService } from '../../../auth/services/auth';
import { LocationPicker } from '../../../location/components/location-picker/location-picker';
import {
  City,
  Coordinates
} from '../../../location/models/location';
import { CityService } from '../../../location/services/city';
import {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UpdateSellerProfileRequest,
  UserProfile
} from '../../models/profile';
import { ProfileService } from '../../services/profile';
import { SellerProfileService } from '../../services/seller-profile';
import { LocationModal } from '../../../location/components/location-modal/location-modal';
import { CartService } from '../../../cart/services/cart';

const NAME_PATTERN =
  /^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u;

const BUSINESS_NAME_PATTERN =
  /^(?=.*\p{L})[\p{L}\p{N} .,'&()\-]+$/u;

const passwordFormValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const currentPassword =
    control.get(
      'currentPassword'
    )?.value;

  const newPassword =
    control.get(
      'newPassword'
    )?.value;

  const confirmPassword =
    control.get(
      'confirmPassword'
    )?.value;

  const errors:
    ValidationErrors = {};

  if (
    newPassword &&
    confirmPassword &&
    newPassword !==
      confirmPassword
  ) {
    errors['passwordsMismatch'] =
      true;
  }

  if (
    currentPassword &&
    newPassword &&
    currentPassword ===
      newPassword
  ) {
    errors['passwordUnchanged'] =
      true;
  }

  return (
    Object.keys(errors).length >
    0
  )
    ? errors
    : null;
};

interface PersonalProfileDraft {
  firstName: string;
  lastName: string;
}

interface SellerProfileDraft {
  businessName: string;
  description: string;
  cityId: string;
  street: string;
  streetNumber: string;
  additionalInfo: string;
  latitude: number | null;
  longitude: number | null;
}

@Component({
  selector: 'app-profile-page',
  imports: [
    ReactiveFormsModule,
    LocationPicker,
    LocationModal
  ],
  templateUrl:
    './profile-page.html',
  styleUrl:
    './profile-page.css'
})
export class ProfilePage
implements OnInit, OnDestroy {
  private readonly formBuilder =
    inject(FormBuilder);

    private readonly cartService =
  inject(CartService);

  private readonly profileService =
    inject(ProfileService);

  private readonly sellerProfileService =
    inject(
      SellerProfileService
    );

  private readonly cityService =
    inject(CityService);

  private readonly authService =
    inject(AuthService);

  private readonly apiErrorService =
    inject(ApiErrorService);

  private readonly formDraftService =
    inject(FormDraftService);

  private readonly toastService =
    inject(ToastService);

  private readonly router =
    inject(Router);

  private personalDraftSubscription:
    Subscription | null = null;

  private sellerDraftSubscription:
    Subscription | null = null;

  readonly profile =
    signal<UserProfile | null>(
      null
    );

    readonly isLocationModalOpen =
  signal(false);

  readonly isLoading =
    signal(true);

  readonly loadError =
    signal('');

  readonly isPersonalEditing =
    signal(false);

  readonly isSellerEditing =
    signal(false);

  readonly isSavingPersonal =
    signal(false);

  readonly isSavingSeller =
    signal(false);

  readonly isUpdatingAvailability =
    signal(false);

  readonly isChangingPassword =
    signal(false);

  readonly isDeactivating =
    signal(false);

  readonly isUploadingProfileImage =
    signal(false);

  readonly isDeletingProfileImage =
    signal(false);

  readonly isUploadingCoverImage =
    signal(false);

  readonly isDeletingCoverImage =
    signal(false);

  readonly apiOrigin =
    API_BASE_URL.replace(
      /\/api\/v1\/?$/,
      ''
    );

  readonly selectedLatitude =
    signal<number | null>(
      null
    );

  readonly selectedLongitude =
    signal<number | null>(
      null
    );

  readonly isPasswordModalOpen =
    signal(false);

  readonly showCurrentPassword =
    signal(false);

  readonly showNewPassword =
    signal(false);

  readonly showConfirmPassword =
    signal(false);

  readonly cities =
    signal<City[]>([]);

  readonly isLoadingCities =
    signal(false);

  readonly citiesError =
    signal('');

  readonly initials =
    computed(() => {
      const user =
        this.profile();

      if (!user) {
        return '';
      }

      return (
        `${user.firstName.charAt(
          0
        )}${user.lastName.charAt(
          0
        )}`
      ).toUpperCase();
    });

    readonly hasCartItems =
        computed(() => {
          return (
            this.cartService
              .items()
              .length > 0
          );
        });


  

  readonly personalForm =
    this.formBuilder
      .nonNullable
      .group({
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(
              2
            ),
            Validators.maxLength(
              50
            ),
            Validators.pattern(
              NAME_PATTERN
            )
          ]
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(
              2
            ),
            Validators.maxLength(
              50
            ),
            Validators.pattern(
              NAME_PATTERN
            )
          ]
        ]
      });

  readonly sellerForm =
    this.formBuilder
      .nonNullable
      .group({
        businessName: [
          '',
          [
            Validators.required,
            Validators.minLength(
              2
            ),
            Validators.maxLength(
              100
            ),
            Validators.pattern(
              BUSINESS_NAME_PATTERN
            )
          ]
        ],
        description: [
          '',
          [
            Validators.maxLength(
              500
            )
          ]
        ],

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
            Validators.minLength(
              2
            ),
            Validators.maxLength(
              150
            )
          ]
        ],

        streetNumber: [
          '',
          [
            Validators.required,
            Validators.maxLength(
              20
            )
          ]
        ],

        additionalInfo: [
          '',
          [
            Validators.maxLength(
              300
            )
          ]
        ]
      });

  readonly passwordForm =
    this.formBuilder
      .nonNullable
      .group(
        {
          currentPassword: [
            '',
            [
              Validators.required
            ]
          ],

          newPassword: [
            '',
            [
              Validators.required,
              Validators.minLength(
                8
              ),
              Validators.maxLength(
                100
              )
            ]
          ],

          confirmPassword: [
            '',
            [
              Validators.required
            ]
          ]
        },
        {
          validators:
            passwordFormValidator
        }
      );

  ngOnInit(): void {
    this.loadProfile();
    this.loadCities();
  }

  ngOnDestroy(): void {
    this.personalDraftSubscription
      ?.unsubscribe();

    this.sellerDraftSubscription
      ?.unsubscribe();
  }

  clearCartAfterCityChange(): void {
      this.cartService.clear();
  }

  startPersonalEditing(): void {
    const user =
      this.profile();

    if (!user) {
      return;
    }

    this.populatePersonalForm(
      user
    );

    this.restorePersonalDraft(
      user.id
    );

    this.startPersonalDraftPersistence(
      user.id
    );

    this.isPersonalEditing.set(
      true
    );
  }

  cancelPersonalEditing(): void {
    const user =
      this.profile();

    this.personalDraftSubscription
      ?.unsubscribe();

    this.personalDraftSubscription =
      null;

    if (user) {
      this.formDraftService.clear(
        this.personalDraftKey(
          user.id
        )
      );

      this.populatePersonalForm(
        user
      );
    }

    this.isPersonalEditing.set(
      false
    );
  }

  savePersonalProfile(): void {
    if (
      this.personalForm.invalid
    ) {
      this.personalForm
        .markAllAsTouched();

      return;
    }

    const values =
      this.personalForm
        .getRawValue();

    const request:
      UpdateProfileRequest = {
        firstName:
          values.firstName.trim(),

        lastName:
          values.lastName.trim()
      };

    this.isSavingPersonal.set(
      true
    );

    this.profileService
      .updateProfile(request)
      .subscribe({
        next: response => {
          this.personalDraftSubscription
            ?.unsubscribe();

          this.personalDraftSubscription =
            null;

          this.formDraftService.clear(
            this.personalDraftKey(
              response.user.id
            )
          );

          this.updateProfileState(
            response.user
          );

          this.isPersonalEditing.set(
            false
          );

          this.isSavingPersonal.set(
            false
          );

          this.toastService.success(
            'Lični podaci su uspešno sačuvani.'
          );
        },

        error: error => {
          this.isSavingPersonal.set(
            false
          );

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Izmena podataka trenutno nije uspela.'
            )
          );
        }
      });
  }

  startSellerEditing(): void {
    const user =
      this.profile();

    if (
      !user?.sellerProfile
    ) {
      return;
    }

    this.populateSellerForm(
      user
    );

    this.restoreSellerDraft(
      user.id
    );

    this.startSellerDraftPersistence(
      user.id
    );

    this.isSellerEditing.set(
      true
    );
  }

  cancelSellerEditing(): void {
    const user =
      this.profile();

    this.sellerDraftSubscription
      ?.unsubscribe();

    this.sellerDraftSubscription =
      null;

    if (user) {
      this.formDraftService.clear(
        this.sellerDraftKey(
          user.id
        )
      );

      this.populateSellerForm(
        user
      );
    }

    this.isSellerEditing.set(
      false
    );
  }

  selectedSellerCityName(): string {
    const cityId =
      this.sellerForm
        .controls
        .cityId
        .value;

    return (
      this.cities()
        .find(city => {
          return (
            city.id === cityId
          );
        })
        ?.name ??
      ''
    );
  }

  clearSelectedLocation(): void {
    this.selectedLatitude.set(
      null
    );

    this.selectedLongitude.set(
      null
    );

    this.saveSellerDraftIfEditing();
  }

  updateSelectedLocation(
    coordinates: Coordinates
  ): void {
    this.selectedLatitude.set(
      coordinates.latitude
    );

    this.selectedLongitude.set(
      coordinates.longitude
    );

    this.saveSellerDraftIfEditing();
  }

  saveSellerProfile(): void {
    if (
      this.sellerForm.invalid
    ) {
      this.sellerForm
        .markAllAsTouched();

      return;
    }

    const latitude =
      this.selectedLatitude();

    const longitude =
      this.selectedLongitude();

    if (
      latitude === null ||
      longitude === null
    ) {
      this.toastService.error(
        'Pronađi adresu na mapi ili ručno izaberi mesto preuzimanja.'
      );

      return;
    }

    const values =
      this.sellerForm
        .getRawValue();

    const request:
      UpdateSellerProfileRequest = {
        businessName:
          values.businessName
            .trim(),

        description:
          values.description
            .trim(),

        cityId:
          values.cityId,

        street:
          values.street.trim(),

        streetNumber:
          values.streetNumber
            .trim(),

        additionalInfo:
          values.additionalInfo
            .trim() ||
          null,

        latitude,
        longitude
      };

    this.isSavingSeller.set(
      true
    );

    this.sellerProfileService
      .updateSellerProfile(
        request
      )
      .subscribe({
        next: response => {
          const currentProfile =
            this.profile();

          this.sellerDraftSubscription
            ?.unsubscribe();

          this.sellerDraftSubscription =
            null;

          if (currentProfile) {
            this.formDraftService
              .clear(
                this.sellerDraftKey(
                  currentProfile.id
                )
              );

            this.updateProfileState({
              ...currentProfile,
              sellerProfile:
                response.seller
            });
          }

          this.isSellerEditing.set(
            false
          );

          this.isSavingSeller.set(
            false
          );

          this.toastService.success(
            'Podaci prodavca i mesto preuzimanja su uspešno sačuvani.'
          );
        },

        error: error => {
          this.isSavingSeller.set(
            false
          );

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Izmena podataka trenutno nije uspela.'
            )
          );
        }
      });
  }

  uploadSellerProfileImage(
    event: Event
  ): void {
    const input =
      event.target as
        HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    if (
      !this.isValidImage(
        file
      )
    ) {
      input.value = '';

      return;
    }

    this.isUploadingProfileImage
      .set(true);

    this.sellerProfileService
      .uploadProfileImage(file)
      .subscribe({
        next: response => {
          const currentProfile =
            this.profile();

          if (currentProfile) {
            this.updateProfileState({
              ...currentProfile,
              sellerProfile:
                response.seller
            });
          }

          this.isUploadingProfileImage
            .set(false);

          input.value = '';

          this.toastService.success(
            'Logo prodavca je uspešno promenjen.'
          );
        },

        error: error => {
          this.isUploadingProfileImage
            .set(false);

          input.value = '';

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Upload slike trenutno nije uspeo.'
            )
          );
        }
      });
  }

  deleteSellerProfileImage(): void {
    const currentProfile =
      this.profile();

    if (
      !currentProfile
        ?.sellerProfile
        ?.profileImageUrl ||
      this.isUploadingProfileImage() ||
      this.isDeletingProfileImage()
    ) {
      return;
    }

    this.isDeletingProfileImage
      .set(true);

    this.sellerProfileService
      .deleteProfileImage()
      .subscribe({
        next: response => {
          this.updateProfileState({
            ...currentProfile,
            sellerProfile:
              response.seller
          });

          this.isDeletingProfileImage
            .set(false);

          this.toastService.success(
            'Logo domaćinstva je uspešno uklonjen.'
          );
        },

        error: error => {
          this.isDeletingProfileImage
            .set(false);

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Uklanjanje loga trenutno nije uspelo.'
            )
          );
        }
      });
  }

  uploadSellerCoverImage(
    event: Event
  ): void {
    const input =
      event.target as
        HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    if (
      !this.isValidImage(
        file
      )
    ) {
      input.value = '';

      return;
    }

    this.isUploadingCoverImage
      .set(true);

    this.sellerProfileService
      .uploadCoverImage(file)
      .subscribe({
        next: response => {
          const currentProfile =
            this.profile();

          if (currentProfile) {
            this.updateProfileState({
              ...currentProfile,
              sellerProfile:
                response.seller
            });
          }

          this.isUploadingCoverImage
            .set(false);

          input.value = '';

          this.toastService.success(
            'Naslovna fotografija je uspešno promenjena.'
          );
        },

        error: error => {
          this.isUploadingCoverImage
            .set(false);

          input.value = '';

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Upload slike trenutno nije uspeo.'
            )
          );
        }
      });
  }

  deleteSellerCoverImage(): void {
    const currentProfile =
      this.profile();

    if (
      !currentProfile
        ?.sellerProfile
        ?.coverImageUrl ||
      this.isUploadingCoverImage() ||
      this.isDeletingCoverImage()
    ) {
      return;
    }

    this.isDeletingCoverImage
      .set(true);

    this.sellerProfileService
      .deleteCoverImage()
      .subscribe({
        next: response => {
          this.updateProfileState({
            ...currentProfile,
            sellerProfile:
              response.seller
          });

          this.isDeletingCoverImage
            .set(false);

          this.toastService.success(
            'Naslovna fotografija je uspešno uklonjena.'
          );
        },

        error: error => {
          this.isDeletingCoverImage
            .set(false);

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Uklanjanje naslovne fotografije trenutno nije uspelo.'
            )
          );
        }
      });
  }

  sellerImageUrl(
    imageUrl: string | null
  ): string {
    if (!imageUrl) {
      return '';
    }

    if (
      imageUrl.startsWith(
        'http://'
      ) ||
      imageUrl.startsWith(
        'https://'
      )
    ) {
      return imageUrl;
    }

    return (
      `${this.apiOrigin}${imageUrl}`
    );
  }

  toggleSellerAvailability(): void {
    const currentProfile =
      this.profile();

    const sellerProfile =
      currentProfile
        ?.sellerProfile;

    if (
      !currentProfile ||
      !sellerProfile ||
      this.isUpdatingAvailability()
    ) {
      return;
    }

    const newAvailability =
      !sellerProfile.isOpen;

    this.isUpdatingAvailability
      .set(true);

    this.sellerProfileService
      .updateSellerProfile({
        isOpen:
          newAvailability
      })
      .subscribe({
        next: response => {
          this.updateProfileState({
            ...currentProfile,
            sellerProfile:
              response.seller
          });

          this.isUpdatingAvailability
            .set(false);

          this.toastService.success(
            newAvailability
              ? 'Sada primaš nove porudžbine.'
              : 'Primanje novih porudžbina je pauzirano.'
          );
        },

        error: error => {
          this.isUpdatingAvailability
            .set(false);

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Izmena podataka trenutno nije uspela.'
            )
          );
        }
      });
  }

  openPasswordModal(): void {
    this.passwordForm.reset();

    this.showCurrentPassword.set(
      false
    );

    this.showNewPassword.set(
      false
    );

    this.showConfirmPassword.set(
      false
    );

    this.isPasswordModalOpen.set(
      true
    );
  }

  closePasswordModal(): void {
    if (
      this.isChangingPassword()
    ) {
      return;
    }

    this.isPasswordModalOpen.set(
      false
    );

    this.passwordForm.reset();

    this.showCurrentPassword.set(
      false
    );

    this.showNewPassword.set(
      false
    );

    this.showConfirmPassword.set(
      false
    );
  }

  changePassword(): void {
    if (
      this.passwordForm.invalid
    ) {
      this.passwordForm
        .markAllAsTouched();

      return;
    }

    const values =
      this.passwordForm
        .getRawValue();

    const request:
      ChangePasswordRequest = {
        currentPassword:
          values.currentPassword,

        newPassword:
          values.newPassword
      };

    this.isChangingPassword.set(
      true
    );

    this.profileService
      .changePassword(request)
      .subscribe({
        next: () => {
          this.isPasswordModalOpen
            .set(false);

          this.passwordForm.reset();

          this.showCurrentPassword
            .set(false);

          this.showNewPassword
            .set(false);

          this.showConfirmPassword
            .set(false);

          this.authService
            .logout()
            .subscribe({
              next: () => {
                this.router.navigate([
                  '/login'
                ]);
              },

              error: () => {
                this.router.navigate([
                  '/login'
                ]);
              }
            });
        },

        error: error => {
          this.isChangingPassword
            .set(false);

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Promena lozinke trenutno nije uspela.'
            )
          );
        }
      });
  }

  deactivateAccount(): void {
    const confirmed =
      window.confirm(
        'Da li sigurno želiš da deaktiviraš nalog? Nakon toga ćeš biti odjavljen.'
      );

    if (!confirmed) {
      return;
    }

    this.isDeactivating.set(
      true
    );

    this.profileService
      .deactivateAccount()
      .subscribe({
        next: () => {
          this.authService
            .logout()
            .subscribe({
              next: () => {
                this.router.navigate([
                  '/login'
                ]);
              },

              error: () => {
                this.router.navigate([
                  '/login'
                ]);
              }
            });
        },

        error: error => {
          this.isDeactivating.set(
            false
          );

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Deaktivacija naloga trenutno nije uspela.'
            )
          );
        }
      });
  }

  toggleCurrentPassword(): void {
    this.showCurrentPassword
      .update(
        value => !value
      );
  }

  toggleNewPassword(): void {
    this.showNewPassword
      .update(
        value => !value
      );
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword
      .update(
        value => !value
      );
  }

  roleLabel(
    role: UserProfile['role']
  ): string {
    if (
      role === 'seller'
    ) {
      return 'Prodavac';
    }

    if (
      role === 'admin'
    ) {
      return 'Administrator';
    }

    return 'Kupac';
  }

  statusLabel(
    status:
      UserProfile['status']
  ): string {
    const labels:
      Record<
        UserProfile['status'],
        string
      > = {
        active:
          'Aktivan',

        suspended:
          'Suspendovan',

        deactivated:
          'Deaktiviran',

        banned:
          'Banovan'
      };

    return labels[status];
  }

  approvalLabel(
    status:
      NonNullable<
        UserProfile[
          'sellerProfile'
        ]
      >['approvalStatus']
  ): string {
    const labels = {
      pending:
        'Na čekanju',

      approved:
        'Odobren prodavac',

      rejected:
        'Odbijen',

      suspended:
        'Suspendovan'
    };

    return labels[status];
  }

  formattedDate(
    date: string
  ): string {
    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return 'Nije dostupno';
    }

    return (
      new Intl.DateTimeFormat(
        'sr-Latn-RS',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      ).format(
        parsedDate
      )
    );
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.profileService
      .getProfile()
      .subscribe({
        next: response => {
          this.updateProfileState(
            response.user
          );

          this.isLoading.set(
            false
          );
        },

        error: () => {
          this.loadError.set(
            'Podaci profila trenutno nisu dostupni.'
          );

          this.isLoading.set(
            false
          );
        }
      });
  }

  private loadCities(): void {
    this.isLoadingCities.set(
      true
    );

    this.citiesError.set('');

    this.cityService
      .getCities()
      .subscribe({
        next: response => {
          this.cities.set(
            response.cities
          );

          this.isLoadingCities.set(
            false
          );
        },

        error: () => {
          this.cities.set([]);

          this.isLoadingCities.set(
            false
          );

          this.citiesError.set(
            'Gradovi trenutno nisu dostupni.'
          );
        }
      });
  }

  private updateProfileState(
    user: UserProfile
  ): void {
    this.profile.set(
      user
    );

    this.populatePersonalForm(
      user
    );

    this.populateSellerForm(
      user
    );

    this.authService
      .updateCurrentUser(
        user
      );
  }

  private populatePersonalForm(
    user: UserProfile
  ): void {
    this.personalForm.setValue({
      firstName:
        user.firstName,

      lastName:
        user.lastName
    });

    this.personalForm
      .markAsPristine();

    this.personalForm
      .markAsUntouched();
  }

  private populateSellerForm(
    user: UserProfile
  ): void {
    const seller =
      user.sellerProfile;

    this.sellerForm.setValue({
      businessName:
        seller?.businessName ??
        '',

      description:
        seller?.description ??
        '',

      cityId:
        seller?.city?.id ??
        '',

      street:
        seller
          ?.pickupAddress
          ?.street ??
        '',

      streetNumber:
        seller
          ?.pickupAddress
          ?.streetNumber ??
        '',

      additionalInfo:
        seller
          ?.pickupAddress
          ?.additionalInfo ??
        ''
    });

    this.selectedLatitude.set(
      seller
        ?.pickupAddress
        ?.latitude ??
      null
    );

    this.selectedLongitude.set(
      seller
        ?.pickupAddress
        ?.longitude ??
      null
    );

    this.sellerForm
      .markAsPristine();

    this.sellerForm
      .markAsUntouched();
  }

  private personalDraftKey(
    userId: string
  ): string {
    return (
      `profile-personal:${userId}`
    );
  }

  private sellerDraftKey(
    userId: string
  ): string {
    return (
      `profile-seller:${userId}`
    );
  }

  private restorePersonalDraft(
    userId: string
  ): void {
    const draft =
      this.formDraftService
        .load<
          PersonalProfileDraft
        >(
          this.personalDraftKey(
            userId
          )
        );

    if (!draft) {
      return;
    }

    this.personalForm.patchValue({
      firstName:
        draft.firstName ??
        '',

      lastName:
        draft.lastName ??
        ''
    });
  }

  private startPersonalDraftPersistence(
    userId: string
  ): void {
    this.personalDraftSubscription
      ?.unsubscribe();

    this.personalDraftSubscription =
      this.personalForm
        .valueChanges
        .pipe(
          debounceTime(
            250
          )
        )
        .subscribe(() => {
          const values =
            this.personalForm
              .getRawValue();

          const draft:
            PersonalProfileDraft = {
              firstName:
                values.firstName,

              lastName:
                values.lastName
            };

          this.formDraftService
            .save(
              this.personalDraftKey(
                userId
              ),
              draft
            );
        });
  }

  private restoreSellerDraft(
    userId: string
  ): void {
    const draft =
      this.formDraftService
        .load<
          SellerProfileDraft
        >(
          this.sellerDraftKey(
            userId
          )
        );

    if (!draft) {
      return;
    }

    this.sellerForm.patchValue({
      businessName:
        draft.businessName ??
        '',

      description:
        draft.description ??
        '',

      cityId:
        draft.cityId ??
        '',

      street:
        draft.street ??
        '',

      streetNumber:
        draft.streetNumber ??
        '',

      additionalInfo:
        draft.additionalInfo ??
        ''
    });

    this.selectedLatitude.set(
      draft.latitude ??
      null
    );

    this.selectedLongitude.set(
      draft.longitude ??
      null
    );
  }

  private startSellerDraftPersistence(
    userId: string
  ): void {
    this.sellerDraftSubscription
      ?.unsubscribe();

    this.sellerDraftSubscription =
      this.sellerForm
        .valueChanges
        .pipe(
          debounceTime(
            250
          )
        )
        .subscribe(() => {
          this.saveSellerDraft(
            userId
          );
        });
  }

  private saveSellerDraftIfEditing(): void {
    const user =
      this.profile();

    if (
      !user ||
      !this.isSellerEditing()
    ) {
      return;
    }

    this.saveSellerDraft(
      user.id
    );
  }

  private saveSellerDraft(
    userId: string
  ): void {
    const values =
      this.sellerForm
        .getRawValue();

    const draft:
      SellerProfileDraft = {
        businessName:
          values.businessName,

        description:
          values.description,

        cityId:
          values.cityId,

        street:
          values.street,

        streetNumber:
          values.streetNumber,

        additionalInfo:
          values.additionalInfo,

        latitude:
          this.selectedLatitude(),

        longitude:
          this.selectedLongitude()
      };

    this.formDraftService.save(
      this.sellerDraftKey(
        userId
      ),
      draft
    );
  }

  private isValidImage(
    file: File
  ): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      this.toastService.error(
        'Dozvoljeni formati slike su JPG, PNG i WEBP.'
      );

      return false;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      this.toastService.error(
        'Slika može imati najviše 5 MB.'
      );

      return false;
    }

    return true;
  }

  openLocationModal(): void {
  this.isLocationModalOpen.set(
    true
  );
}

closeLocationModal(): void {
  this.isLocationModalOpen.set(
    false
  );
}

locationUpdated(
  user: UserProfile
): void {
  this.updateProfileState(
    user
  );

  this.isLocationModalOpen.set(
    false
  );

  this.toastService.success(
    'Lokacija je uspešno promenjena.'
  );
}
}