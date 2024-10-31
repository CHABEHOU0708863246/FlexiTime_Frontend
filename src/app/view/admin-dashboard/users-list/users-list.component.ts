import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/User';
import { UsersService } from '../../../core/services/users/users.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  users: User[] = [];
  filteredUsers: User[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;
  user: User | null = null;
  searchTerm: string = '';

  constructor(private router: Router, private usersService: UsersService , private authService: AuthService) {}

  ngOnInit(): void {
    this.getUsers();
    this.getUserDetails();
  }

  // Méthode pour filtrer les utilisateurs
  filterUsers(): void {
    if (this.searchTerm) {
      this.filteredUsers = this.users.filter(user =>
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredUsers = this.users;
    }
  }

  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
  }

  getUsers(): void {
    this.usersService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      (error) => {
        console.error("Erreur lors du chargement des utilisateurs", error);
      }
    );
  }

  // Méthodes pour la pagination
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage); // Retourne les utilisateurs pour la page actuelle
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return; // Ne pas changer si la page est hors limites
    this.currentPage = page;
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

  toggleAccount(user: User): void {
    this.usersService.toggleUserAccount(user.id).subscribe(
      (response) => {
        // Mettre à jour l’état local de l’utilisateur après la bascule
        user.isEnabled = !user.isEnabled;
        console.log(`L'état de l'utilisateur ${user.id} a été basculé`);
      },
      (error) => {
        console.error("Erreur lors de la bascule de l'utilisateur", error);
      }
    );
  }
}

