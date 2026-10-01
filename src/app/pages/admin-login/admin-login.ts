import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';

import { AdminAuthService } from '../../shared/auth/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLogin {
  private static readonly portalUrl = 'https://online.pnmc.org.pk';

  private readonly auth = inject(AdminAuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly submitting = signal(false);
  protected readonly error = signal('');
  protected readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected async submit(): Promise<void> {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email, password);
      window.location.href = `${AdminLogin.portalUrl}/admin`;
    } catch (error: unknown) {
      this.error.set(messageFor(error));
    } finally {
      this.submitting.set(false);
    }
  }
}

function messageFor(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
    return 'Email or password is incorrect.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Sign in could not be completed. Please try again.';
}
