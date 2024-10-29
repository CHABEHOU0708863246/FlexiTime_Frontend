import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm!: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Réponse de login:', response); // Pour le debugging

        // Attendre un peu pour que le token soit bien enregistré
        setTimeout(() => {
          const userRole = this.authService.getUserRole();
          console.log('Rôle utilisateur:', userRole); // Pour le debugging

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
              console.warn('Rôle non reconnu:', userRole);
              this.router.navigate(['/auth/login']);
          }
        }, 100);
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
      }
    });
  }

}
