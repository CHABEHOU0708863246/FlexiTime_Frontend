import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { CalendarEvent } from '../../models/CalendarEvent';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = 'https://localhost:7082/api/Calendar';

  constructor(private http: HttpClient) { }

  /**
   * Récupère tous les événements du calendrier (congés approuvés et jours fériés)
   * @returns Observable contenant un tableau d'événements du calendrier
   */
  getCalendarEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/events`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Supprime un événement du calendrier
   * @param eventId - L'identifiant de l'événement à supprimer
   * @returns Observable indiquant le succès de l'opération
   */
  deleteEventFromCalendar(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/event/${eventId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Récupère les événements pour un mois et une année spécifiques
   * @param month - Le mois pour lequel récupérer les événements (1-12)
   * @param year - L'année pour laquelle récupérer les événements
   * @returns Observable contenant un tableau d'événements du calendrier
   */
  getEventsByMonth(month: number, year: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/events/${month}/${year}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * @param error - L'erreur HTTP capturée
   * @returns Observable avec un message d'erreur
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur côté client : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide (400)';
          break;
        case 401:
          errorMessage = 'Non autorisé (401). Veuillez vous connecter.';
          break;
        case 403:
          errorMessage = 'Accès interdit (403)';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée (404)';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur (500)';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }

    console.error('Erreur dans CalendarService:', errorMessage);
    return throwError(() => errorMessage);
  }
}
