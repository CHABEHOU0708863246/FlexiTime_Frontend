import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7082/api/Auth/login';

  // Clé utilisée pour stocker le token dans le localStorage
  private tokenKey = 'VGhpcyBpcyBhIG5pY2Ugc3VjY2Vzc2Z1bCB0aGF0IHNhaWQgb3V0IG15IGpldG9u';

  constructor(private http: HttpClient) { }

  /**
   * Effectue la connexion d'un utilisateur.
   * @param email - Adresse e-mail de l'utilisateur.
   * @param password - Mot de passe de l'utilisateur.
   * @returns Observable contenant la réponse de l'API.
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          // Stocker le token JWT dans le localStorage
          localStorage.setItem(this.tokenKey, response.token);

          // Décoder le token pour récupérer le rôle utilisateur
          const decodedToken = this.decodeToken(response.token);
          if (decodedToken && decodedToken.role) {
            localStorage.setItem('userRole', decodedToken.role);
          }
        }
      }),
      catchError((error) => {
        console.error('Erreur lors de la connexion:', error);
        return of(null); // Retourne une Observable nulle en cas d'erreur
      })
    );
  }

  /**
   * Récupère l'utilisateur actuellement connecté.
   * @returns Instance de l'utilisateur connecté ou null s'il n'y a pas de session active.
   */
  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken = this.decodeToken(token);
    if (!decodedToken) return null;

    // Créer une instance de l'utilisateur à partir des données du token décodé
    return new User({
      id: decodedToken.sub,
      firstName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
      lastName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
      email: decodedToken.email,
      phoneNumber: decodedToken.phoneNumber || '',
      roles: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        ? [decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']]
        : []
    });
  }

  /**
   * Récupère le rôle de l'utilisateur connecté.
   * @returns Rôle de l'utilisateur ou null si aucun rôle n'est défini.
   */
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = this.decodeToken(token);
        const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        return decodedToken[roleKey] || localStorage.getItem('userRole');
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Déconnecte l'utilisateur.
   * Supprime les données de session stockées localement.
   */
  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('userRole');
    }
  }

  /**
   * Récupère le token JWT stocké localement.
   * @returns Token JWT ou null s'il n'est pas trouvé.
   */
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  /**
   * Vérifie si l'utilisateur est authentifié.
   * @returns True si le token est valide et non expiré, sinon false.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decodedToken: any = this.decodeToken(token);
      const currentTime = Date.now() / 1000; // Temps actuel en secondes
      return decodedToken.exp ? decodedToken.exp > currentTime : true;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return false;
    }
  }

  /**
   * Décodage d'un token JWT.
   * @param token - Token JWT à décoder.
   * @returns Données décodées ou null en cas d'erreur.
   */
  decodeToken(token: string): any {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  /**
   * Envoie une demande pour réinitialiser le mot de passe.
   * @param email - Adresse e-mail de l'utilisateur.
   * @param redirectPath - Chemin de redirection après la demande.
   * @returns Observable avec la réponse de l'API.
   */
  forgotPassword(email: string, redirectPath: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email, redirectPath });
  }

  /**
   * Réinitialise le mot de passe de l'utilisateur.
   * @param email - Adresse e-mail de l'utilisateur.
   * @returns Observable vide après traitement.
   */
  resetPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, { email });
  }

  /**
   * Change le mot de passe de l'utilisateur.
   * @param oldPassword - Ancien mot de passe.
   * @param newPassword - Nouveau mot de passe.
   * @returns Observable contenant la réponse de l'API.
   */
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, { oldPassword, newPassword });
  }
}
