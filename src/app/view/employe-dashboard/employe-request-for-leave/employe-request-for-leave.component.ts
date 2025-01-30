
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeLeaveStats } from '../../../core/models/EmployeeLeaveStats';
import { LeaveStatusSummary } from '../../../core/models/LeaveStatusSummary';
import { LeaveTrend } from '../../../core/models/LeaveTrend';
import { User } from '../../../core/models/User';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LeaveReportsService } from '../../../core/services/leaveReports/leave-reports.service';
import { TypeConge } from '../../../core/models/LeaveRequest';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-employe-request-for-leave',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './employe-request-for-leave.component.html',
  styleUrl: './employe-request-for-leave.component.scss'
})
export class EmployeRequestForLeaveComponent implements OnInit{



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

    leaveTrends: LeaveTrend[] = [];
    leaveStatusSummary: LeaveStatusSummary | null = null;
    leaveTypeData: Record<string, number> = {};
    leaveRequestForm!: FormGroup;
    leaveTypes: { value: TypeConge, label: string }[] = [];

    isSubmitting: boolean = false;

    /**
     * Constructeur pour injecter les services nécessaires
     * @param router Service de navigation Angular
     * @param authService Service d'authentification
     * @param leaveReportsService Service de gestion des rapports de congés
     */
    constructor(
      private router: Router,
      private authService: AuthService,
      private leaveReportsService: LeaveReportsService,
      private formBuilder: FormBuilder,
      private leaveService: LeaveService,
      private toastService : ToastService
    ) {}

    /**
     * Méthode appelée à l'initialisation du composant
     */
    ngOnInit(): void {
      this.getUserDetails();
      this.loadLeaveTypes();

      // Initialisation du formulaire de demande de congé
      this.leaveRequestForm = this.formBuilder.group({
        userId: [this.employeeId, Validators.required],
        typeConge: [Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        commentaire: [''],
        justificatif: [''],
        raison: [''],
      });
    }



    loadLeaveTypes(): void {
      // Charger dynamiquement depuis un service ou une configuration
      this.leaveTypes = Object.keys(TypeConge)
        .filter(key => isNaN(Number(key)))
        .map(key => ({
          value: TypeConge[key as keyof typeof TypeConge],
          label: this.getLeaveTypeLabel(TypeConge[key as keyof typeof TypeConge])
        }));
    }

    validateLeaveType(): void {
      if (!this.leaveRequestForm.value.typeConge) {
        this.toastService.showError('Veuillez sélectionner un type de congé valide.');
      }
    }



    getLeaveTypeLabel(type: TypeConge): string {
      switch(type) {
        case TypeConge.Paye: return "Congé payé";
        case TypeConge.NonPaye: return "Congé non payé";
        case TypeConge.Maladie: return "Congé maladie";
        case TypeConge.Parental: return "Congé parental";
        case TypeConge.Sabbatique: return "Congé sabbatique";
        case TypeConge.Famille: return "Congé familial";
        case TypeConge.Formation: return "Congé formation";
        case TypeConge.Militaire: return "Congé militaire";
        case TypeConge.SansSolde: return "Congé sans solde";
        case TypeConge.Exceptionnel: return "Congé exceptionnel";
        case TypeConge.ReposCompensateur: return "Repos compensateur";
        case TypeConge.Anniversaire: return "Congé anniversaire";
        case TypeConge.Civique: return "Congé civique";
        case TypeConge.DonSang: return "Congé don de sang";
        case TypeConge.Deuil: return "Congé deuil";
        default: return "Type de congé inconnu";
      }
    }



    onFileChange(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.leaveRequestForm.patchValue({ justificatif: file });
      }
    }


/**
 * Soumet la demande de congé via le service.
 */
submitLeaveRequest(): void {

  if (this.leaveRequestForm.invalid) {
    this.toastService.showError("Veuillez remplir correctement tous les champs obligatoires.");
    return;
  }

  if (this.leaveRequestForm.invalid || !this.leaveRequestForm.value.typeConge) {
    this.validateLeaveType();
    return;
  }

  const formValue = this.leaveRequestForm.value;
  const typeConge: TypeConge = parseInt(formValue.typeConge, 10);

  const formData = new FormData();
  formData.append('userId', this.leaveRequestForm.value.userId);
  formData.append('typeConge', typeConge.toString());
  formData.append('startDate', this.leaveRequestForm.value.startDate);
  formData.append('endDate', this.leaveRequestForm.value.endDate);
  formData.append('commentaire', this.leaveRequestForm.value.commentaire);
  formData.append('raison', this.leaveRequestForm.value.raison);
  if (this.leaveRequestForm.value.justificatif) {
    formData.append('justificatif', this.leaveRequestForm.value.justificatif);
  }
  console.log('Valeurs envoyées au backend :', formData.get('typeConge'));
  console.log('Valeurs du formulaire :', this.leaveRequestForm.value);
  console.log('Valeur de typeConge :', this.leaveRequestForm.value.typeConge);


  this.isSubmitting = true;

  this.leaveService.createLeaveRequest(formData).subscribe({
    next: () => {
      this.toastService.showSuccess("Votre demande de congé a été soumise avec succès !");
      this.leaveRequestForm.reset();
      this.isSubmitting = false;
    },
    error: (err) => {
      this.toastService.showError("Erreur lors de l'envoi de votre demande de congé : " + err.message);
      this.isSubmitting = false;
    }
  });
}










    /**
     * Charge les détails de l'utilisateur connecté.
     */
    getUserDetails(): void {
      this.user = this.authService.getCurrentUser();
      this.employeeId = this.user?.id || '';
      console.log('User ID:', this.employeeId);
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
     * Active ou désactive le menu de gestion des congés.
     */
    toggleLeaveMenu() {
      this.isLeaveMenuOpen = !this.isLeaveMenuOpen;
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
