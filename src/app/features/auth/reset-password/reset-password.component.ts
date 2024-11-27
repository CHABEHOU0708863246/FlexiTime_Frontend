import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from 'express';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onResetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const { email } = this.resetPasswordForm.value;
    this.authService.resetPassword(email).subscribe({
      next: () => {
        this.successMessage = 'Un email de réinitialisation du mot de passe a été envoyé.';
        this.resetPasswordForm.reset();
      },
      error: (error) => {
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        console.error('Erreur lors de la réinitialisation du mot de passe', error);
      }
    });
  }
}
