import { UsersService } from './../../../core/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/User';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LeaveRequest, StatutConges, TypeConge } from '../../../core/models/LeaveRequest';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { PaginatedResponse } from '../../../core/models/PaginationResponse ';


@Component({
  selector: 'app-leave-request-list', // Sélecteur du composant.
  standalone: true, // Composant autonome.
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './leave-request-list.component.html', // Template HTML associé.
  styleUrl: './leave-request-list.component.scss' // Fichier de styles SCSS associé.
})
export class LeaveRequestListComponent implements OnInit {
  isUserMenuOpen: boolean = false; // État du menu utilisateur.
  isLeaveMenuOpen: boolean = false; // État du menu des congés.
  isAttendanceMenuOpen: boolean = false; // État du menu de présence.
  isReportMenuOpen: boolean = false; // État du menu des rapports.
  user: User | null = null; // Détails de l'utilisateur connecté.
  users: User[] = []; // Liste des utilisateurs.

  leaveRequests: LeaveRequest[] = []; // Liste des demandes de congés.
  searchTerm: string = ''; // Terme de recherche.
  pageSize: number = 10; // Nombre de demandes par page.
  currentPage: number = 1; // Page actuelle.
  totalPages: number = 1; // Nombre total de pages.
  originalLeaveRequests: LeaveRequest[] = []; // Liste des demandes de congés (originale).

  StatutConges = StatutConges; // Enum pour les statuts de congés.

  currentUserId: string | null = null; // ID de l'utilisateur connecté.

  constructor(
    private router: Router, // Service de navigation.
    private authService: AuthService, // Service pour gérer l'authentification.
    private leaveService: LeaveService, // Service pour interagir avec les congés.
    private usersService: UsersService // Service pour interagir avec les utilisateurs.
  ) {}

  /**
   * Méthode exécutée à l'initialisation du composant.
   */
  ngOnInit(): void {
    this.loadLeaveRequests(); // Charge les demandes de congés.
    this.getUsers(); // Charge la liste des utilisateurs.
    this.getUserDetails(); // Charge les détails de l'utilisateur connecté.
  }

  /**
   * Ouvre ou ferme le menu utilisateur.
   */
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  /**
   * Ouvre ou ferme le menu des congés.
   */
  toggleLeaveMenu() {
    this.isLeaveMenuOpen = !this.isLeaveMenuOpen;
  }

  /**
   * Ouvre ou ferme le menu des rapports.
   */
  toggleReportMenu() {
    this.isReportMenuOpen = !this.isReportMenuOpen;
  }

  /**
   * Passe à la page suivante des demandes de congés.
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadLeaveRequests();
    }
  }

  /**
   * Revient à la page précédente des demandes de congés.
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadLeaveRequests();
    }
  }

  /**
   * Charge les demandes de congés avec pagination.
   */
  loadLeaveRequests(): void {
    this.leaveService.getPaginatedLeaves(this.currentPage, this.pageSize).subscribe(
      (data: PaginatedResponse<LeaveRequest>) => {
        this.leaveRequests = data.items; // Met à jour les demandes de congés.
        this.totalPages = data.totalPages; // Met à jour le nombre total de pages.
        this.originalLeaveRequests = [...this.leaveRequests]; // Sauvegarde des demandes originales.

        // Récupère les utilisateurs et associe leurs informations aux demandes de congés.
        this.usersService.getAllUsers().subscribe(users => {
          const userMap = new Map(users.map(user => [user.id, user])); // Map des utilisateurs par ID.

          this.leaveRequests = this.leaveRequests.map(leaveRequest => {
            const user = userMap.get(leaveRequest.userId);
            leaveRequest.userFirstName = user?.firstName || 'Inconnu';
            leaveRequest.userLastName = user?.lastName || 'Inconnu';
            leaveRequest.justificationFileUrl = leaveRequest.justificationFileUrl || ''; // URL de justification.
            return leaveRequest;
          });
        });
      },
      (error: string) => console.error('Erreur :', error)
    );
  }

  /**
   * Charge la liste des utilisateurs.
   */
  getUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: data => { this.users = data; },
      error: error => console.error('Erreur lors du chargement des utilisateurs :', error),
    });
  }

  /**
   * Récupère les détails de l'utilisateur connecté.
   */
  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.currentUserId = this.user.id;
    }
  }

  /**
   * Met à jour le statut d'une demande de congé.
   * @param leaveId - ID de la demande de congé.
   * @param newStatus - Nouveau statut à appliquer.
   */
  updateLeaveStatus(leaveId: string, newStatus: StatutConges): void {
    if (!this.currentUserId) {
      alert('Utilisateur non connecté ou ID utilisateur manquant.');
      return;
    }

    this.leaveService.updateLeaveStatus(leaveId, newStatus, this.currentUserId).subscribe({
      next: (message) => {
        const leaveIndex = this.leaveRequests.findIndex(request => request.id === leaveId);
        if (leaveIndex !== -1) {
          this.leaveRequests[leaveIndex].status = newStatus; // Met à jour le statut localement.
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut :', error);
        const errorMessage = error.error?.message || 'Une erreur est survenue.';
        alert(`Erreur : ${errorMessage}`);
      }
    });
  }






// Méthodes d'affichage pour les types et statuts
getTypeCongeString(type: TypeConge): string {
  switch (type) {
    case TypeConge.Paye: return 'Congé payé';
    case TypeConge.NonPaye: return 'Congé non payé';
    case TypeConge.Maladie: return 'Congé maladie';
    case TypeConge.Parental: return 'Congé parental';
    case TypeConge.Sabbatique: return 'Congé sabbatique';
    case TypeConge.Famille: return 'Congé pour événement familial';
    case TypeConge.Formation: return 'Congé pour formation';
    case TypeConge.Militaire: return 'Congé pour service militaire';
    case TypeConge.SansSolde: return 'Congé sans solde';
    case TypeConge.Exceptionnel: return 'Congé exceptionnel';
    case TypeConge.ReposCompensateur: return 'Repos compensateur';
    case TypeConge.Anniversaire: return 'Congé pour anniversaire';
    case TypeConge.Civique: return 'Congé civique';
    case TypeConge.DonSang: return 'Don de sang';
    case TypeConge.Deuil: return 'Congé pour deuil';
    default: return 'Type de congé inconnu';
  }
}

getStatutCongeString(status: StatutConges): string {
  switch (status) {
    case StatutConges.Attente: return 'En attente';
    case StatutConges.Approuve: return 'Approuvé';
    case StatutConges.Rejete: return 'Rejeté';
    case StatutConges.Annule: return 'Annulé';
    default: return 'Statut mis a jour';
  }
}




// Filtrer les demandes par recherche
filterLeaveRequests(): void {
  if (this.searchTerm) {
    const searchTermLower = this.searchTerm.toLowerCase();

    // Créer un tableau temporaire filtré sans altérer l'original
    const filteredRequests = this.originalLeaveRequests.filter(request =>
      this.getTypeCongeString(request.type).toLowerCase().includes(searchTermLower) ||
      this.getStatutCongeString(request.status).toLowerCase().includes(searchTermLower) ||
      (request.userFirstName?.toLowerCase().includes(searchTermLower) ||
       request.userLastName?.toLowerCase().includes(searchTermLower))
    );

    // Mettre à jour `leaveRequests` avec les résultats filtrés
    this.leaveRequests = filteredRequests;
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

downloadJustification(fileName: string): void {
  this.leaveService.downloadJustificationFile(fileName).subscribe(
    (fileBlob: Blob) => {
      const blobUrl = URL.createObjectURL(fileBlob); // Créer un URL pour le Blob
      const link = document.createElement('a'); // Créer un élément <a>
      link.href = blobUrl; // Lien vers le Blob
      link.download = fileName; // Nom du fichier à télécharger
      link.click(); // Simuler le clic pour lancer le téléchargement
      URL.revokeObjectURL(blobUrl); // Révoquer l'URL Blob après utilisation
    },
    (error: string) => {
      console.error('Erreur lors du téléchargement de la justification :', error);
      alert('Une erreur est survenue lors du téléchargement.');
    }
  );
}



// Déconnexion de l'utilisateur
logout(): void {
  this.authService.logout();
  this.router.navigate(['/auth/login']);
}

}
