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
import { ApiErrorService } from '../../../../shared/services/api-error';
import { FormDraftService } from '../../../../shared/services/form-draft';
import { ToastService } from '../../../../shared/services/toast';
import { LoginRequest } from '../../../auth/models/auth';
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
  private readonly apiErrorService = inject(ApiErrorService);
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
}