import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../core/models/User';
import { UsersService } from '../../../core/services/users/users.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LeaveReportsService } from '../../../core/services/leaveReports/leave-reports.service';
import { Report, ReportType } from '../../../core/models/Report';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-leave-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './leave-report.component.html',
  styleUrl: './leave-report.component.scss'
})
export class LeaveReportComponent implements OnInit{

  users: User[] = [];
  filteredUsers: User[] = [];
  displayedUsers: User[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;
  user: User | null = null;
  searchTerm: string = '';

  reports: Report[] = [];
  filteredReports: Report[] = [];
  reportTypes = Object.values(ReportType);
  selectedReportType: string = '';

  showGenerateModal = false;
  newReportType: string = '';
  generationError: string = '';

  showViewModal = false;
  currentReport: Report | null = null;

  showDeleteModal = false;
  reportToDelete: string | null = null;



  constructor(private router: Router,
    private usersService: UsersService ,
    private authService: AuthService,
    private fb: FormBuilder,
    private leaveReportsService: LeaveReportsService,
    private toastService: ToastService) {
    }

  ngOnInit(): void {
    this.getUsers();
    this.getUserDetails();
    this.loadReports();
    this.leaveReportsService.getAllReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.filteredReports = data;
      },
      error: (err) => console.error('Erreur chargement rapports :', err),
    });
  }

  confirmDelete(reportId: string): void {
    this.reportToDelete = reportId;
    this.showDeleteModal = true;
  }

  executeDelete(): void {
    if (this.reportToDelete) {
      this.leaveReportsService.deleteReport(this.reportToDelete).subscribe({
        next: () => {
          this.reports = this.reports.filter((report) => report.id !== this.reportToDelete);
          this.filterReports();
          this.showDeleteModal = false;
          this.reportToDelete = null;
          this.toastService.show('Rapport supprimé avec succès', 'success');
        },
        error: (error) => {
          console.error("Erreur lors de la suppression du rapport", error);
          this.toastService.show('Erreur lors de la suppression du rapport', 'error');
          this.showDeleteModal = false;
          this.reportToDelete = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.reportToDelete = null;
  }

  private static readonly REPORT_TYPE_TRANSLATIONS = new Map<ReportType, string>([
    [ReportType.ApprovedLeaves, 'Congés approuvés'],
    [ReportType.CustomReport, 'Congés customiser'],
    [ReportType.PendingLeaves, 'Congé en attente'],
    [ReportType.UserActivity, 'Activité des utilisateurs'],
  ]);



  getUserFullName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu';
  }


  getFormattedDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTranslatedReportType(type: string): string {
    return LeaveReportComponent.REPORT_TYPE_TRANSLATIONS.get(type as ReportType) || type;
  }


  loadReports(): void {
    this.leaveReportsService.getAllReports().subscribe({
      next: (data) => {
        this.reports = data.map(report => {
          const user = this.users.find(u => u.id === report.generatedBy);
          return {
            ...report,
            generatedByName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu'
          };
        });
        this.filteredReports = [...this.reports];
      },
      error: (err) => console.error('Erreur chargement rapports :', err),
    });
  }


  filterReports(): void {
    console.log('Filtering reports with type:', this.selectedReportType);
    if (this.selectedReportType && this.selectedReportType !== '') {
      this.filteredReports = this.reports.filter(
        report => report.reportType === this.selectedReportType
      );
    } else {
      this.filteredReports = [...this.reports];
    }
  }

  generateReport(): void {
    if (!this.newReportType) {
      this.generationError = 'Veuillez sélectionner un type de rapport';
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.generationError = 'Utilisateur non connecté';
      return;
    }

    console.log('Generating report:', {
      type: this.newReportType,
      user: currentUser.id
    });

    this.leaveReportsService.generateReport(this.newReportType as ReportType, currentUser.id)
      .subscribe({
        next: (report) => {
          console.log('Report generated:', report);
          this.reports.unshift(report);
          this.filterReports();
          this.showGenerateModal = false;
          this.newReportType = '';
          // Optionnel : Ajoutez un message de succès
          alert('Rapport généré avec succès');
        },
        error: (error) => {
          console.error('Generation error:', error);
          this.generationError = 'Erreur lors de la génération du rapport: ' + error.message;
        }
      });
  }

  openGenerateReportModal(): void {
    this.showGenerateModal = true;
  }

  viewReport(report: Report): void {
    this.currentReport = report;
    this.showViewModal = true;
  }

  deleteReport(reportId: string): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce rapport ?")) {
      this.leaveReportsService.deleteReport(reportId).subscribe({
        next: () => {
          this.reports = this.reports.filter((report) => report.id !== reportId);
          this.filterReports();
        },
        error: (error) => {
          console.error("Erreur lors de la suppression du rapport", error);
        }
      });
    }
  }


  exportToExcel(reportId: string): void {
    this.leaveReportsService.exportReportToExcel(reportId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportId}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur lors de l\'export:', error);
        // Ajouter une notification d'erreur
      }
    });
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

  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
  }

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

  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.authService.logout();
    }
    this.router.navigate(['/auth/login']);
  }
}
