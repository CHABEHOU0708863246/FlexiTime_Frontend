import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/User';
import { UsersService } from '../../../core/services/users/users.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-users-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './users-create.component.html',
  styleUrl: './users-create.component.scss'
})
export class UsersCreateComponent {
  users: User[] = [];
  userForm: FormGroup;
  availableRoles: string[] = ['admin', 'employe', 'manager'];

  user: User | null = null;

  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;

  constructor(
    private router: Router,
    private usersService: UsersService ,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      isEnabled: [true],
      workingHours: [0],
      roles: [[], Validators.required],
      isPartTime: [false],
      hireDate: ['', Validators.required]
    });
  }


  initializeForm(): void {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      isEnabled: [true],
      workingHours: [0],
      roles: [[], Validators.required],
      isPartTime: [false],
      hireDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getUserDetails();
    this.initializeForm();
  }


  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
  }

  getUsers(): void {
    this.usersService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error("Erreur lors du chargement des utilisateurs", error);
      }
    );
  }


  onSubmit(): void {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      this.usersService.registerUser(user).subscribe(
        (response) => {
          console.log("Utilisateur créé avec succès", response);
          this.userForm.reset();
          this.getUsers();

          // Afficher le message de succès avec SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Succès!',
            text: 'Utilisateur créé avec succès!',
            confirmButtonText: 'Ok'
          });
        },
        (error) => {
          console.error("Erreur lors de la création de l'utilisateur", error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur!',
            text: 'Erreur lors de la création de l\'utilisateur.',
            confirmButtonText: 'Ok'
          });
        }
      );
    } else {
      console.log("Le formulaire est invalide");
    }
  }


  onReset(): void {
    this.userForm.reset();
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleLeaveMenu() {
    this.isLeaveMenuOpen = !this.isLeaveMenuOpen;
  }

  toggleAttendanceMenu() {
    this.isAttendanceMenuOpen = !this.isAttendanceMenuOpen;
  }

  toggleReportMenu() {
    this.isReportMenuOpen = !this.isReportMenuOpen;
  }

  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.authService.logout();
    }
    this.router.navigate(['/auth/login']);
  }
}
