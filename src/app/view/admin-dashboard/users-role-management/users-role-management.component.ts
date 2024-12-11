import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/User';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RoleRequest } from '../../../core/models/RoleRequest';
import { RolesService } from '../../../core/services/roles/roles.service';

@Component({
  selector: 'app-users-role-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './users-role-management.component.html',
  styleUrl: './users-role-management.component.scss'
})
export class UsersRoleManagementComponent implements OnInit {
  isUserMenuOpen: boolean = false;
  isLeaveMenuOpen: boolean = false;
  isAttendanceMenuOpen: boolean = false;
  isReportMenuOpen: boolean = false;
  user: User | null = null;

  roleForm!: FormGroup;
  roles: RoleRequest[] = [];
  isEditMode: boolean = false;
  currentRoleId: string | null = null;


  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private rolesService: RolesService,
    private router: Router
  ) {
    this.roleForm = this.fb.group({
      code: ['', Validators.required],
      roleName: ['', Validators.required],
      normalizedName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.loadRoles();
  }

  /**
   * Charge la liste des rôles depuis l'API.
   */
  loadRoles(): void {
    this.rolesService.getRoles().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des rôles :', error);
      }
    );
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
    }
     else {
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

  getUserDetails(): void {
    this.user = this.authService.getCurrentUser();
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
