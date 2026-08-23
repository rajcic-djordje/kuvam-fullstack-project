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
import { ApiErrorService } from '../../../../shared/services/api-error';
import { FormDraftService } from '../../../../shared/services/form-draft';
import { ToastService } from '../../../../shared/services/toast';
import { LoginRequest } from '../../models/auth';
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
  private readonly apiErrorService = inject(ApiErrorService);
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
  readonly isReactivating = signal(false);
  readonly canReactivate = signal(false);
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

    this.canReactivate.set(false);
    this.isSubmitting.set(true);

    this.authService
      .login(this.getLoginRequest())
      .subscribe({
        next: () => {
          this.completeLogin();
        },

        error: error => {
          if (
            this.apiErrorService.getCode(error) ===
            'ACCOUNT_DEACTIVATED'
          ) {
            this.canReactivate.set(true);
          }

          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Prijava trenutno nije uspela. Pokušaj ponovo.'
            ),
            'Prijava nije uspela'
          );

          this.isSubmitting.set(false);
        }
      });
  }

  reactivateAccount(): void {
    if (
      !this.canReactivate() ||
      this.isReactivating()
    ) {
      return;
    }

    this.isReactivating.set(true);

    this.authService
      .reactivate(this.getLoginRequest())
      .subscribe({
        next: () => {
          this.toastService.success(
            'Nalog je uspešno reaktiviran.',
            'Dobro došao nazad'
          );

          this.completeLogin();
        },

        error: error => {
          this.toastService.error(
            this.apiErrorService.getMessage(
              error,
              'Nalog trenutno nije moguće reaktivirati. Pokušaj ponovo.'
            ),
            'Reaktivacija nije uspela'
          );

          this.isReactivating.set(false);
        }
      });
  }

  private getLoginRequest(): LoginRequest {
    const values =
      this.loginForm.getRawValue();

    return {
      email:
        values.email
          .trim()
          .toLowerCase(),

      password:
        values.password
    };
  }

  private completeLogin(): void {
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
          this.canReactivate.set(false);

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
}