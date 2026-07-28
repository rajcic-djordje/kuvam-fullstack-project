import { HttpErrorResponse } from '@angular/common/http';
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
import { AuthService } from '../../../auth/services/auth';
import {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserProfile
} from '../../models/profile';
import { ProfileService } from '../../services/profile';

const NAME_PATTERN = /^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u;

const BUSINESS_NAME_PATTERN =
  /^(?=.*\p{L})[\p{L}\p{N} .,'&()\-]+$/u;

const passwordFormValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const currentPassword = control.get('currentPassword')?.value;
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  const errors: ValidationErrors = {};

  if (
    newPassword &&
    confirmPassword &&
    newPassword !== confirmPassword
  ) {
    errors['passwordsMismatch'] = true;
  }

  if (
    currentPassword &&
    newPassword &&
    currentPassword === newPassword
  ) {
    errors['passwordUnchanged'] = true;
  }

  return Object.keys(errors).length > 0
    ? errors
    : null;
};

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

type ToastType = 'success' | 'error';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly profile = signal<UserProfile | null>(null);
  readonly isLoading = signal(true);
  readonly loadError = signal('');

  readonly isPersonalEditing = signal(false);
  readonly isSellerEditing = signal(false);

  readonly isSavingPersonal = signal(false);
  readonly isSavingSeller = signal(false);
  readonly isChangingPassword = signal(false);
  readonly isDeactivating = signal(false);

  readonly isPasswordModalOpen = signal(false);

  readonly toastMessage = signal('');
  readonly toastType = signal<ToastType>('success');

  readonly showCurrentPassword = signal(false);
  readonly showNewPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly initials = computed(() => {
    const user = this.profile();

    if (!user) {
      return '';
    }

    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
      .toUpperCase();
  });

  readonly personalForm = this.formBuilder.nonNullable.group({
    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(NAME_PATTERN)
      ]
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(NAME_PATTERN)
      ]
    ]
  });

  readonly sellerForm = this.formBuilder.nonNullable.group({
    businessName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(BUSINESS_NAME_PATTERN)
      ]
    ],
    description: [
      '',
      [
        Validators.maxLength(500)
      ]
    ]
  });

  readonly passwordForm = this.formBuilder.nonNullable.group(
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
          Validators.minLength(8),
          Validators.maxLength(100)
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
      validators: passwordFormValidator
    }
  );

  ngOnInit(): void {
    this.loadProfile();
  }

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  startPersonalEditing(): void {
    const user = this.profile();

    if (!user) {
      return;
    }

    this.populatePersonalForm(user);
    this.isPersonalEditing.set(true);
  }

  cancelPersonalEditing(): void {
    const user = this.profile();

    if (user) {
      this.populatePersonalForm(user);
    }

    this.isPersonalEditing.set(false);
  }

  savePersonalProfile(): void {
    if (this.personalForm.invalid) {
      this.personalForm.markAllAsTouched();
      return;
    }

    const values = this.personalForm.getRawValue();

    const request: UpdateProfileRequest = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim()
    };

    this.isSavingPersonal.set(true);

    this.profileService.updateProfile(request).subscribe({
      next: response => {
        this.updateProfileState(response.user);

        this.isPersonalEditing.set(false);
        this.isSavingPersonal.set(false);

        this.showToast(
          'Lični podaci su uspešno sačuvani.',
          'success'
        );
      },
      error: error => {
        this.isSavingPersonal.set(false);
        this.handleProfileError(error);
      }
    });
  }

  startSellerEditing(): void {
    const user = this.profile();

    if (!user?.sellerProfile) {
      return;
    }

    this.populateSellerForm(user);
    this.isSellerEditing.set(true);
  }

  cancelSellerEditing(): void {
    const user = this.profile();

    if (user) {
      this.populateSellerForm(user);
    }

    this.isSellerEditing.set(false);
  }

  saveSellerProfile(): void {
    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();
      return;
    }

    const values = this.sellerForm.getRawValue();

    const request: UpdateProfileRequest = {
      businessName: values.businessName.trim(),
      description: values.description.trim()
    };

    this.isSavingSeller.set(true);

    this.profileService.updateProfile(request).subscribe({
      next: response => {
        this.updateProfileState(response.user);

        this.isSellerEditing.set(false);
        this.isSavingSeller.set(false);

        this.showToast(
          'Podaci prodavca su uspešno sačuvani.',
          'success'
        );
      },
      error: error => {
        this.isSavingSeller.set(false);
        this.handleProfileError(error);
      }
    });
  }

  openPasswordModal(): void {
    this.passwordForm.reset();

    this.showCurrentPassword.set(false);
    this.showNewPassword.set(false);
    this.showConfirmPassword.set(false);

    this.isPasswordModalOpen.set(true);
  }

  closePasswordModal(): void {
    if (this.isChangingPassword()) {
      return;
    }

    this.isPasswordModalOpen.set(false);
    this.passwordForm.reset();

    this.showCurrentPassword.set(false);
    this.showNewPassword.set(false);
    this.showConfirmPassword.set(false);
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const values = this.passwordForm.getRawValue();

    const request: ChangePasswordRequest = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword
    };

    this.isChangingPassword.set(true);

    this.profileService.changePassword(request).subscribe({
      next: () => {
        this.isPasswordModalOpen.set(false);
        this.passwordForm.reset();

        this.showCurrentPassword.set(false);
        this.showNewPassword.set(false);
        this.showConfirmPassword.set(false);

        this.authService.logout().subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: () => {
            this.router.navigate(['/login']);
          }
        });
      },
      error: error => {
        this.isChangingPassword.set(false);
        this.handlePasswordError(error);
      }
    });
  }

  deactivateAccount(): void {
    const confirmed = window.confirm(
      'Da li sigurno želiš da deaktiviraš nalog? Nakon toga ćeš biti odjavljen.'
    );

    if (!confirmed) {
      return;
    }

    this.isDeactivating.set(true);

    this.profileService.deactivateAccount().subscribe({
      next: () => {
        this.authService.logout().subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: () => {
            this.router.navigate(['/login']);
          }
        });
  },
  error: error => {
    this.isDeactivating.set(false);
    this.handleDeactivateError(error);
  }
});
  }

  toggleCurrentPassword(): void {
    this.showCurrentPassword.update(value => !value);
  }

  toggleNewPassword(): void {
    this.showNewPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }

  closeToast(): void {
    this.toastMessage.set('');

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = undefined;
    }
  }

  roleLabel(role: UserProfile['role']): string {
    return role === 'seller'
      ? 'Prodavac'
      : 'Kupac';
  }

  statusLabel(status: UserProfile['status']): string {
    const labels: Record<UserProfile['status'], string> = {
      active: 'Aktivan',
      suspended: 'Suspendovan',
      deactivated: 'Deaktiviran',
      banned: 'Banovan'
    };

    return labels[status];
  }

  approvalLabel(
    status: NonNullable<UserProfile['sellerProfile']>['approvalStatus']
  ): string {
    const labels = {
      pending: 'Na čekanju',
      approved: 'Odobren prodavac',
      rejected: 'Odbijen',
      suspended: 'Suspendovan'
    };

    return labels[status];
  }

  formattedDate(date: string): string {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Nije dostupno';
    }

    return new Intl.DateTimeFormat('sr-Latn-RS', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(parsedDate);
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.profileService.getProfile().subscribe({
      next: response => {
        this.updateProfileState(response.user);
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set(
          'Podaci profila trenutno nisu dostupni.'
        );

        this.isLoading.set(false);
      }
    });
  }

  private updateProfileState(user: UserProfile): void {
    this.profile.set(user);

    this.populatePersonalForm(user);
    this.populateSellerForm(user);

    this.authService.updateCurrentUser(user);
  }

  private populatePersonalForm(user: UserProfile): void {
    this.personalForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName
    });

    this.personalForm.markAsPristine();
    this.personalForm.markAsUntouched();
  }

  private populateSellerForm(user: UserProfile): void {
    this.sellerForm.setValue({
      businessName: user.sellerProfile?.businessName ?? '',
      description: user.sellerProfile?.description ?? ''
    });

    this.sellerForm.markAsPristine();
    this.sellerForm.markAsUntouched();
  }

  private showToast(
    message: string,
    type: ToastType
  ): void {
    this.toastMessage.set(message);
    this.toastType.set(type);

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toastMessage.set('');
      this.toastTimer = undefined;
    }, 4500);
  }

  private handleProfileError(
    error: HttpErrorResponse
  ): void {
    const response = error.error as ApiErrorBody | undefined;
    const code = response?.error?.code;

    if (code === 'VALIDATION_ERROR') {
      this.showToast(
        'Uneti podaci nisu ispravni.',
        'error'
      );

      return;
    }

    if (code === 'SELLER_PROFILE_NOT_FOUND') {
      this.showToast(
        'Profil prodavca nije pronađen.',
        'error'
      );

      return;
    }

    this.showToast(
      response?.error?.message ??
      'Izmena podataka trenutno nije uspela.',
      'error'
    );
  }

  private handlePasswordError(
    error: HttpErrorResponse
  ): void {
    const response = error.error as ApiErrorBody | undefined;
    const code = response?.error?.code;

    if (code === 'INVALID_CURRENT_PASSWORD') {
      this.showToast(
        'Trenutna lozinka nije ispravna.',
        'error'
      );

      return;
    }

    this.showToast(
      response?.error?.message ??
      'Promena lozinke trenutno nije uspela.',
      'error'
    );
  }

  private handleDeactivateError(
    error: HttpErrorResponse
  ): void {
    const response = error.error as ApiErrorBody | undefined;

    this.showToast(
      response?.error?.message ??
      'Deaktivacija naloga trenutno nije uspela.',
      'error'
    );
  }
}