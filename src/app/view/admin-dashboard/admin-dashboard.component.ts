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
export class AdminDashboardComponent implements OnInit, AfterViewInit, OnDestroy  {
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;
  user: User | null = null;
  leaveStatistics: LeaveStatusSummary | null = null;
  private charts: Chart[] = [];

  leaveTrends: LeaveTrend[] = [];
  leaveStatusSummary: LeaveStatusSummary | null = null;

  selectedYear: number = new Date().getFullYear();  // L'année actuelle par défaut
  availableYears: number[] = [2024, 2025, 2023, 2022, 1996];


  constructor(private router: Router, private authService: AuthService, private leaveReportsService: LeaveReportsService) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.loadLeaveStatistics();
    this.loadData();
  }

  onYearChange(): void {
    this.loadData();  // Recharger les données lorsque l'année est changée
  }

  ngOnDestroy(): void {
    // Nettoyer les graphiques lors de la destruction du composant
    this.charts.forEach(chart => chart.destroy());
  }

  loadData(): void {
    console.log("Début du chargement des données");

    this.leaveReportsService.getLeaveTrends().subscribe({
      next: (trends) => {
        console.log("Données de tendances reçues:", trends);
        this.leaveTrends = trends;
        setTimeout(() => this.createSalesChart(), 100);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tendances:', error);
      },
      complete: () => console.log("Chargement des tendances terminé")
    });

    this.leaveReportsService.getLeaveStatusSummary().subscribe({
      next: (summary) => {
        console.log("Données de résumé reçues:", summary);
        this.leaveStatusSummary = summary;
        setTimeout(() => this.createTeamChart(), 100);
      },
      error: (error) => console.error('Erreur lors du chargement du résumé:', error)
    });
  }

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

  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
  }

  loadLeaveStatistics(): void {
    this.leaveReportsService.getLeaveStatusSummary().subscribe(
      (data) => {
        this.leaveStatistics = data;  // Stocke les données reçues
      },
      (error) => {
        console.error('Erreur lors de la récupération des statistiques des congés:', error);
      }
    );
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleLeaveMenu() {
    this.isLeaveMenuOpen = !this.isLeaveMenuOpen;
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
