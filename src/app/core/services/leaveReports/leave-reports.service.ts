import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportType } from '../../models/Report';

@Injectable({
  providedIn: 'root'
})
export class LeaveReportsService {

  private readonly apiUrl = 'https://localhost:7082/api/Reports';

  constructor(private http: HttpClient) {}

  /**
   * Génère un rapport basé sur le type spécifié.
   * @param reportType Le type de rapport à générer.
   * @param generatedBy L'utilisateur qui génère le rapport.
   * @returns Le rapport généré (Observable).
   */
  generateReport(reportType: ReportType, generatedBy: string): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/generate`, { reportType, generatedBy });
  }

  /**
   * Récupère tous les rapports générés.
   * @returns Un tableau de rapports (Observable).
   */
  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}`);
  }

  /**
   * Récupère un rapport spécifique par son ID.
   * @param reportId L'identifiant du rapport.
   * @returns Le rapport correspondant (Observable).
   */
  getReportById(reportId: string): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/${reportId}`);
  }

  /**
   * Supprime un rapport selon son ID.
   * @param reportId L'identifiant du rapport à supprimer.
   * @returns Un booléen indiquant le succès de la suppression (Observable).
   */
  deleteReport(reportId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${reportId}`);
  }

  /**
   * Génère un rapport personnalisé basé sur des critères.
   * @param criteria Les critères pour le rapport.
   * @param generatedBy L'utilisateur qui génère le rapport.
   * @returns Le rapport personnalisé généré (Observable).
   */
  generateCustomReport(criteria: { [key: string]: string }, generatedBy: string): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/custom`, { criteria, generatedBy });
  }

  /**
   * Récupère l'historique des congés entre deux dates.
   * @param startDate La date de début.
   * @param endDate La date de fin.
   * @returns Un tableau d'historique des congés (Observable).
   */
  getLeaveHistory(startDate: Date, endDate: Date): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`, { params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() } });
  }

  /**
   * Récupère le résumé des congés par type pour un utilisateur.
   * @param userId L'identifiant de l'utilisateur.
   * @returns Un dictionnaire des résumés de congés (Observable).
   */
  getLeaveSummaryByType(userId: string): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/summary/${userId}`);
  }

  /**
   * Met à jour le solde de congés pour un utilisateur.
   * @param userId L'identifiant de l'utilisateur.
   * @param leave Les détails du congé.
   * @returns Un booléen indiquant le succès de la mise à jour (Observable).
   */
  updateLeaveBalance(userId: string, leave: any): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/updateBalance`, { userId, leave });
  }
}
