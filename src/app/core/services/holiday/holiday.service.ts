import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicHoliday } from '../../models/PublicHoliday';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  private apiUrl = 'https://localhost:7082/api/Holidays';

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les jours fériés.
   * @returns Un tableau de jours fériés (Observable).
   */
  getAllHolidays(): Observable<PublicHoliday[]> {
    return this.http.get<PublicHoliday[]>(`${this.apiUrl}`);
  }

  /**
   * Récupère un jour férié par son ID.
   * @param id Identifiant du jour férié.
   * @returns Le jour férié correspondant (Observable).
   */
  getHolidayById(id: string): Observable<PublicHoliday> {
    return this.http.get<PublicHoliday>(`${this.apiUrl}/${id}`);
  }

  /**
   * Ajoute un nouveau jour férié.
   * @param holidayRequest Détails du jour férié à ajouter.
   * @returns Le jour férié ajouté avec son identifiant généré (Observable).
   */
  addHoliday(holidayRequest: PublicHoliday): Observable<PublicHoliday> {
    return this.http.post<PublicHoliday>(`${this.apiUrl}`, holidayRequest);
  }

  /**
   * Met à jour un jour férié existant.
   * @param id Identifiant du jour férié à mettre à jour.
   * @param holidayRequest Nouveaux détails du jour férié.
   * @returns Le jour férié mis à jour (Observable).
   */
  updateHoliday(id: string, holidayRequest: PublicHoliday): Observable<PublicHoliday> {
    return this.http.put<PublicHoliday>(`${this.apiUrl}/${id}`, holidayRequest);
  }

  /**
   * Supprime un jour férié par son ID.
   * @param id Identifiant du jour férié à supprimer.
   * @returns Un booléen indiquant le succès de l'opération (Observable).
   */
  deleteHoliday(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

}
