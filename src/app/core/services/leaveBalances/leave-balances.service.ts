import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveBalance } from '../../models/LeaveBalance';


@Injectable({
  providedIn: 'root',
})
export class LeaveBalancesService {
  private apiUrl = 'https://localhost:7082/api/LeaveBalance';

  constructor(private http: HttpClient) {}

  /**
   * Récupère le solde de congés d'un utilisateur par son ID.
   * @param userId L'identifiant de l'utilisateur.
   * @returns Observable contenant le solde de congés de l'utilisateur.
   */
  getLeaveBalanceByUserId(userId: string): Observable<LeaveBalance> {
    return this.http.get<LeaveBalance>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Récupère les soldes de congés pour tous les utilisateurs.
   * @returns Observable contenant une liste des soldes de congés de tous les utilisateurs.
   */
  getAllLeaveBalances(): Observable<LeaveBalance[]> {
    return this.http.get<LeaveBalance[]>(this.apiUrl);
  }

  /**
   * Met à jour automatiquement le solde de congés d'un utilisateur par son ID.
   * @param userId L'identifiant de l'utilisateur.
   * @returns Observable indiquant le succès ou l'échec de l'opération.
   */
  updateLeaveBalance(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, null);
  }

  /**
   * Met à jour automatiquement les soldes de congés pour tous les utilisateurs.
   * @returns Observable indiquant le succès ou l'échec de l'opération.
   */
  updateAllLeaveBalances(): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateAll`, null);
  }

  /**
   * Met à jour manuellement le solde de congés d'un utilisateur.
   * @param userId L'identifiant de l'utilisateur.
   * @param leaveType Le type de congé à mettre à jour.
   * @param newBalance Le nouveau solde pour ce type de congé.
   * @returns Observable indiquant le succès ou l'échec de l'opération.
   */
  updateLeaveBalanceManually(userId: string, leaveType: string, newBalance: number): Observable<boolean> {
    const params = { userId, leaveType, newBalance: newBalance.toString() };
    return this.http.put<boolean>(`${this.apiUrl}/update-leave-balance`, null, { params });
  }
}
