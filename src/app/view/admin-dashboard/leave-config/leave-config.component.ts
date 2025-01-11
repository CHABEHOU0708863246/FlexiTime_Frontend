import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/User';
import { UsersService } from '../../../core/services/users/users.service';
import { AuthService } from '../../../core/services/auth/auth.service';

/**
 * Component pour configurer les congés
 */
@Component({
  selector: 'app-leave-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './leave-config.component.html',
  styleUrl: './leave-config.component.scss'
})
export class LeaveConfigComponent {
  // Liste des utilisateurs
  users: User[] = [];
  filteredUsers: User[] = []; // Utilisateurs filtrés
  displayedUsers: User[] = []; // Utilisateurs affichés

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0; // Nombre total d'éléments
  totalPages = 0; // Nombre total de pages

  // États des menus
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;

  // Utilisateur connecté
  user: User | null = null;

  // Recherche
  searchTerm: string = '';

  constructor(
    private router: Router,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  /**
   * Initialiser le component
   */
  ngOnInit(): void {
    this.getUsers();
    this.getUserDetails();
  }

  /**
   * Basculer le menu utilisateur
   */
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  /**
   * Basculer le menu congés
   */
  toggleLeaveMenu() {
    this.isLeaveMenuOpen = !this.isLeaveMenuOpen;
  }

  /**
   * Basculer le menu rapports
   */
  toggleReportMenu() {
    this.isReportMenuOpen = !this.isReportMenuOpen;
  }

  /**
   * Récupérer les détails de l'utilisateur connecté
   */
  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
  }

  /**
   * Charger tous les utilisateurs
   */
  getUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.totalItems = data.length;
      },
      error: (error) => {
        console.error("Erreur lors du chargement des utilisateurs", error);
      }
    });
  }

  /**
   * Déconnecter l'utilisateur et rediriger vers la page de connexion
   */
  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.authService.logout();
    }
    this.router.navigate(['/auth/login']);
  }
}
