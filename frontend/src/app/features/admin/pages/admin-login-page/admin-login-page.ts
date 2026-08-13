import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
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
  LucideLockKeyhole,
  LucideMail,
  LucideShieldCheck,
  type LucideIcon
} from '@lucide/angular';
import {
  debounceTime,
  Subscription
} from 'rxjs';
import { FormDraftService } from '../../../../shared/services/form-draft';
import { ToastService } from '../../../../shared/services/toast';
import {
  ApiErrorResponse,
  LoginRequest
} from '../../../auth/models/auth';
import { AuthService } from '../../../auth/services/auth';

interface AdminLoginDraft {
  email: string;
}

@Component({
  selector: 'app-admin-login-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideDynamicIcon
  ],
  templateUrl: './admin-login-page.html',
  styleUrl: './admin-login-page.css'
})
export class AdminLoginPage implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly formDraftService = inject(FormDraftService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  private readonly draftKey = 'admin-login';

  private draftSubscription: Subscription | null = null;

  readonly emailIcon: LucideIcon = LucideMail;
  readonly lockIcon: LucideIcon = LucideLockKeyhole;
  readonly showIcon: LucideIcon = LucideEye;
  readonly hideIcon: LucideIcon = LucideEyeOff;
  readonly adminIcon: LucideIcon = LucideShieldCheck;

  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ]
  });

  ngOnInit(): void {
    this.restoreDraft();
    this.startDraftPersistence();
  }

  ngOnDestroy(): void {
    this.draftSubscription?.unsubscribe();
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      this.toastService.error(
        'Proveri označena polja pre prijavljivanja.',
        'Prijava nije uspela'
      );

      return;
    }

    const values = this.loginForm.getRawValue();

    const request: LoginRequest = {
      email: values.email.trim().toLowerCase(),
      password: values.password
    };

    this.isSubmitting.set(true);

    this.authService.loginAdmin(request).subscribe({
      next: () => {
        this.formDraftService.clear(this.draftKey);

        this.router.navigateByUrl(
          '/admin/dashboard'
        );
      },

      error: error => {
        this.handleError(error);
        this.isSubmitting.set(false);
      }
    });
  }

  private restoreDraft(): void {
    const draft =
      this.formDraftService.load<AdminLoginDraft>(
        this.draftKey
      );

    if (!draft) {
      return;
    }

    this.loginForm.controls.email.setValue(
      draft.email ?? '',
      {
        emitEvent: false
      }
    );
  }

  private startDraftPersistence(): void {
    this.draftSubscription =
      this.loginForm.valueChanges
        .pipe(
          debounceTime(250)
        )
        .subscribe(() => {
          this.formDraftService.save(
            this.draftKey,
            {
              email:
                this.loginForm.controls.email.value
            } satisfies AdminLoginDraft
          );
        });
  }

  private handleError(
    error: HttpErrorResponse
  ): void {
    const response =
      error.error as
        | ApiErrorResponse
        | undefined;

    const code =
      response?.error?.code;

    if (
      code === 'INVALID_CREDENTIALS' ||
      code === 'WRONG_PASSWORD' ||
      code === 'USER_NOT_FOUND'
    ) {
      this.toastService.error(
        'Email adresa ili lozinka nisu ispravni.',
        'Prijava nije uspela'
      );

      return;
    }

    if (code === 'ADMIN_ACCESS_REQUIRED') {
      this.toastService.error(
        'Ovaj nalog nema administratorske privilegije.',
        'Prijava nije uspela'
      );

      return;
    }

    if (
      code === 'ACCOUNT_DISABLED' ||
      code === 'USER_INACTIVE'
    ) {
      this.toastService.error(
        'Ovaj nalog trenutno nije aktivan.',
        'Prijava nije uspela'
      );

      return;
    }

    if (code === 'VALIDATION_ERROR') {
      this.toastService.error(
        'Proveri unete podatke i pokušaj ponovo.',
        'Prijava nije uspela'
      );

      return;
    }

    this.toastService.error(
      response?.error?.message ??
      'Prijava trenutno nije uspela. Pokušaj ponovo.',
      'Prijava nije uspela'
    );
  }
}