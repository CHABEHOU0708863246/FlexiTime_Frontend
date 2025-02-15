import { Component, OnInit } from '@angular/core';
import { LeaveBalance } from '../../../core/models/LeaveBalance';
import { LeaveBalancesService } from '../../../core/services/leaveBalances/leave-balances.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeLeaveStats } from '../../../core/models/EmployeeLeaveStats';
import { User } from '../../../core/models/User';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-employe-leave-balance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './employe-leave-balance.component.html',
  styleUrl: './employe-leave-balance.component.scss'
})
export class EmployeLeaveBalanceComponent implements OnInit {
  leaveBalance: LeaveBalance | null = null;
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

  constructor(private leaveBalancesService: LeaveBalancesService, private router: Router, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getUserDetails(); // Récupère les infos utilisateur

    // Attendre que les infos utilisateur soient disponibles avant de récupérer le solde des congés
    if (this.user?.id) {
      this.employeeId = this.user.id; // Stocke l'ID utilisateur connecté
      this.loadLeaveBalance(this.employeeId);
    }
  }


  /**
 * Charge le solde de congés pour un utilisateur donné.
 * @param userId L'identifiant de l'utilisateur.
 */
loadLeaveBalance(userId: string): void {
  this.leaveBalancesService.getLeaveBalanceByUserId(userId).subscribe(data => {
    this.leaveBalance = data;
  });
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
