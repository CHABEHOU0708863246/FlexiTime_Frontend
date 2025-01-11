import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { LeaveRequest } from '../../models/LeaveRequest';
import { PaginatedResponse } from '../../models/PaginatedRequest';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private apiUrl = 'https://localhost:7082/api/Leave';

  constructor(private http: HttpClient) { }

  /**
   * 1. Récupère toutes les demandes de congés.
   * Utilise une requête GET pour récupérer une liste complète des demandes de congé.
   * @returns Observable contenant un tableau d'objets `LeaveRequest`.
   */
  getLeaveRequests(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError)); // Gestion centralisée des erreurs.
  }

  /**
   * 2. Récupère une demande de congé spécifique via son ID.
   * @param id - L'identifiant unique de la demande de congé.
   * @returns Observable contenant l'objet `LeaveRequest` correspondant.
   */
  getLeaveRequestById(id: number): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * 3. Crée une nouvelle demande de congé.
   * Envoie une requête POST pour ajouter une nouvelle demande.
   * @param leaveRequest - Les détails de la nouvelle demande de congé.
   * @returns Observable contenant la demande de congé créée.
   */
  createLeaveRequest(leaveRequest: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.apiUrl}`, leaveRequest)
      .pipe(catchError(this.handleError));
  }

  /**
   * 4. Met à jour une demande de congé existante.
   * @param id - L'identifiant de la demande de congé à mettre à jour.
   * @param leaveRequest - Les nouvelles informations de la demande.
   * @returns Observable contenant la demande mise à jour.
   */
  updateLeaveRequest(id: number, leaveRequest: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.apiUrl}/${id}`, leaveRequest)
      .pipe(catchError(this.handleError));
  }

  /**
   * 5. Accepte une demande de congé.
   * Envoie une requête POST pour approuver une demande en fonction de son ID.
   * @param leaveId - L'identifiant de la demande de congé.
   * @param approverId - L'identifiant de l'approbateur.
   * @returns Observable avec une confirmation ou une erreur.
   */
  acceptLeaveRequest(leaveId: string, approverId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${leaveId}/approve`, { approverId }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 6. Rejette une demande de congé.
   * Fonctionne de manière similaire à l'approbation.
   * @param leaveId - L'identifiant de la demande.
   * @param approverId - L'identifiant de l'approbateur.
   * @returns Observable avec une confirmation ou une erreur.
   */
  rejectLeaveRequest(leaveId: string, approverId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${leaveId}/reject`, { approverId }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 7. Annule une demande de congé.
   * Utilise une requête POST sans données supplémentaires.
   * @param leaveId - L'identifiant de la demande de congé.
   * @returns Observable avec une confirmation ou une erreur.
   */
  cancelLeaveRequest(leaveId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${leaveId}/cancel`, {}).pipe(
      catchError(this.handleError)
    );
  }

/**
   * 8.Met à jour le statut d'une demande de congé.
   * @param leaveId - L'identifiant de la demande.
   * @param newStatus - Le nouveau statut de la demande.
   * @param userId - L'identifiant de l'utilisateur effectuant la mise à jour.
   * @returns Observable contenant un message de confirmation.
   */
updateLeaveStatus(leaveId: string, newStatus: number, userId: string): Observable<string> {
  const url = `${this.apiUrl}/${leaveId}/status?newStatus=${newStatus}&userId=${userId}`;
  return this.http.put<{ succeeded: boolean; message?: string }>(url, {}).pipe(
    map(response => response.message || 'Statut mis à jour avec succès.'),
    catchError(this.handleError)
  );
}

  /**
   * 9. Télécharge le PDF d'une demande de congé.
   * @param leaveId - L'identifiant de la demande de congé.
   * @param userId - L'identifiant de l'utilisateur.
   * @returns Observable contenant le fichier PDF sous forme de Blob.
   */
  downloadLeavePdf(leaveId: string, userId: string): Observable<Blob> {
    const url = `${this.apiUrl}/leaves/${leaveId}/users/${userId}/download`;
    return this.http.get(url, { responseType: 'blob' });
  }

  /**
   * 10.Récupère les demandes de congé paginées.
   * @param pageNumber - Le numéro de la page.
   * @param pageSize - La taille de la page.
   * @returns Observable contenant la réponse paginée.
   */
  getPaginatedLeaves(pageNumber: number, pageSize: number): Observable<PaginatedResponse<LeaveRequest>> {
    return this.http.get<PaginatedResponse<LeaveRequest>>(
      `${this.apiUrl}/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  /**
   * 11. Télécharge le fichier de justification d'une demande de congé.
   * @param fileName - Le nom du fichier de justification.
   * @returns Observable contenant le fichier de justification sous forme de Blob.
   */
  downloadJustificationFile(fileName: string): Observable<Blob> {
    const url = `${this.apiUrl}/justification/${fileName}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 12. Met à jour le solde de congés d'un utilisateur après un congé.
   * @param userId L'ID de l'utilisateur.
   * @param leave Les détails du congé.
   * @returns Un booléen indiquant le succès ou l'échec (Observable).
   */
  updateLeaveBalance(userId: string, leave: LeaveRequest): Observable<boolean> {
    const url = `${this.apiUrl}/balance/${userId}`;
    return this.http.put<boolean>(url, leave).pipe(
      catchError(this.handleError)
    );
  }




  /**
   * Gestion centralisée des erreurs.
   * @param error - L'erreur HTTP capturée.
   * @returns Observable avec un message d'erreur.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client : ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide (400). Vérifiez les données envoyées.';
          break;
        case 401:
          errorMessage = 'Non autorisé (401). Veuillez vous connecter.';
          break;
        case 403:
          errorMessage = 'Accès interdit (403). Vous n’avez pas les droits nécessaires.';
          break;
        case 404:
          errorMessage = 'La ressource demandée est introuvable (404).';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur (500).';
          break;
        default:
          errorMessage = `Erreur inconnue : ${error.status}, ${error.message}`;
          break;
      }
    }
    console.error(`Erreur : ${errorMessage}`);
    return throwError(errorMessage);
  }

}
