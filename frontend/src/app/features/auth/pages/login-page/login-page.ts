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
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import {
  LucideDynamicIcon,
  LucideEye,
  LucideEyeOff,
  LucideLockKeyhole,
  LucideMail
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
} from '../../models/auth';
import { AuthService } from '../../services/auth';

interface LoginDraft {
  email: string;
}

@Component({
  selector: 'app-login-page',
  imports: [
    LucideDynamicIcon,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly formDraftService = inject(FormDraftService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly draftKey = 'login';
  private draftSubscription: Subscription | null = null;

  readonly emailIcon = LucideMail;
  readonly lockIcon = LucideLockKeyhole;
  readonly showIcon = LucideEye;
  readonly hideIcon = LucideEyeOff;

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

    const registered =
      this.route.snapshot.queryParamMap.get('registered');

    const email =
      this.route.snapshot.queryParamMap.get('email');

    if (registered === 'true') {
      this.toastService.success(
        'Nalog je uspešno kreiran. Sada se prijavi.',
        'Registracija uspešna'
      );
    }

    if (email) {
      this.loginForm.controls.email.setValue(
        email
      );
    }

    this.startDraftPersistence();
  }

  ngOnDestroy(): void {
    this.draftSubscription?.unsubscribe();
  }

  togglePassword(): void {
    this.showPassword.update(
      value => !value
    );
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

    const values =
      this.loginForm.getRawValue();

    const request: LoginRequest = {
      email:
        values.email
          .trim()
          .toLowerCase(),

      password:
        values.password
    };

    this.isSubmitting.set(true);

    this.authService
      .login(request)
      .subscribe({
        next: () => {
          this.formDraftService.clear(
            this.draftKey
          );

          const returnUrl =
            this.route.snapshot.queryParamMap.get(
              'returnUrl'
            ) ?? '/';

          this.router.navigateByUrl(
            returnUrl
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
      this.formDraftService.load<LoginDraft>(
        this.draftKey
      );

    if (!draft) {
      return;
    }

    this.loginForm.controls.email.setValue(
      draft.email ?? ''
    );
  }

  private startDraftPersistence(): void {
    this.draftSubscription =
      this.loginForm.valueChanges
        .pipe(
          debounceTime(250)
        )
        .subscribe(() => {
          const email =
            this.loginForm.controls.email.value;

          const draft: LoginDraft = {
            email
          };

          this.formDraftService.save(
            this.draftKey,
            draft
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