
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { EmployeeLeaveStats } from '../../../core/models/EmployeeLeaveStats';
import { LeaveStatusSummary } from '../../../core/models/LeaveStatusSummary';
import { LeaveTrend } from '../../../core/models/LeaveTrend';
import { User } from '../../../core/models/User';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LeaveReportsService } from '../../../core/services/leaveReports/leave-reports.service';
import { LeaveRequest, StatutConges, TypeConge } from '../../../core/models/LeaveRequest';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-employe-request-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './employe-request-list.component.html',
  styleUrl: './employe-request-list.component.scss'
})
export class EmployeRequestListComponent implements OnInit{

  leaveRequests: LeaveRequest[] = [];
  StatutConges = StatutConges;

  // États des menus
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;

  // Propriétés pour la gestion des congés
  user: User | null = null;
  employeeId: string = '';
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;


  /**
   * Constructeur pour injecter les services nécessaires
   * @param router Service de navigation Angular
   * @param authService Service d'authentification
   * @param leaveReportsService Service de gestion des rapports de congés
   */
  constructor(private router: Router, private authService: AuthService, private leaveReportsService: LeaveReportsService, private route: ActivatedRoute, private leaveService: LeaveService) {}

    /**
   * Méthode appelée à l'initialisation du composant
   */
    ngOnInit(): void {
      this.getUserDetails();
      if (this.user?.id) {
        this.employeeId = this.user.id;
        this.loadLeaveRequests();
      } else {
        console.error('Aucun ID utilisateur trouvé.');
        this.router.navigate(['/auth/login']);
      }
    }

    // getEmployeeLeaveRequests(userId: string): void {
    //   this.leaveService.getLeaveRequests(userId).subscribe(
    //     (requests: LeaveRequest[]) => {
    //       this.leaveRequests = requests;
    //     },
    //     error => {
    //       console.error('Erreur lors de la récupération des demandes de congé', error);
    //     }
    //   );
    // }

    get paginatedLeaveRequests(): LeaveRequest[] {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.leaveRequests.slice(startIndex, endIndex);
    }

    formatDate(date: Date): string {
      return new Date(date).toLocaleDateString('fr-FR');
    }

    getStatusClass(status: StatutConges): string {
      switch (status) {
        case StatutConges.Approuve:
          return 'bg-green-100 text-green-800';
        case StatutConges.Rejete:
          return 'bg-red-100 text-red-800';
        case StatutConges.Attente:
          return 'bg-yellow-100 text-yellow-800';
        default:
          return '';
      }
    }

    getTypeCongeLabel(type: TypeConge): string {
      switch(type) {
        case TypeConge.Paye:
          return "Congé payé";
        case TypeConge.NonPaye:
          return "Congé non payé";
        case TypeConge.Maladie:
          return "Congé maladie";
        case TypeConge.Parental:
          return "Congé parental";
        case TypeConge.Sabbatique:
          return "Congé sabbatique";
        case TypeConge.Famille:
          return "Congé pour événements familiaux";
        case TypeConge.Formation:
          return "Congé pour formation";
        case TypeConge.Militaire:
          return "Congé pour service militaire";
        case TypeConge.SansSolde:
          return "Congé sans solde";
        case TypeConge.Exceptionnel:
          return "Congé exceptionnel";
        case TypeConge.ReposCompensateur:
          return "Repos compensateur";
        case TypeConge.Anniversaire:
          return "Congé anniversaire";
        case TypeConge.Civique:
          return "Congé civique";
        case TypeConge.DonSang:
          return "Congé don de sang";
        case TypeConge.Deuil:
          return "Congé deuil";
        default:
          return "Type inconnu";
      }
    }

    getStatutCongeLabel(statut: StatutConges): string {
      switch(statut) {
        case StatutConges.Attente:
          return "En attente";
        case StatutConges.Approuve:
          return "Approuvé";
        case StatutConges.Rejete:
          return "Rejeté";
        default:
          return "Statut inconnu";
      }
    }

    loadLeaveRequests(): void {
      if (this.user?.id) {
        this.leaveService.getLeaveRequests()
          .pipe(
            map(requests => requests.filter(request => request.userId === this.user?.id))
          )
          .subscribe({
            next: (requests) => {
              this.leaveRequests = requests;
              this.totalPages = Math.ceil(requests.length / this.itemsPerPage);
            },
            error: (error) => {
              console.error('Erreur lors du chargement des demandes:', error);
            }
          });
      }
    }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  /**
   * Charge les détails de l'utilisateur connecté.
   */
  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
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
