import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast/toast.service';
import { ToastComponent } from '../../../core/components/toast/toast.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastComponent ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'info' = 'error';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
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
    // Vérification de la validité du formulaire
    if (this.loginForm.invalid) {
      this.toastService.show('Veuillez remplir correctement tous les champs', 'error');
      return;
    }

    // Activation du chargement et réinitialisation des erreurs
    this.isLoading = true;
    this.errorMessage = null;

    // Récupération des valeurs du formulaire
    const { email, password } = this.loginForm.value;

    // Vérification de l'environnement du navigateur
    if (typeof window !== 'undefined' && window.localStorage) {
      this.authService.login(email, password).subscribe({
        next: (response) => {
          const userRole = this.authService.getUserRole();

          // Vérifier si la connexion est vraiment réussie
          if (!userRole) {
            this.toastService.show('Email ou mot de passe incorrect', 'error');
            this.isLoading = false;
            return;
          }

          // Si on a un rôle valide, on procède à la navigation
          setTimeout(() => {
            switch (userRole.toLowerCase()) {
              case 'admin':
                this.router.navigate(['/admin/dashboard']);
                this.toastService.show('Connexion réussie', 'success');
                break;
              case 'manager':
                this.router.navigate(['/manager/dashboard']);
                this.toastService.show('Connexion réussie', 'success');
                break;
              case 'employe':
                this.router.navigate(['/employe/dashboard']);
                this.toastService.show('Connexion réussie', 'success');
                break;
              default:
                this.toastService.show('Rôle utilisateur non reconnu', 'error');
                this.router.navigate(['/']);
            }
            this.isLoading = false;
          }, 1000);
        },
        error: (error) => {
          console.error('Erreur de connexion', error);
          this.errorMessage = 'Une erreur s\'est produite lors du processus de connexion.';
          this.toastService.show('Email ou mot de passe incorrect', 'error');
          this.isLoading = false;
        }
      });
    } else {
      console.warn('Not running in a browser environment');
      this.errorMessage = 'Veuillez utiliser un navigateur pour vous connecter.';
      this.toastService.show('Environnement non supporté', 'error');
      this.isLoading = false;
    }
  }




}
