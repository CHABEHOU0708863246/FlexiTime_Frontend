import { UsersService } from './../../../core/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/User';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LeaveRequest, StatutConges, TypeConge} from '../../../core/models/LeaveRequest';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { PaginatedResponse } from '../../../core/models/PaginationResponse ';

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
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  originalLeaveRequests: LeaveRequest[] = [];

  StatutConges = StatutConges;

  currentUserId: string | null = null;



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
  toggleReportMenu() { this.isReportMenuOpen = !this.isReportMenuOpen; }


  // Gérer la pagination : page suivante
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadLeaveRequests();
    }
  }

  // Gérer la pagination : page précédente
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadLeaveRequests();
    }
  }


// Charger les demandes de congés avec pagination
loadLeaveRequests(): void {
  this.leaveService.getPaginatedLeaves(this.currentPage, this.pageSize).subscribe(
    (data: PaginatedResponse<LeaveRequest>) => {
      this.leaveRequests = data.items;  // Mise à jour des demandes de congé
      this.totalPages = data.totalPages;  // Mise à jour du nombre total de pages
      this.originalLeaveRequests = [...this.leaveRequests];  // Sauvegarder les demandes de congé d'origine

      // Récupérer les utilisateurs pour associer les noms
      this.usersService.getAllUsers().subscribe(users => {
        const userMap = new Map(users.map(user => [user.id, user]));  // Associer les utilisateurs par ID

        // Associer les informations des utilisateurs aux demandes de congé
        this.leaveRequests = this.leaveRequests.map(leaveRequest => {
          const user = userMap.get(leaveRequest.userId);
          leaveRequest.userFirstName = user?.firstName || 'Inconnu';
          leaveRequest.userLastName = user?.lastName || 'Inconnu';

          // Ajouter l'URL de la justification
          leaveRequest.justificationFileUrl = leaveRequest.justificationFileUrl || '';
          return leaveRequest;
        });
      });
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
  if (this.user) {
    this.currentUserId = this.user.id;
  }
}


// Mettre à jour le statut d'une demande de congé
updateLeaveStatus(leaveId: string, newStatus: StatutConges): void {
  if (!this.currentUserId) {
    alert('Utilisateur non connecté ou ID utilisateur manquant.');
    return;
  }

  this.leaveService.updateLeaveStatus(leaveId, newStatus, this.currentUserId).subscribe({
    next: (message) => {
      // Trouver la demande concernée et mettre à jour son statut localement
      const leaveIndex = this.leaveRequests.findIndex(request => request.id === leaveId);
      if (leaveIndex !== -1) {
        this.leaveRequests[leaveIndex].status = newStatus;
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
