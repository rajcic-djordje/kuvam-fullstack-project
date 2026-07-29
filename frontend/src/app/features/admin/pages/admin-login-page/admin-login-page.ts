import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ApiErrorResponse,
  LoginRequest
} from '../../../auth/models/auth';
import { AuthService } from '../../../auth/services/auth'


@Component({
  selector: 'app-admin-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login-page.html',
  styleUrl: './admin-login-page.css',
})

export class AdminLoginPage {

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
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


  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  login(): void {
    this.closeError();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      this.showError(
        'Proveri označena polja pre prijavljivanja.'
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
        this.router.navigateByUrl('/admin/dashboard');
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
      code === 'INVALID_CREDENTIALS' ||
      code === 'WRONG_PASSWORD' ||
      code === 'USER_NOT_FOUND'
    ) {
      this.showError(
        'Email adresa ili lozinka nisu ispravni.'
      );
      return;
    }

    if(
      code == 'ADMIN_ACCESS_REQUIRED'
    ) {
      this.showError(
        'Ovaj nalog nema administratorske privilegije.'
      )
    }

    if (
      code === 'ACCOUNT_DISABLED' ||
      code === 'USER_INACTIVE'
    ) {
      this.showError(
        'Ovaj nalog trenutno nije aktivan.'
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
      'Prijava trenutno nije uspela. Pokušaj ponovo.'
    );
}
}