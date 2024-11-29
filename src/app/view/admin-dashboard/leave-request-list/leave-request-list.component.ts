import { UsersService } from './../../../core/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/User';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LeaveRequest, StatutConges, TypeConge} from '../../../core/models/LeaveRequest';
import { LeaveService } from '../../../core/services/leave/leave.service';

@Component({
  selector: 'app-leave-request-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './leave-request-list.component.html',
  styleUrl: './leave-request-list.component.scss'
})
export class LeaveRequestListComponent implements OnInit{
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;
  user: User | null = null;
  users: User[] = [];

  leaveRequests: LeaveRequest[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;

  originalLeaveRequests: LeaveRequest[] = [];

  StatutConges = StatutConges;



  constructor(
    private router: Router,
    private authService: AuthService,
    private leaveService: LeaveService,
    private usersService : UsersService) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
    this.getUsers();
    this.getUserDetails();
  }

  // Gestion des menus
  toggleUserMenu() { this.isUserMenuOpen = !this.isUserMenuOpen; }
  toggleLeaveMenu() { this.isLeaveMenuOpen = !this.isLeaveMenuOpen; }
  toggleAttendanceMenu() { this.isAttendanceMenuOpen = !this.isAttendanceMenuOpen; }
  toggleReportMenu() { this.isReportMenuOpen = !this.isReportMenuOpen; }


  // Charger les demandes de congés
  loadLeaveRequests(): void {
    this.leaveService.getLeaveRequests().subscribe(
      (data: LeaveRequest[]) => {
        const originalLeaveRequests = [...data];
        this.originalLeaveRequests = [...data];
        this.leaveRequests = [...data];

        // Récupérer les utilisateurs pour associer les noms
        this.usersService.getAllUsers().subscribe(users => {
          const userMap = new Map(users.map(user => [user.id, user]));

          this.leaveRequests = originalLeaveRequests.map(leaveRequest => {
            const newLeaveRequest = Object.assign({}, leaveRequest);
            newLeaveRequest.userFirstName = userMap.get(leaveRequest.userId)?.firstName || 'Inconnu';
            newLeaveRequest.userLastName = userMap.get(leaveRequest.userId)?.lastName || 'Inconnu';

            return newLeaveRequest;
          });
        });

        this.totalPages = Math.ceil(this.leaveRequests.length / 10);
      },
      (error: string) => console.error('Erreur :', error)
    );
  }


// Obtenir les utilisateurs
getUsers(): void {
  this.usersService.getAllUsers().subscribe({
    next: data => { this.users = data; },
    error: error => console.error('Erreur lors du chargement des utilisateurs :', error),
  });
}

// Obtenir les détails de l'utilisateur connecté
getUserDetails(): void {
  this.user = this.authService.getCurrentUser();
}

// Mettre à jour le statut d'une demande de congé
updateLeaveStatus(leaveId: string, newStatus: StatutConges): void {
  this.leaveService.updateLeaveStatus(leaveId, newStatus).subscribe(
    () => {
      const leave = this.leaveRequests.find(request => request.id === leaveId);
      if (leave) {
        leave.status = newStatus;
      }
    },
    error => console.error('Erreur lors de la mise à jour du statut :', error)
  );
}

// Méthodes d'affichage pour les types et statuts
getTypeCongeString(type: TypeConge): string {
  return TypeConge[type];
}

getStatutCongeString(status: StatutConges): string {
  return StatutConges[status];
}

// Filtrer les demandes par recherche
filterLeaveRequests(): void {
  if (this.searchTerm) {
    const searchTermLower = this.searchTerm.toLowerCase();

    // Filtrer les demandes de congés par type, statut ou utilisateur (prénom et nom)
    this.leaveRequests = this.originalLeaveRequests.filter(request =>
      this.getTypeCongeString(request.type).toLowerCase().includes(searchTermLower) ||
      this.getStatutCongeString(request.status).toLowerCase().includes(searchTermLower) ||
      (request.userFirstName?.toLowerCase().includes(searchTermLower) ||
       request.userLastName?.toLowerCase().includes(searchTermLower))
    );
  } else {
    // Si la recherche est vide, réinitialiser les données
    this.leaveRequests = [...this.originalLeaveRequests];
  }
}


// Méthode pour télécharger le PDF
downloadPdf(leaveId: string, userId: string): void {
  this.leaveService.downloadLeavePdf(leaveId, userId).subscribe(
    (response: Blob) => {
      const fileURL = URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `Leave_${leaveId}.pdf`;  // Nom du fichier téléchargé
      link.click();
    },
    error => {
      console.error('Erreur lors du téléchargement du PDF', error);
    }
  );
}


// Déconnexion de l'utilisateur
logout(): void {
  this.authService.logout();
  this.router.navigate(['/auth/login']);
}

}
