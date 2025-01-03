import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  navigateToResetPassword(): void {
    this.router.navigate(['/reset-password']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true; // Activer le chargement
    this.errorMessage = null; // Réinitialiser les erreurs

    const { email, password } = this.loginForm.value;

    if (typeof window !== 'undefined' && window.localStorage) {
      this.authService.login(email, password).subscribe({
        next: (response) => {
          setTimeout(() => {
            const userRole = this.authService.getUserRole();

            switch (userRole?.toLowerCase()) {
              case 'admin':
                this.router.navigate(['/admin/dashboard']);
                break;
              case 'manager':
                this.router.navigate(['/manager/dashboard']);
                break;
              case 'employe':
                this.router.navigate(['/employe/dashboard']);
                break;
              default:
                this.router.navigate(['/']);
            }
            this.isLoading = false; // Désactiver le chargement après navigation
          }, 1000);
        },
        error: (error) => {
          console.error('Erreur de connexion', error);
          this.errorMessage = 'Une erreur s\'est produite lors du processus de connexion.';
          this.isLoading = false; // Désactiver le chargement en cas d'erreur
        }
      });
    } else {
      console.warn('Not running in a browser environment');
      this.errorMessage = 'Veuillez utiliser un navigateur pour vous connecter.';
      this.isLoading = false; // Désactiver le chargement
    }
  }



}
