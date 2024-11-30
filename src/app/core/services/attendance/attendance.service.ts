import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attendance, AttendanceResponse } from '../../models/Attendance';
import { PaginatedRequest, PaginatedResponse } from '../../models/PaginatedRequest';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'https://localhost:7082/api/Attendance';

  constructor(private http: HttpClient) { }

  /**
   * Soumet une demande d'absence.
   * @param request - Objet contenant les détails de la demande d'absence.
   * @returns Observable contenant la réponse de l'API après la création de la demande.
   */
  requestAbsence(request: Attendance): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(`${this.apiUrl}/Attendance`, request);
  }

  /**
   * Récupère la liste de toutes les présences.
   * @returns Observable contenant un tableau d'objets Attendance.
   */
  getAllAttendances(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.apiUrl);
  }

  /**
   * Récupère les détails d'une présence spécifique par son identifiant.
   * @param id - Identifiant unique de la présence.
   * @returns Observable contenant l'objet Attendance correspondant.
   */
  getAttendanceById(id: string): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.apiUrl}/${id}`);
  }

  /**
   * Met à jour le statut d'une présence.
   * @param id - Identifiant unique de la présence.
   * @param status - Nouveau statut de la présence (par exemple : "validé", "refusé").
   * @returns Observable contenant la réponse de l'API après la mise à jour.
   */
  updateAttendanceStatus(id: string, status: string): Observable<AttendanceResponse> {
    return this.http.put<AttendanceResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Exporte les données des présences dans un fichier du type spécifié.
   * @param fileType - Type de fichier pour l'export (par exemple : "csv", "pdf").
   * @returns Observable contenant le Blob du fichier exporté.
   */
  exportAttendances(fileType: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export?fileType=${fileType}`, { responseType: 'blob' });
  }

  /**
   * Récupère une liste paginée des présences en fonction des paramètres spécifiés.
   * @param request - Objet contenant les détails de pagination (page, taille, filtres).
   * @returns Observable contenant la réponse paginée avec les présences.
   */
  getPaginatedAttendances(request: PaginatedRequest): Observable<PaginatedResponse<Attendance>> {
    return this.http.post<PaginatedResponse<Attendance>>(`${this.apiUrl}/paginated`, request);
  }

}
