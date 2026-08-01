import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
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
  LucideX,
  type LucideIcon
} from '@lucide/angular';
import {
  finalize,
  switchMap
} from 'rxjs';
import { AuthService } from '../../../auth/services/auth';
import { AdminAccountService } from '../../services/admin-account';

@Component({
  selector: 'app-admin-account-modal',
  imports: [
    ReactiveFormsModule,
    LucideDynamicIcon
  ],
  templateUrl: './admin-account-modal.html',
  styleUrl: './admin-account-modal.css'
})
export class AdminAccountModal implements OnChanges {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly adminAccountService = inject(AdminAccountService);
  private readonly router = inject(Router);

  readonly isProfileSubmitting = signal(false);
  readonly isPasswordSubmitting = signal(false);

  readonly profileSuccessMessage = signal('');
  readonly profileErrorMessage = signal('');
  readonly passwordErrorMessage = signal('');

  readonly showCurrentPassword = signal(false);
  readonly showNewPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly closeIcon: LucideIcon = LucideX;

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
      this.passwordForm.reset();
      this.resetMessages();
      this.resetPasswordVisibility();

      document.body.classList.add('modal-open');
    }

    if (changes['isOpen']?.currentValue === false) {
      document.body.classList.remove('modal-open');
    }
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

    document.body.classList.remove('modal-open');

    this.passwordForm.reset();
    this.resetMessages();
    this.resetPasswordVisibility();

    this.closed.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  submitProfile(): void {
    this.profileSuccessMessage.set('');
    this.profileErrorMessage.set('');

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
          this.populateProfileForm();

          this.profileSuccessMessage.set(
            'Ime i prezime su uspešno sačuvani.'
          );
        },
        error: error => {
          this.profileErrorMessage.set(
            this.getErrorMessage(
              error,
              'Čuvanje podataka nije uspelo.'
            )
          );
        }
      });
  }

  submitPassword(): void {
    this.passwordErrorMessage.set('');

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
          this.passwordErrorMessage.set(
            this.getErrorMessage(
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

  private resetMessages(): void {
    this.profileSuccessMessage.set('');
    this.profileErrorMessage.set('');
    this.passwordErrorMessage.set('');
  }

  private resetPasswordVisibility(): void {
    this.showCurrentPassword.set(false);
    this.showNewPassword.set(false);
    this.showConfirmPassword.set(false);
  }

  private getErrorMessage(
    error: unknown,
    fallbackMessage: string
  ): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'error' in error
    ) {
      const response = error as {
        error?: {
          message?: string;
        };
      };

      if (response.error?.message) {
        return response.error.message;
      }
    }

    return fallbackMessage;
  }
}