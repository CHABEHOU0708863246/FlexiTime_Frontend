import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/User';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RoleRequest } from '../../../core/models/RoleRequest';
import { RolesService } from '../../../core/services/roles/roles.service';
import { UsersService } from '../../../core/services/users/users.service';

@Component({
  selector: 'app-users-role-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './users-role-management.component.html',
  styleUrls: ['./users-role-management.component.scss']
})
export class UsersRoleManagementComponent implements OnInit {
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;
  user: User | null = null;
  users: User[] = [];
  selectedUser: User | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  roleForm!: FormGroup;
  roles: RoleRequest[] = [];
  isEditMode: boolean = false;
  currentRoleId: string | null = null;

  updateRoleForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private rolesService: RolesService,
    private usersService: UsersService,
    private router: Router
  ) {
    this.roleForm = this.fb.group({
      code: ['', Validators.required],
      roleName: ['', Validators.required],
      normalizedName: ['', Validators.required]
    });

    this.updateRoleForm = this.fb.group({
      selectedUser: [null, [Validators.required]],
      newRole: ['', [Validators.required]]
    });

    // Ajout d'un observateur pour déboguer le statut du formulaire
    this.updateRoleForm.statusChanges.subscribe(status => {
      console.log('Form Status:', status);
      console.log('Form Errors:', this.updateRoleForm.errors);
      console.log('SelectedUser Errors:', this.updateRoleForm.get('selectedUser')?.errors);
      console.log('NewRole Errors:', this.updateRoleForm.get('newRole')?.errors);
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.loadRoles();
    this.loadUsers();
  }

/**
 * Charger les utilisateurs
 */
loadUsers(): void {
  this.loading = true;
  this.usersService.getAllUsers().subscribe({
    next: (users) => {
      this.users = users;
      this.loading = false;
    },
    error: (error) => {
      this.errorMessage = 'Erreur lors du chargement des utilisateurs: ' + error;
      this.loading = false;
    }
  });
}

  /**
   * Met à jour le rôle de l'utilisateur.
   */
  updateUserRole(): void {
    if (this.updateRoleForm.invalid) {
      Object.keys(this.updateRoleForm.controls).forEach(key => {
        const control = this.updateRoleForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const selectedUser = this.updateRoleForm.get('selectedUser')?.value;
    const newRole = this.updateRoleForm.get('newRole')?.value;

    if (!selectedUser || !selectedUser.id) {
      this.errorMessage = 'Utilisateur invalide';
      return;
    }

    if (!newRole) {
      this.errorMessage = 'Rôle invalide';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Log des données avant envoi
    console.log('Envoi à l\'API:', {
      userId: selectedUser.id,
      newRole: newRole
    });

    this.usersService.updateUserRole(selectedUser.id, newRole).subscribe({
      next: () => {
        this.successMessage = 'Rôle mis à jour avec succès';
        this.loading = false;
        this.resetUpdateRoleForm();
      },
      error: (error) => {
        this.errorMessage = error; // L'erreur est déjà formatée dans le service
        this.loading = false;
      }
    });
  }


  resetUpdateRoleForm(): void {
    this.updateRoleForm.reset({
      selectedUser: null,
      newRole: ''
    });
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Ajout de méthodes utilitaires pour la validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.updateRoleForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  canUpdateRole(): boolean {
    return this.updateRoleForm.valid && !this.loading;
  }

  /**
   * Charge la liste des rôles depuis l'API.
   */
  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des rôles: ' + error;
      }
    });
  }

  saveRole(): void {
    if (this.roleForm.invalid) {
      return;
    }

    const roleData = this.roleForm.value as RoleRequest;

    if (this.isEditMode && this.currentRoleId !== null) {
      const roleIdAsNumber = Number(this.currentRoleId); // Conversion de string en number
      this.rolesService.updateRole(roleIdAsNumber, roleData).subscribe(
        () => {
          this.resetForm();
          this.loadRoles();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du rôle :', error);
        }
      );
    } else {
      // Mode création
      this.rolesService.createRole(roleData).subscribe(
        () => {
          this.resetForm();
          this.loadRoles();
        },
        (error) => {
          console.error('Erreur lors de la création du rôle :', error);
        }
      );
    }
  }

  /**
   * Remplit le formulaire pour éditer un rôle existant.
   * @param role Rôle à éditer.
   */
  editRole(role: RoleRequest): void {
    this.isEditMode = true;
    this.currentRoleId = role.code || null;
    this.roleForm.patchValue(role);
  }

  /**
   * Supprime un rôle par son ID.
   * @param roleId Identifiant du rôle.
   */
  deleteRole(roleId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
      // Vérifiez si roleId est une chaîne non vide
      if (!roleId || roleId.length !== 24) {
        console.error('ID du rôle invalide');
        return;
      }

      this.rolesService.deleteRole(roleId).subscribe(
        () => {
          this.loadRoles();
        },
        (error) => {
          console.error('Erreur lors de la suppression du rôle :', error);
        }
      );
    }
  }

  /**
   * Réinitialise le formulaire et les variables de mode édition.
   */
  resetForm(): void {
    this.roleForm.reset();
    this.isEditMode = false;
    this.currentRoleId = null;
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
