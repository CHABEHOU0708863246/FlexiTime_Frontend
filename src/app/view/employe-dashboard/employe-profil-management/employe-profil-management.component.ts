import { Component, OnInit } from '@angular/core';
import { LeaveBalancesService } from '../../../core/services/leaveBalances/leave-balances.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeLeaveStats } from '../../../core/models/EmployeeLeaveStats';
import { User } from '../../../core/models/User';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersService } from '../../../core/services/users/users.service';

@Component({
  selector: 'app-employe-profil-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './employe-profil-management.component.html',
  styleUrl: './employe-profil-management.component.scss'
})
export class EmployeProfilManagementComponent implements OnInit{
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
    updateForm!: FormGroup;
    user: User | null = null;
    isSubmitting = false;
    employeeId: string = '';

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private authService: AuthService)
     {
      // Initialisation du formulaire réactif
      this.updateForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        gender: ['', Validators.required],
        contractType: ['', Validators.required],
        workingHours: ['', Validators.required],
        hireDate: ['', Validators.required],
        residence: ['', Validators.required],
        postalAddress: ['', Validators.required],
        numberOfChildren: [0],
        maritalStatus: [''],
        isPartTime: [false],
        roles: [[]],
        password: ['']
      });

  }

  ngOnInit(): void {
    this.getUserDetails();
    this.loadUserData();
  }

  loadUserData(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.updateForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        gender: this.user.gender,
        contractType: this.user.contractType,
        workingHours: this.user.workingHours,
        hireDate: this.user.hireDate ? new Date(this.user.hireDate).toISOString().split('T')[0] : '',
        residence: this.user.residence,
        postalAddress: this.user.postalAddress,
        numberOfChildren: this.user.numberOfChildren,
        maritalStatus: this.user.maritalStatus,
        isPartTime: this.user.isPartTime,
        roles: this.user.roles
      });

      if (this.user.isPartTime) {
        this.updateForm.get('workingHours')?.setValidators([
          Validators.required,
          Validators.max(35),
          Validators.min(1)
        ]);
      }
    }
  }



/**
 * Charge et initialise les détails de l'utilisateur connecté.
 * Cette méthode récupère l'utilisateur courant et met à jour le formulaire
 * avec toutes les informations disponibles.
 */
getUserDetails(): void {
  this.user = this.authService.getCurrentUser();

  if (this.user) {
    // Mise à jour du formulaire avec toutes les informations de l'utilisateur
    this.updateForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phoneNumber,
      gender: this.user.gender,
      contractType: this.user.contractType,
      workingHours: this.user.workingHours,
      hireDate: this.user.hireDate ? new Date(this.user.hireDate).toISOString().split('T')[0] : '',
      residence: this.user.residence,
      postalAddress: this.user.postalAddress
    });

    // Ajout de validateurs supplémentaires si nécessaire
    if (this.user.isPartTime) {
      this.updateForm.get('workingHours')?.setValidators([
        Validators.required,
        Validators.max(35),
        Validators.min(1)
      ]);
    }

    // Log des informations détaillées pour le débogage
    console.log('Détails de l\'utilisateur chargés:', {
      nom: this.user.lastName,
      prénom: this.user.firstName,
      email: this.user.email,
      type_contrat: this.user.contractType,
      temps_travail: `${this.user.workingHours}h${this.user.isPartTime ? ' (temps partiel)' : ''}`,
      date_embauche: new Date(this.user.hireDate).toLocaleDateString(),
      statut_marital: this.user.maritalStatus,
      enfants: this.user.numberOfChildren
    });
  } else {
    console.error('Aucun utilisateur connecté trouvé');
    // Redirection vers la page de connexion si aucun utilisateur n'est trouvé
    this.router.navigate(['/auth/login']);
  }
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
