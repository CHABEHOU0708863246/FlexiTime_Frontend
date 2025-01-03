
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Report, ReportType } from '../../models/Report';
import { LeaveBalance } from '../../models/LeaveBalance';
import { LeaveRequest } from '../../models/LeaveRequest';
import { LeaveStatusSummary } from '../../models/LeaveStatusSummary';

@Injectable({
  providedIn: 'root'
})
export class LeaveReportsService {
  private readonly apiUrl = 'https://localhost:7082/api';

  constructor(private http: HttpClient) {}

  /**
   * Génère un rapport basé sur le type spécifié.
   * @param reportType Le type de rapport à générer.
   * @param generatedBy L'utilisateur qui génère le rapport.
   * @returns Le rapport généré (Observable).
   */
  generateReport(reportType: ReportType, generatedBy: string): Observable<Report> {
    const url = `${this.apiUrl}/Reports/generate?reportType=${reportType}&generatedBy=${generatedBy}`;
    return this.http.post<Report>(url, {}).pipe(
      catchError(this.handleError)
    );
  }



  /**
   * Récupère tous les rapports générés.
   * @returns Une liste de rapports (Observable).
   */
  getAllReports(): Observable<Report[]> {
    const url = `${this.apiUrl}/Reports`;
    return this.http.get<Report[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère le solde de congés pour un utilisateur spécifique.
   * @param userId L'ID de l'utilisateur.
   * @returns Le solde de congés (Observable).
   */
  getLeaveBalanceByUser(userId: string): Observable<LeaveBalance> {
    const url = `${this.apiUrl}/GetLeaveBalanceByUser/${userId}`;
    return this.http.get<LeaveBalance>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour le solde de congés pour un utilisateur.
   * @param userId L'ID de l'utilisateur.
   * @param leave Les détails du congé.
   * @returns Un booléen indiquant le succès ou l'échec (Observable).
   */
  updateLeaveBalance(userId: string, leave: LeaveRequest): Observable<boolean> {
    const url = `${this.apiUrl}/UpdateLeaveBalance`;
    return this.http.put<boolean>(url, { userId, leave }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère l'historique des congés pour une plage de dates.
   * @param startDate La date de début.
   * @param endDate La date de fin.
   * @returns Une liste de congés (Observable).
   */
  getLeaveHistory(startDate: Date, endDate: Date): Observable<LeaveRequest[]> {
    const url = `${this.apiUrl}/GetLeaveHistory`;
    return this.http.post<LeaveRequest[]>(url, { startDate, endDate }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère un rapport spécifique par son ID.
   * @param reportId L'ID du rapport.
   * @returns Le rapport correspondant (Observable).
   */
  getReportById(reportId: string): Observable<Report> {
    const url = `${this.apiUrl}/GetReportById/${reportId}`;
    return this.http.get<Report>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Supprime un rapport selon son ID.
   * @param reportId L'ID du rapport à supprimer.
   * @returns Un booléen indiquant le succès ou l'échec (Observable).
   */
  deleteReport(reportId: string): Observable<Report> {
    const url = `${this.apiUrl}/Reports/${reportId}`;
    return this.http.delete<Report>(url).pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression du rapport:', error);
        return throwError(() => new Error(error));
      })
    );
  }




  /**
   * Génère un rapport personnalisé.
   * @param criteria Les critères pour générer le rapport.
   * @param generatedBy L'utilisateur qui génère le rapport.
   * @returns Le rapport généré (Observable).
   */
  generateCustomReport(criteria: Record<string, string>, generatedBy: string): Observable<Report> {
    const url = `${this.apiUrl}/GenerateCustomReport`;
    return this.http.post<Report>(url, { criteria, generatedBy }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère le résumé des congés par type pour un utilisateur.
   * @param userId L'ID de l'utilisateur.
   * @returns Un dictionnaire avec le type de congés et les soldes (Observable).
   */
  getLeaveSummaryByType(userId: string): Observable<Record<string, number>> {
    const url = `${this.apiUrl}/GetLeaveSummaryByType/${userId}`;
    return this.http.get<Record<string, number>>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Exporte un rapport au format Excel.
   * @param reportId L'ID du rapport à exporter.
   * @returns Un blob contenant le fichier Excel (Observable).
   */
  exportReportToExcel(reportId: string): Observable<Blob> {
    const url = `${this.apiUrl}/Reports/${reportId}/export`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère les statistiques des congés par statut (total, annulé, approuvé, en attente, refusé).
   * @returns Les statistiques des congés (Observable).
   */
  getLeaveStatusSummary(): Observable<LeaveStatusSummary> {
    const url = `${this.apiUrl}/Reports/status-summary`;  // URL de votre API pour récupérer les statistiques
    return this.http.get<LeaveStatusSummary>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gestion des erreurs HTTP.
   * @param error L'erreur capturée.
   * @returns Un observable d'erreur.
   */
  private handleError(error: any): Observable<never> {
    console.error('Erreur HTTP détaillée:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      body: error.error,
      url: error.url
    });

    // If the error has a specific message from the server, use it
    const errorMessage = error.error?.message || error.message || 'Une erreur inconnue est survenue';
    return throwError(() => new Error(errorMessage));
  }
}
