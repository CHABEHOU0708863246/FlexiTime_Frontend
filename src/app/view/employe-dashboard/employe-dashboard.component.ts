
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/User';
import { LeaveStatusSummary } from '../../core/models/LeaveStatusSummary';
import { LeaveReportsService } from '../../core/services/leaveReports/leave-reports.service';
import Chart from 'chart.js/auto';
import { LeaveTrend } from '../../core/models/LeaveTrend';
import { EmployeeLeaveStats } from '../../core/models/EmployeeLeaveStats';


@Component({
  selector: 'app-employe-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './employe-dashboard.component.html',
  styleUrl: './employe-dashboard.component.scss'
})
export class EmployeDashboardComponent implements OnInit{



    /**
   * Méthode appelée à l'initialisation du composant
   */
    ngOnInit(): void {
      this.getUserDetails(); // Récupère les détails de l'utilisateur connecté
      this.employeeId = this.user?.id || ''; // Récupération de l'ID utilisateur depuis le service Auth
      if (!this.employeeId) {
        console.error('Aucun ID utilisateur trouvé. Redirection ou affichage d’une erreur.');
        this.router.navigate(['/auth/login']); // Redirection vers une page d'authentification ou autre
        return;
      }
      this.loadEmployeeLeaveStats();
    }

  /**
   * État des menus du tableau de bord
   */
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;

  /**
   * Informations sur l'utilisateur et les statistiques de congés
   */
  user: User | null = null;
  leaveStatistics: EmployeeLeaveStats | null = null; // Propriété pour stocker les statistiques
  employeeId: string = '';

  /**
   * Données et graphiques liés aux congés
   */
  private charts: Chart[] = [];
  leaveTrends: LeaveTrend[] = [];
  leaveStatusSummary: LeaveStatusSummary | null = null;
  barChartData: Record<string, number> = {};
  pieChartData: Record<string, number> = {};
  startDate = new Date(new Date().getFullYear(), 0, 1);
  endDate = new Date();
  leaveTypeData: Record<string, number> = {};

  /**
   * Années disponibles pour la sélection
   */
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  /**
   * Constructeur pour injecter les services nécessaires
   * @param router Service de navigation Angular
   * @param authService Service d'authentification
   * @param leaveReportsService Service de gestion des rapports de congés
   */
  constructor(private router: Router, private authService: AuthService, private leaveReportsService: LeaveReportsService, private route: ActivatedRoute) {}







  /**
   * Charge les détails de l'utilisateur connecté.
   */
  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
  }

  /**
 * Charge les statistiques globales des congés.
 */
  loadEmployeeLeaveStats(): void {
    if (!this.employeeId) {
      console.error('Impossible de charger les statistiques : ID employé manquant.');
      return;
    }
    this.leaveReportsService.getEmployeeLeaveStats(this.employeeId).subscribe(
      (stats) => {
        this.leaveStatistics = stats;
      },
      (error) => {
        console.error('Erreur lors du chargement des statistiques de congés:', error);
      }
    );
  }

  /**
   * Active ou désactive le menu utilisateur.
   */
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  /**
   * Active ou désactive le menu de gestion des congés.
   */
  toggleLeaveMenu() {
    this.isLeaveMenuOpen = !this.isLeaveMenuOpen;
  }

  /**
   * Active ou désactive le menu des rapports.
   */
  toggleReportMenu() {
    this.isReportMenuOpen = !this.isReportMenuOpen;
  }

  /**
   * Déconnecte l'utilisateur et le redirige vers la page de connexion.
   */
  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.authService.logout();
    }
    this.router.navigate(['/auth/login']);
  }

}
