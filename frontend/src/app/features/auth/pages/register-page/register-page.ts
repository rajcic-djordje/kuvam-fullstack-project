import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
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
  ApiErrorResponse,
  RegisterRequest
} from '../../models/auth';
import { AuthService } from '../../services/auth';

const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword
    ? null
    : { passwordsMismatch: true };
};

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css'
})
export class RegisterPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }


  readonly registerForm = this.formBuilder.nonNullable.group(
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
      role: ['buyer' as 'buyer' | 'seller'],
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
      validators: passwordsMatchValidator
    }
  );

  get isSeller(): boolean {
    return this.registerForm.controls.role.value === 'seller';
  }

  setRole(role: 'buyer' | 'seller'): void {
    const businessNameControl =
      this.registerForm.controls.businessName;

    this.registerForm.controls.role.setValue(role);
    this.closeError();

    if (role === 'seller') {
      businessNameControl.addValidators([
        Validators.required,
        Validators.minLength(2)
      ]);
    } else {
      businessNameControl.clearValidators();
      businessNameControl.setValue('');
      this.registerForm.controls.description.setValue('');
    }

    businessNameControl.updateValueAndValidity();
  }

  register(): void {
    this.closeError();

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      this.showError(
        'Proveri označena polja pre registracije.'
      );

      return;
    }

    

    const values = this.registerForm.getRawValue();

    const request: RegisterRequest = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      role: values.role
    };

    if (values.role === 'seller') {
      request.businessName = values.businessName.trim();

      const description = values.description.trim();

      if (description) {
        request.description = description;
      }
    }

    this.isSubmitting.set(true);

    this.authService.register(request).subscribe({
      next: () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true,
            email: request.email
          }
        });
      },
      error: error => {
        this.handleError(error);
        this.isSubmitting.set(false);
      }
    });
  }

  closeError(): void {
    this.errorMessage.set('');

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = undefined;
    }
  }

  private showError(message: string): void {
    this.errorMessage.set(message);

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.errorMessage.set('');
      this.toastTimer = undefined;
    }, 4500);
  }

  private handleError(error: HttpErrorResponse): void {
    const response =
      error.error as ApiErrorResponse | undefined;

    const code = response?.error?.code;

    if (
      code === 'EMAIL_ALREADY_IN_USE' ||
      code === 'EMAIL_TAKEN'
    ) {
      this.showError(
        'Nalog sa ovom email adresom već postoji.'
      );
      return;
    }

    if (code === 'VALIDATION_ERROR') {
      this.showError(
        'Proveri unete podatke i pokušaj ponovo.'
      );
      return;
    }

    this.showError(
      response?.error?.message ??
      'Registracija trenutno nije uspela. Pokušaj ponovo.'
    );
  }
}