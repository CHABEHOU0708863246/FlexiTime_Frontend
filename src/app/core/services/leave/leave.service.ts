import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { LeaveRequest } from '../../models/LeaveRequest';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private apiUrl = 'https://localhost:7082/api/Leave';

  constructor(private http: HttpClient) { }

  // 1. Obtenir toutes les demandes de congés
  getLeaveRequests(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  // 2. Obtenir une demande de congé spécifique par ID
  getLeaveRequestById(id: number): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // 3. Créer une nouvelle demande de congé
  createLeaveRequest(leaveRequest: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.apiUrl}`, leaveRequest)
      .pipe(catchError(this.handleError));
  }

  // 4. Mettre à jour une demande de congé existante
  updateLeaveRequest(id: number, leaveRequest: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.apiUrl}/${id}`, leaveRequest)
      .pipe(catchError(this.handleError));
  }

  // 5. Supprimer une demande de congé par ID
  deleteLeaveRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // 6. Accepter une demande de congé
  acceptLeaveRequest(leaveId: string, approverId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${leaveId}/approve`, { approverId }).pipe(
      catchError(this.handleError)
    );
  }
  // 7. Rejeter une demande de congé
  rejectLeaveRequest(leaveId: string, approverId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${leaveId}/reject`, { approverId }).pipe(
      catchError(this.handleError)
    );
  }

  // 8. Annuler une demande de congé
  cancelLeaveRequest(leaveId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${leaveId}/cancel`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // 9. Méthode pour mettre à jour le statut d'une demande de congé
  updateLeaveStatus(leaveId: string, status: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${leaveId}/update-status`, { status }).pipe(
      catchError(this.handleError)
    );
  }

  // 10. Nouvelle méthode pour télécharger le PDF d'une demande de congé
  downloadLeavePdf(leaveId: string, userId: string): Observable<Blob> {
    const url = `${this.apiUrl}/leaves/${leaveId}/users/${userId}/download`;
    return this.http.get(url, { responseType: 'blob' }); // Utilisation de 'blob' pour gérer les fichiers binaires
  }


  // Gestion d'erreur centralisée
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur côté client : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 404:
          errorMessage = 'La ressource demandée est introuvable (404).';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur (500).';
          break;
        default:
          errorMessage = `Erreur côté serveur : ${error.status}, ${error.message}`;
          break;
      }
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

}
