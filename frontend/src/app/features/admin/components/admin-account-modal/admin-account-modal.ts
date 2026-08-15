import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  signal
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideDynamicIcon,
  LucideLockKeyhole,
  LucideUserRound,
  LucideX,
  type LucideIcon
} from '@lucide/angular';
import {
  debounceTime,
  finalize,
  Subscription,
  switchMap
} from 'rxjs';
import { ApiErrorService } from '../../../../shared/services/api-error';
import { FormDraftService } from '../../../../shared/services/form-draft';
import { ToastService } from '../../../../shared/services/toast';
import { AuthService } from '../../../auth/services/auth';
import { AdminAccountService } from '../../services/admin-account';

interface AdminProfileDraft {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-admin-account-modal',
  imports: [
    ReactiveFormsModule,
    LucideDynamicIcon
  ],
  templateUrl: './admin-account-modal.html',
  styleUrl: './admin-account-modal.css'
})
export class AdminAccountModal
  implements OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly adminAccountService = inject(AdminAccountService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly formDraftService = inject(FormDraftService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  private profileDraftSubscription: Subscription | null = null;

  readonly isProfileSubmitting = signal(false);
  readonly isPasswordSubmitting = signal(false);
  readonly showCurrentPassword = signal(false);
  readonly showNewPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly closeIcon: LucideIcon = LucideX;
  readonly profileIcon: LucideIcon = LucideUserRound;
  readonly passwordIcon: LucideIcon = LucideLockKeyhole;

  readonly profileForm = this.formBuilder.nonNullable.group({
    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(
          /^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u
        )
      ]
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(
          /^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u
        )
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
      validators: [
        this.passwordsMatchValidator,
        this.newPasswordDifferentValidator
      ]
    }
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.populateProfileForm();
      this.restoreProfileDraft();
      this.startProfileDraftPersistence();

      this.passwordForm.reset();

      this.resetPasswordVisibility();

      document.body.classList.add('modal-open');
    }

    if (changes['isOpen']?.currentValue === false) {
      this.stopProfileDraftPersistence();

      document.body.classList.remove('modal-open');
    }
  }

  ngOnDestroy(): void {
    this.stopProfileDraftPersistence();

    document.body.classList.remove('modal-open');
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (
      this.isOpen &&
      !this.isSubmitting()
    ) {
      this.close();
    }
  }

  close(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.stopProfileDraftPersistence();

    document.body.classList.remove('modal-open');

    this.passwordForm.reset();
    this.resetPasswordVisibility();

    this.closed.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  submitProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isProfileSubmitting.set(true);

    this.adminAccountService
      .updateProfile(this.profileForm.getRawValue())
      .pipe(
        switchMap(() => {
          return this.authService.refreshSession();
        }),
        finalize(() => {
          this.isProfileSubmitting.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.stopProfileDraftPersistence();

          this.formDraftService.clear(
            this.getProfileDraftKey()
          );

          this.populateProfileForm();
          this.startProfileDraftPersistence();

          this.toastService.success(
            'Ime i prezime su uspešno sačuvani.'
          );
        },

        error: error => {
          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Čuvanje podataka nije uspelo.'
            )
          );
        }
      });
  }

  submitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const {
      currentPassword,
      newPassword
    } = this.passwordForm.getRawValue();

    this.isPasswordSubmitting.set(true);

    this.adminAccountService
      .changePassword({
        currentPassword,
        newPassword
      })
      .pipe(
        finalize(() => {
          this.isPasswordSubmitting.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.passwordForm.reset();
          this.resetPasswordVisibility();

          this.stopProfileDraftPersistence();

          document.body.classList.remove('modal-open');

          this.authService.logout().subscribe({
            next: () => {
              this.router.navigate(['/admin/login']);
            },
            error: () => {
              this.router.navigate(['/admin/login']);
            }
          });
        },

        error: error => {
          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Promena lozinke nije uspela.'
            )
          );
        }
      });
  }

  toggleCurrentPassword(): void {
    this.showCurrentPassword.update(
      value => !value
    );
  }

  toggleNewPassword(): void {
    this.showNewPassword.update(
      value => !value
    );
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(
      value => !value
    );
  }

  private populateProfileForm(): void {
    const user = this.authService.currentUser();

    if (!user) {
      return;
    }

    this.profileForm.reset({
      firstName: user.firstName,
      lastName: user.lastName
    });
  }

  private restoreProfileDraft(): void {
    const draft =
      this.formDraftService.load<AdminProfileDraft>(
        this.getProfileDraftKey()
      );

    if (!draft) {
      return;
    }

    this.profileForm.patchValue(
      {
        firstName: draft.firstName ?? '',
        lastName: draft.lastName ?? ''
      },
      {
        emitEvent: false
      }
    );
  }

  private startProfileDraftPersistence(): void {
    this.stopProfileDraftPersistence();

    this.profileDraftSubscription =
      this.profileForm.valueChanges
        .pipe(
          debounceTime(250)
        )
        .subscribe(() => {
          const values =
            this.profileForm.getRawValue();

          this.formDraftService.save(
            this.getProfileDraftKey(),
            {
              firstName: values.firstName,
              lastName: values.lastName
            } satisfies AdminProfileDraft
          );
        });
  }

  private stopProfileDraftPersistence(): void {
    this.profileDraftSubscription?.unsubscribe();

    this.profileDraftSubscription = null;
  }

  private getProfileDraftKey(): string {
    const user = this.authService.currentUser();

    return user
      ? `admin-account-profile:${user.id}`
      : 'admin-account-profile';
  }

  private passwordsMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const newPassword =
      control.get('newPassword')?.value;

    const confirmPassword =
      control.get('confirmPassword')?.value;

    if (
      !newPassword ||
      !confirmPassword
    ) {
      return null;
    }

    return newPassword === confirmPassword
      ? null
      : {
          passwordsMismatch: true
        };
  }

  private newPasswordDifferentValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const currentPassword =
      control.get('currentPassword')?.value;

    const newPassword =
      control.get('newPassword')?.value;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return null;
    }

    return currentPassword !== newPassword
      ? null
      : {
          samePassword: true
        };
  }

  private isSubmitting(): boolean {
    return (
      this.isProfileSubmitting() ||
      this.isPasswordSubmitting()
    );
  }

  private resetPasswordVisibility(): void {
    this.showCurrentPassword.set(false);
    this.showNewPassword.set(false);
    this.showConfirmPassword.set(false);
  }
}