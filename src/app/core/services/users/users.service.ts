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

  // Méthode pour enregistrer un nouvel utilisateur
  registerUser(userRequest: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}`, userRequest);
  }

  // Méthode pour obtenir tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  // Méthode pour obtenir un utilisateur par ID
  getUserById(id: string): Observable<User | null> {
    return this.http.get<User | null>(`${this.baseUrl}/${id}`);
  }

  // Méthode pour activer/désactiver le compte utilisateur
  toggleUserAccount(id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, {});
  }

  // Méthode pour exporter les utilisateurs
  exportUsers(fileType: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.baseUrl}/export-users?fileType=${fileType}`, { responseType: 'blob' as 'json' });
  }

   // Méthode pour obtenir une liste paginée d'utilisateurs
   getPaginatedUsers(pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

}
