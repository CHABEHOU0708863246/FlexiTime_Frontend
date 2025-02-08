
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/User';
import { LeaveStatusSummary } from '../../core/models/LeaveStatusSummary';
import { LeaveReportsService } from '../../core/services/leaveReports/leave-reports.service';
import Chart from 'chart.js/auto';
import { LeaveTrend } from '../../core/models/LeaveTrend';

/**
 * Définition du composant AdminDashboardComponent
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  isLoading: boolean = false;

  /**
   * État des menus du tableau de bord
   */
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;

  isSidebarCollapsed = false;

  /**
   * Informations sur l'utilisateur et les statistiques de congés
   */
  user: User | null = null;
  leaveStatistics: LeaveStatusSummary | null = null;

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

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    // Ajouter une logique pour fermer les sous-menus si nécessaire
    if (this.isSidebarCollapsed) {
      this.isUserMenuOpen = false;
      this.isLeaveMenuOpen = false;
      this.isReportMenuOpen = false;
    }
  }


  /**
   * Constructeur pour injecter les services nécessaires
   * @param router Service de navigation Angular
   * @param authService Service d'authentification
   * @param leaveReportsService Service de gestion des rapports de congés
   */
  constructor(private router: Router, private authService: AuthService, private leaveReportsService: LeaveReportsService) {}

  /**
   * Méthode appelée à l'initialisation du composant
   */
  ngOnInit(): void {
    this.getUserDetails();
    this.loadLeaveStatistics();
    this.loadData();
    this.loadChartData();
    this.loadLeaveTypeData();
  }

  /**
   * Gestion du changement d'année
   */
  onYearChange(): void {
    this.loadData();
    this.loadLeaveTypeData();
  }

  /**
   * Chargement des données des types de congés
   */
  loadLeaveTypeData(): void {
    const startDate = new Date(this.selectedYear, 0, 1);
    const endDate = new Date(this.selectedYear, 11, 31);

    this.leaveReportsService.getLeaveDataForBarChart(startDate, endDate).subscribe({
      next: (data) => {
        this.leaveTypeData = data;
        this.createLeaveTypeChart();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données de congés par type:', error);
      }
    });
  }

  /**
   * Création du graphique des types de congés
   */
  createLeaveTypeChart(): void {
    const ctx = document.getElementById('leave-bar-chart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas not found');
      return;
    }

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    const colors = {
      'Congé Annuel': 'rgba(75, 192, 192, 0.8)',
      'Congé Maladie': 'rgba(255, 99, 132, 0.8)',
      'Congé Maternité': 'rgba(255, 206, 86, 0.8)',
      'Congé Sans Solde': 'rgba(153, 102, 255, 0.8)',
      'RTT': 'rgba(54, 162, 235, 0.8)',
      'Autres': 'rgba(201, 203, 207, 0.8)'
    };

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.leaveTypeData),
        datasets: [{
          label: 'Nombre de jours',
          data: Object.values(this.leaveTypeData),
          backgroundColor: Object.keys(this.leaveTypeData).map(
            type => (colors as any)[type] || 'rgba(201, 203, 207, 0.8)'
          ),
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.formattedValue} jours`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre de jours'
            },
            ticks: {
              stepSize: 1
            }
          },
          x: {
            title: {
              display: true,
              text: 'Types de congés'
            }
          }
        }
      }
    });
  }

  /**
   * Nettoyage des ressources lors de la destruction du composant
   */
  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

   /**
   * Simulation d'une action avec chargement
   */
   loadData(): void {
    this.isLoading = true; // Activation du spinner

    this.leaveReportsService.getLeaveTrends().subscribe({
      next: (trends) => {
        this.leaveTrends = trends;
        setTimeout(() => this.createSalesChart(), 100);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tendances:', error);
      },
      complete: () => {
        this.isLoading = false; // Désactivation du spinner après chargement
      }
    });
  }

  /**
   * Chargement des données pour les graphiques (barres et circulaire)
   */
  loadChartData(): void {
    this.leaveReportsService.getLeaveDataForBarChart(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.barChartData = data;
        this.createBarChart();
      },
      error: (error) => console.error('Erreur lors du chargement des données du graphique en barres:', error)
    });

    this.leaveReportsService.getLeaveDataForPieChart().subscribe({
      next: (data) => {
        this.pieChartData = data;
        this.createPieChart();
      },
      error: (error) => console.error('Erreur lors du chargement des données du graphique circulaire:', error)
    });
  }

  /**
   * Création du graphique en barres
   */
  createBarChart(): void {
    const ctx = document.getElementById('leave-bar-chart') as HTMLCanvasElement;
    if (!ctx) return;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.barChartData),
        datasets: [{
          label: 'Jours de congés par type',
          data: Object.values(this.barChartData),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre de jours'
            }
          }
        }
      }
    });
  }

  /**
   * Création du graphique circulaire
   */
  createPieChart(): void {
    const ctx = document.getElementById('leave-pie-chart') as HTMLCanvasElement;
    if (!ctx) return;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(this.pieChartData),
        datasets: [{
          data: Object.values(this.pieChartData),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Répartition des congés par type'
          }
        }
      }
    });
  }

  /**
   * Méthode appelée après l'initialisation de la vue.
   * Utilisée pour créer les graphiques une fois que les éléments HTML sont disponibles.
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      const salesCanvas = document.getElementById('sales-chart') as HTMLCanvasElement;
      const teamCanvas = document.getElementById('team-chart') as HTMLCanvasElement;

      if (salesCanvas && teamCanvas) {
        this.createSalesChart();
        this.createTeamChart();
      } else {
        console.error('Canvas elements not found');
      }
    }, 100);
  }

  /**
   * Crée un graphique linéaire pour afficher les tendances des congés mensuels.
   */
  createSalesChart(): void {
    const ctx = document.getElementById('sales-chart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas sales-chart non trouvé');
      return;
    }

    const data = this.leaveTrends.length > 0 ? this.leaveTrends : Array.from({ length: 12 }, (_, index) => ({
      year: this.selectedYear,
      month: index + 1,
      leaveCount: 0
    }));

    // Convertir les numéros de mois en noms de mois
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const monthLabels = data.map(trend => monthNames[trend.month - 1]);
    const leaveCount = data.map(trend => trend.leaveCount);

    // Si un graphique existe déjà, le détruire
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: `Congés ${this.selectedYear}`,
          data: leaveCount,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => `Nombre de congés: ${context.formattedValue}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            },
            title: {
              display: true,
              text: 'Nombre de congés'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mois'
            }
          }
        }
      }
    });
  }

  /**
   * Crée un graphique en barres pour afficher la répartition des congés par statut.
   */
  createTeamChart(): void {
    const ctx = document.getElementById('team-chart') as HTMLCanvasElement;
    if (!ctx || !this.leaveStatusSummary) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['En Attente', 'Approuvé', 'Refusé', 'Annulé'],
        datasets: [{
          label: 'Statut des Congés',
          data: [
            this.leaveStatusSummary.pendingCount,
            this.leaveStatusSummary.approvedCount,
            this.leaveStatusSummary.rejectedCount,
            this.leaveStatusSummary.cancelledCount
          ],
          backgroundColor: [
            'rgba(255, 206, 86, 0.8)', // Jaune pour En Attente
            'rgba(75, 192, 192, 0.8)',  // Vert pour Approuvé
            'rgba(255, 99, 132, 0.8)',  // Rouge pour Refusé
            'rgba(154, 162, 235, 0.8)'  // Bleu pour Annulé
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Répartition des Congés par Statut'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre de Congés'
            }
          }
        }
      }
    });
  }

  /**
   * Charge les détails de l'utilisateur connecté.
   */
  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
  }

  /**
   * Charge les statistiques globales des congés.
   */
  loadLeaveStatistics(): void {
    this.leaveReportsService.getLeaveStatusSummary().subscribe(
      (data) => {
        this.leaveStatistics = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des statistiques des congés:', error);
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
