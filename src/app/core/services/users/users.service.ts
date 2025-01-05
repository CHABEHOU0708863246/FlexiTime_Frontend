import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = 'https://localhost:7082/api/User';

  constructor(private http: HttpClient) { }

  /**
   * 1. Enregistrement d'un nouvel utilisateur.
   * @param userRequest - Les informations de l'utilisateur à enregistrer.
   * @returns Un Observable contenant l'utilisateur enregistré.
   */
  registerUser(userRequest: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}`, userRequest); // Envoie une requête POST pour enregistrer l'utilisateur.
  }

  /**
   * 2. Obtention de tous les utilisateurs.
   * @returns Un Observable contenant une liste d'utilisateurs.
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`); // Envoie une requête GET pour récupérer tous les utilisateurs.
  }

  /**
   * 3. Obtention d'un utilisateur par son ID.
   * @param id - L'ID de l'utilisateur.
   * @returns Un Observable contenant l'utilisateur ou null si non trouvé.
   */
  getUserById(id: string): Observable<User | null> {
    return this.http.get<User | null>(`${this.baseUrl}/${id}`); // Envoie une requête GET pour récupérer l'utilisateur par ID.
  }

  /**
   * 4. Activation/désactivation du compte utilisateur.
   * @param id - L'ID de l'utilisateur dont le compte doit être activé ou désactivé.
   * @returns Un Observable pour la mise à jour du compte.
   */
  toggleUserAccount(id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, {}); // Envoie une requête PUT pour activer ou désactiver un compte utilisateur.
  }

  /**
   * 5. Exportation des utilisateurs.
   * @param fileType - Le type de fichier pour l'exportation (par exemple, 'CSV', 'PDF').
   * @returns Un Observable contenant le fichier exporté en format Blob.
   */
  exportUsers(fileType: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.baseUrl}/export-users?fileType=${fileType}`, { responseType: 'blob' as 'json' }); // Récupère le fichier exporté dans le type demandé.
  }

  /**
   * 6. Récupération des utilisateurs paginés.
   * @param pageNumber - Le numéro de la page (par défaut 1).
   * @param pageSize - Le nombre d'éléments par page (par défaut 10).
   * @returns Un Observable contenant les utilisateurs paginés.
   */
  getPaginatedUsers(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`); // Récupère les utilisateurs paginés selon les paramètres de la page.
  }

  /**
   * 7. Mise à jour du rôle d'un utilisateur.
   * @param userId - L'ID de l'utilisateur.
   * @param newRole - Le nouveau rôle à assigner à l'utilisateur.
   * @returns Un Observable contenant le résultat de la mise à jour.
   */
  updateUserRole(userId: string, newRole: string): Observable<any> {
    const encodedUserId = encodeURIComponent(userId);
    const encodedNewRole = encodeURIComponent(newRole);
    return this.http.put<any>(`${this.baseUrl}/update-user-role?userId=${encodedUserId}&newRole=${encodedNewRole}`, {}); // Envoie une requête PUT pour mettre à jour le rôle de l'utilisateur.
  }

}
