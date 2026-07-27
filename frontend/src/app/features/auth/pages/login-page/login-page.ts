import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ApiErrorResponse,
  LoginRequest
} from '../../models/auth';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
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
    const registered =
      this.route.snapshot.queryParamMap.get('registered');

    const email =
      this.route.snapshot.queryParamMap.get('email');

    if (registered === 'true') {
      this.successMessage.set(
        'Nalog je uspešno kreiran. Sada se prijavi.'
      );
    }

    if (email) {
      this.loginForm.controls.email.setValue(email);
    }
  }

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

    this.authService.login(request).subscribe({
      next: () => {
        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

        this.router.navigateByUrl(returnUrl);
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