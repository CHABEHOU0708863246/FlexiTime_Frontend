import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LeaveStatusSummary } from '../../../core/models/LeaveStatusSummary';
import { User } from '../../../core/models/User';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersService } from '../../../core/services/users/users.service';
import { LeaveBalancesService } from '../../../core/services/leaveBalances/leave-balances.service';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-settings-fexitime',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './settings-fexitime.component.html',
  styleUrl: './settings-fexitime.component.scss'
})
export class SettingsFexitimeComponent implements OnInit{

  constructor(
      private router: Router, // Service pour la navigation entre les routes.
      private usersService: UsersService, // Service pour interagir avec les utilisateurs.
      private authService: AuthService, // Service pour gérer l'authentification.
      private leaveBalancesService: LeaveBalancesService,
      private toastService: ToastService
    ) {}

  users: User[] = []; // Liste complète des utilisateurs.
  filteredUsers: User[] = []; // Liste des utilisateurs après filtrage.
  displayedUsers: User[] = []; // Liste des utilisateurs affichés sur la page actuelle.
  selectedUserId: string | null = null;

  currentPage = 1; // Page actuelle.
  itemsPerPage = 10; // Nombre d'éléments par page.
  totalItems = 0; // Nombre total d'éléments après fil

   /**
     * État des menus du tableau de bord
     */
    isUserMenuOpen: boolean = false;
    isLeaveMenuOpen: boolean = false;
    isAttendanceMenuOpen: boolean = false;
    isReportMenuOpen: boolean = false;

    ngOnInit(): void {
      this.loadUsers();
      this.getUserDetails();
    }



    /**
     * Informations sur l'utilisateur et les statistiques de congés
     */
    user: User | null = null;
    leaveStatistics: LeaveStatusSummary | null = null;

    loadUsers(): void {
      this.usersService.getAllUsers().subscribe({
        next: (data) => {
          this.users = data;
          this.toastService.show('Utilisateurs chargés avec succès.', 'success');
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des utilisateurs:', err);
          this.toastService.show('Erreur lors du chargement des utilisateurs.', 'error');
        },
      });
    }


    onUserSelect(): void {
      console.log('Utilisateur sélectionné :', this.selectedUserId);
    }


     /**
   * Met à jour le solde d'un utilisateur spécifique.
   */
     updateLeaveBalanceForSelectedUser(): void {
      if (this.selectedUserId) {
        this.leaveBalancesService.updateLeaveBalance(this.selectedUserId).subscribe({
          next: () => {
            this.toastService.show('Le solde a été mis à jour avec succès.', 'success');
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour du solde :', err);
            this.toastService.show('Erreur lors de la mise à jour du solde.', 'error');
          },
        });
      } else {
        this.toastService.show('Veuillez sélectionner un utilisateur.', 'info');
      }
    }

  /**
   * Met à jour les soldes pour tous les utilisateurs.
   */
  updateAllLeaveBalances(): void {
    const confirmUpdate = () => {
      this.leaveBalancesService.updateAllLeaveBalances().subscribe({
        next: () => {
          this.toastService.show('Tous les soldes ont été mis à jour avec succès.', 'success');
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour des soldes :', err);
          this.toastService.show('Erreur lors de la mise à jour des soldes.', 'error');
        },
      });
    };

    // Utilisation du toast pour la confirmation
    if (confirm('Êtes-vous sûr de vouloir mettre à jour tous les soldes ?')) {
      confirmUpdate();
    }
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
        this.toastService.show('Liste des utilisateurs mise à jour.', 'success');
      },
      error: (error) => {
        console.error("Erreur lors du chargement des utilisateurs", error);
        this.toastService.show('Erreur lors du chargement des utilisateurs.', 'error');
      }
    });
  }

/**
 * Déconnecter l'utilisateur et rediriger vers la page de connexion
 */
logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.authService.logout();
      this.toastService.show('Déconnexion réussie.', 'info');
    }
    this.router.navigate(['/auth/login']);
  }
}

