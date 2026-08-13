import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
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
import { Router, RouterLink } from '@angular/router';
import {
  LucideDynamicIcon,
  LucideEye,
  LucideEyeOff,
  LucideLockKeyhole,
  LucideMail,
  LucideStore,
  LucideUser,
  LucideUsers
} from '@lucide/angular';
import {
  debounceTime,
  Subscription
} from 'rxjs';
import { FormDraftService } from '../../../../shared/services/form-draft';
import { ToastService } from '../../../../shared/services/toast';
import {
  ApiErrorResponse,
  RegisterRequest
} from '../../models/auth';
import { AuthService } from '../../services/auth';

const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password =
    control.get('password')?.value;

  const confirmPassword =
    control.get('confirmPassword')?.value;

  if (
    !password ||
    !confirmPassword
  ) {
    return null;
  }

  return password === confirmPassword
    ? null
    : {
        passwordsMismatch: true
      };
};

interface RegisterDraft {
  firstName: string;
  lastName: string;
  email: string;
  role: 'buyer' | 'seller';
  businessName: string;
  description: string;
}

@Component({
  selector: 'app-register-page',
  imports: [
    LucideDynamicIcon,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css'
})
export class RegisterPage
implements OnInit, OnDestroy {
  private readonly formBuilder =
    inject(FormBuilder);

  private readonly authService =
    inject(AuthService);

  private readonly formDraftService =
    inject(FormDraftService);

  private readonly toastService =
    inject(ToastService);

  private readonly router =
    inject(Router);

  private readonly draftKey =
    'register';

  private draftSubscription:
    Subscription | null = null;

  readonly buyerIcon =
    LucideUsers;

  readonly sellerIcon =
    LucideStore;

  readonly userIcon =
    LucideUser;

  readonly emailIcon =
    LucideMail;

  readonly lockIcon =
    LucideLockKeyhole;

  readonly showIcon =
    LucideEye;

  readonly hideIcon =
    LucideEyeOff;

  readonly isSubmitting =
    signal(false);

  readonly showPassword =
    signal(false);

  readonly showConfirmPassword =
    signal(false);

  readonly registerForm =
    this.formBuilder.nonNullable.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50)
          ]
        ],

        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50)
          ]
        ],

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
        ],

        confirmPassword: [
          '',
          [
            Validators.required
          ]
        ],

        role: [
          'buyer' as
            | 'buyer'
            | 'seller'
        ],

        businessName: [
          '',
          [
            Validators.maxLength(100)
          ]
        ],

        description: [
          '',
          [
            Validators.maxLength(500)
          ]
        ]
      },
      {
        validators:
          passwordsMatchValidator
      }
    );

  get isSeller(): boolean {
    return (
      this.registerForm
        .controls
        .role
        .value === 'seller'
    );
  }

  ngOnInit(): void {
    this.restoreDraft();
    this.startDraftPersistence();
  }

  ngOnDestroy(): void {
    this.draftSubscription
      ?.unsubscribe();
  }

  togglePassword(): void {
    this.showPassword.update(
      value => !value
    );
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(
      value => !value
    );
  }

  setRole(
    role: 'buyer' | 'seller'
  ): void {
    if (
      this.registerForm
        .controls
        .role
        .value === role
    ) {
      return;
    }

    this.applyRole(
      role,
      true
    );
  }

  register(): void {
    if (
      this.registerForm.invalid
    ) {
      this.registerForm
        .markAllAsTouched();

      this.toastService.error(
        'Proveri označena polja pre registracije.',
        'Registracija nije uspela'
      );

      return;
    }

    const values =
      this.registerForm
        .getRawValue();

    const request:
      RegisterRequest = {
        firstName:
          values.firstName.trim(),

        lastName:
          values.lastName.trim(),

        email:
          values.email
            .trim()
            .toLowerCase(),

        password:
          values.password,

        role:
          values.role
      };

    if (
      values.role === 'seller'
    ) {
      request.businessName =
        values.businessName.trim();

      const description =
        values.description.trim();

      if (description) {
        request.description =
          description;
      }
    }

    this.isSubmitting.set(true);

    this.authService
      .register(request)
      .subscribe({
        next: () => {
          this.formDraftService.clear(
            this.draftKey
          );

          this.router.navigate(
            ['/login'],
            {
              queryParams: {
                registered: true,
                email: request.email
              }
            }
          );
        },

        error: error => {
          this.handleError(error);

          this.isSubmitting.set(
            false
          );
        }
      });
  }

  private restoreDraft(): void {
    const draft =
      this.formDraftService
        .load<RegisterDraft>(
          this.draftKey
        );

    if (!draft) {
      return;
    }

    const role =
      draft.role === 'seller'
        ? 'seller'
        : 'buyer';

    this.applyRole(
      role,
      false
    );

    this.registerForm.patchValue(
      {
        firstName:
          draft.firstName ?? '',

        lastName:
          draft.lastName ?? '',

        email:
          draft.email ?? '',

        role,

        businessName:
          role === 'seller'
            ? draft.businessName ?? ''
            : '',

        description:
          role === 'seller'
            ? draft.description ?? ''
            : ''
      },
      {
        emitEvent: false
      }
    );

    this.registerForm
      .controls
      .password
      .setValue(
        '',
        {
          emitEvent: false
        }
      );

    this.registerForm
      .controls
      .confirmPassword
      .setValue(
        '',
        {
          emitEvent: false
        }
      );

    this.registerForm
      .markAsPristine();

    this.registerForm
      .markAsUntouched();
  }

  private startDraftPersistence(): void {
    this.draftSubscription =
      this.registerForm
        .valueChanges
        .pipe(
          debounceTime(250)
        )
        .subscribe(() => {
          const values =
            this.registerForm
              .getRawValue();

          const draft:
            RegisterDraft = {
              firstName:
                values.firstName,

              lastName:
                values.lastName,

              email:
                values.email,

              role:
                values.role,

              businessName:
                values.role === 'seller'
                  ? values.businessName
                  : '',

              description:
                values.role === 'seller'
                  ? values.description
                  : ''
            };

          this.formDraftService.save(
            this.draftKey,
            draft
          );
        });
  }

  private applyRole(
    role: 'buyer' | 'seller',
    clearSellerFields: boolean
  ): void {
    const businessNameControl =
      this.registerForm
        .controls
        .businessName;

    this.registerForm
      .controls
      .role
      .setValue(role);

    if (role === 'seller') {
      businessNameControl
        .addValidators([
          Validators.required,
          Validators.minLength(2)
        ]);
    } else {
      businessNameControl
        .clearValidators();

      businessNameControl
        .addValidators([
          Validators.maxLength(100)
        ]);

      if (clearSellerFields) {
        businessNameControl.setValue('');

        this.registerForm
          .controls
          .description
          .setValue('');
      }
    }

    businessNameControl
      .updateValueAndValidity();
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
      code ===
        'EMAIL_ALREADY_IN_USE' ||
      code ===
        'EMAIL_TAKEN'
    ) {
      this.toastService.error(
        'Nalog sa ovom email adresom već postoji.',
        'Registracija nije uspela'
      );

      return;
    }

    if (
      code ===
      'VALIDATION_ERROR'
    ) {
      this.toastService.error(
        'Proveri unete podatke i pokušaj ponovo.',
        'Registracija nije uspela'
      );

      return;
    }

    this.toastService.error(
      response?.error?.message ??
      'Registracija trenutno nije uspela. Pokušaj ponovo.',
      'Registracija nije uspela'
    );
  }
}