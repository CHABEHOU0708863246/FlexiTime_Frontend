import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  private apiUrl = 'https://localhost:7082/api/Holidays';

  constructor(private http: HttpClient) { }

  /**
   * Récupère tous les jours fériés enregistrés dans la base de données.
   * Utilise une requête GET pour récupérer les jours fériés.
   * @returns Observable avec la liste des jours fériés.
   */
  getAllHolidays(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  /**
   * Récupère un jour férié par son identifiant unique.
   * Utilise une requête GET avec l'ID pour récupérer le jour férié correspondant.
   * @param holidayId - L'identifiant unique du jour férié.
   * @returns Observable avec le jour férié trouvé ou null si non trouvé.
   */
  getHolidayById(holidayId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${holidayId}`);
  }

  /**
   * Ajoute un nouveau jour férié à la base de données.
   * Utilise une requête POST pour ajouter un jour férié.
   * @param holiday - Les détails du jour férié à ajouter.
   * @returns Observable avec le jour férié ajouté.
   */
  addHoliday(holiday: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, holiday);
  }

  /**
   * Met à jour un jour férié existant dans la base de données.
   * Utilise une requête PUT pour mettre à jour un jour férié.
   * @param holidayId - L'identifiant unique du jour férié à mettre à jour.
   * @param holiday - Les nouveaux détails du jour férié.
   * @returns Observable avec le jour férié mis à jour ou null si non trouvé.
   */
  updateHoliday(holidayId: string, holiday: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${holidayId}`, holiday);
  }

  /**
   * Supprime un jour férié de la base de données par son identifiant.
   * Utilise une requête DELETE pour supprimer un jour férié.
   * @param holidayId - L'identifiant unique du jour férié à supprimer.
   * @returns Observable avec un message de confirmation ou une erreur.
   */
  deleteHoliday(holidayId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${holidayId}`);
  }
}
