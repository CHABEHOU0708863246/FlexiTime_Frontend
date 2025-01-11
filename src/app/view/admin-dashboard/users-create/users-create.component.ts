import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/User';
import { UsersService } from '../../../core/services/users/users.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './users-create.component.html',
  styleUrl: './users-create.component.scss'
})
export class UsersCreateComponent {
  users: User[] = []; // Liste des utilisateurs.
  userForm: FormGroup; // Formulaire pour créer un utilisateur.
  currentStep: number = 1; // Étape actuelle dans le processus de création.
  availableRoles: string[] = ['admin', 'employe', 'manager']; // Rôles disponibles pour un utilisateur.

  user: User | null = null; // Détails de l'utilisateur actuellement connecté.

  // États des menus pour navigation dynamique.
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;

  constructor(
    private router: Router, // Service Angular pour gérer la navigation.
    private usersService: UsersService, // Service pour interagir avec les utilisateurs.
    private authService: AuthService, // Service pour gérer l'authentification.
    private formBuilder: FormBuilder // Service pour construire des formulaires réactifs.
  ) {
    // Initialisation du formulaire avec validation.
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      isEnabled: [true], // Par défaut, l'utilisateur est activé.
      workingHours: [0, [Validators.required, Validators.min(0)]], // Heures de travail valides >= 0.
      roles: [[], Validators.required], // Rôles attribués, obligatoire.
      isPartTime: [false], // Statut de travail à temps partiel.
      hireDate: ['', Validators.required], // Date d'embauche, obligatoire.
      gender: ['', Validators.required], // Sexe (exemple : "Homme", "Femme").
      contractType: ['', Validators.required], // Type de contrat (exemple : "CDI", "CDD").
      numberOfChildren: [null, [Validators.min(0)]], // Nombre d'enfants, optionnel mais >= 0.
      maritalStatus: ['', Validators.required], // Statut marital (exemple : "Marié").
      residence: ['', Validators.required], // Lieu de résidence, obligatoire.
      postalAddress: ['', Validators.required] // Adresse postale, obligatoire.
    });
  }

  /**
   * Réinitialise le formulaire.
   */
  initializeForm(): void {
    this.userForm.reset(); // Réinitialise les valeurs du formulaire.
  }

  /**
   * Méthode exécutée lors de l'initialisation du composant.
   */
  ngOnInit(): void {
    this.getUsers(); // Charge tous les utilisateurs.
    this.getUserDetails(); // Récupère les détails de l'utilisateur actuellement connecté.
    this.initializeForm(); // Réinitialise le formulaire.
  }

  /**
   * Récupère les détails de l'utilisateur actuellement connecté.
   */
  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
  }

  /**
   * Récupère tous les utilisateurs depuis le service.
   */
  getUsers(): void {
    this.usersService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error("Erreur lors du chargement des utilisateurs", error);
      }
    );
  }

  /**
   * Soumet le formulaire pour créer un nouvel utilisateur.
   */
  onSubmit(): void {
    if (this.userForm.valid) {
      const user: User = this.userForm.value; // Transforme les données du formulaire en objet `User`.
      this.usersService.registerUser(user).subscribe(
        (response) => {
          console.log("Utilisateur créé avec succès", response);
          this.userForm.reset(); // Réinitialise le formulaire.
          this.getUsers(); // Recharge la liste des utilisateurs.

          // Affiche une alerte de succès.
          Swal.fire({
            icon: 'success',
            title: 'Succès!',
            text: 'Utilisateur créé avec succès!',
            confirmButtonText: 'Ok'
          });
        },
        (error) => {
          console.error("Erreur lors de la création de l'utilisateur", error);

          // Affiche une alerte d'erreur.
          Swal.fire({
            icon: 'error',
            title: 'Erreur!',
            text: 'Erreur lors de la création de l\'utilisateur.',
            confirmButtonText: 'Ok'
          });
        }
      );
    } else {
      console.log("Le formulaire est invalide");
    }
  }

  /**
   * Retourne le pourcentage d'avancement dans les étapes.
   */
  get stepPercentage(): number {
    return (this.currentStep / 3) * 100; // Trois étapes au total.
  }

  /**
   * Passe à l'étape suivante.
   */
  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  /**
   * Revient à l'étape précédente.
   */
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /**
   * Réinitialise le formulaire.
   */
  onReset(): void {
    this.userForm.reset();
  }

  /**
   * Active/désactive le menu des utilisateurs.
   */
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  /**
   * Active/désactive le menu des congés.
   */
  toggleLeaveMenu(): void {
    this.isLeaveMenuOpen = !this.isLeaveMenuOpen;
  }

  /**
   * Active/désactive le menu des rapports.
   */
  toggleReportMenu(): void {
    this.isReportMenuOpen = !this.isReportMenuOpen;
  }

  /**
   * Déconnecte l'utilisateur et redirige vers la page de connexion.
   */
  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.authService.logout();
    }
    this.router.navigate(['/auth/login']);
  }
}
