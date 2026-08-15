import {
  Component,
  inject,
  OnDestroy,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';
import {
  LucideDynamicIcon,
  LucideEye,
  LucideEyeOff,
  LucideKeyRound,
  LucideLockKeyhole,
  LucideMail
} from '@lucide/angular';
import { ApiErrorService } from '../../../../shared/services/api-error';
import { ToastService } from '../../../../shared/services/toast';
import {
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../../models/auth';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-forgot-password-page',
  imports: [
    LucideDynamicIcon,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password-page.html',
  styleUrls: [
    '../login-page/login-page.css',
    './forgot-password-page.css'
  ]
})
export class ForgotPasswordPage implements OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  private resendTimer: ReturnType<typeof setInterval> | null = null;

  readonly emailIcon = LucideMail;
  readonly codeIcon = LucideKeyRound;
  readonly lockIcon = LucideLockKeyhole;
  readonly showIcon = LucideEye;
  readonly hideIcon = LucideEyeOff;

  readonly codeSent = signal(false);
  readonly isSubmitting = signal(false);
  readonly isResending = signal(false);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly resendSeconds = signal(0);

  readonly emailForm = this.formBuilder.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ]
  });

  readonly resetForm = this.formBuilder.nonNullable.group({
    code: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]
    ],
    password: [
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
  });

  ngOnDestroy(): void {
    this.clearResendTimer();
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }

  sendCode(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();

      this.toastService.error(
        'Unesi ispravnu email adresu.',
        'Kod nije poslat'
      );

      return;
    }

    const request: ForgotPasswordRequest = {
      email: this.normalizedEmail()
    };

    this.isSubmitting.set(true);

    this.authService
      .forgotPassword(request)
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.codeSent.set(true);
          this.startResendCooldown();

          this.toastService.success(
            'Ako nalog sa ovom email adresom postoji, kod za promenu lozinke je poslat.',
            'Proveri email'
          );
        },
        error: error => {
          this.isSubmitting.set(false);

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Kod trenutno nije moguće poslati. Pokušaj ponovo.'
            ),
            'Kod nije poslat'
          );
        }
      });
  }

  resendCode(): void {
    if (
      this.isResending() ||
      this.resendSeconds() > 0
    ) {
      return;
    }

    const request: ForgotPasswordRequest = {
      email: this.normalizedEmail()
    };

    this.isResending.set(true);

    this.authService
      .forgotPassword(request)
      .subscribe({
        next: () => {
          this.isResending.set(false);
          this.startResendCooldown();

          this.toastService.success(
            'Ako nalog sa ovom email adresom postoji, novi kod je poslat.',
            'Kod poslat'
          );
        },
        error: error => {
          this.isResending.set(false);

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Novi kod trenutno nije moguće poslati. Pokušaj ponovo.'
            ),
            'Kod nije poslat'
          );
        }
      });
  }

  resetPassword(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();

      this.toastService.error(
        'Proveri označena polja pre promene lozinke.',
        'Lozinka nije promenjena'
      );

      return;
    }

    const values = this.resetForm.getRawValue();

    if (values.password !== values.confirmPassword) {
      this.resetForm.controls.confirmPassword.markAsTouched();

      this.toastService.error(
        'Lozinke se ne podudaraju.',
        'Lozinka nije promenjena'
      );

      return;
    }

    const request: ResetPasswordRequest = {
      email: this.normalizedEmail(),
      code: values.code,
      password: values.password
    };

    this.isSubmitting.set(true);

    this.authService
      .resetPassword(request)
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.clearResendTimer();

          this.toastService.success(
            'Lozinka je uspešno promenjena. Sada možeš da se prijaviš.',
            'Lozinka promenjena'
          );

          this.router.navigate(
            ['/login'],
            {
              queryParams: {
                email: this.normalizedEmail()
              }
            }
          );
        },
        error: error => {
          this.isSubmitting.set(false);

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Lozinku trenutno nije moguće promeniti. Pokušaj ponovo.'
            ),
            'Lozinka nije promenjena'
          );
        }
      });
  }

  changeEmail(): void {
    this.codeSent.set(false);
    this.resetForm.reset();
    this.clearResendTimer();
    this.resendSeconds.set(0);
  }

  passwordsMismatch(): boolean {
    const confirmPassword =
      this.resetForm.controls.confirmPassword;

    return (
      confirmPassword.touched &&
      confirmPassword.value.length > 0 &&
      this.resetForm.controls.password.value !==
      confirmPassword.value
    );
  }

  private normalizedEmail(): string {
    return this.emailForm.controls.email.value
      .trim()
      .toLowerCase();
  }

  private startResendCooldown(): void {
    this.clearResendTimer();
    this.resendSeconds.set(60);

    this.resendTimer = setInterval(() => {
      const seconds = this.resendSeconds();

      if (seconds <= 1) {
        this.resendSeconds.set(0);
        this.clearResendTimer();

        return;
      }

      this.resendSeconds.set(seconds - 1);
    }, 1000);
  }

  private clearResendTimer(): void {
    if (!this.resendTimer) {
      return;
    }

    clearInterval(this.resendTimer);
    this.resendTimer = null;
  }
}