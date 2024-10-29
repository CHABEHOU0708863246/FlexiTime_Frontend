import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7082/api/Auth/login';
  private tokenKey = 'VGhpcyBpcyBhIG5pY2Ugc3VjY2Vzc2Z1bCB0aGF0IHNhaWQgb3V0IG15IGpldG9u';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          const decodedToken = this.decodeToken(response.token);
          if (decodedToken && decodedToken.role) {
            localStorage.setItem('userRole', decodedToken.role);
          }
        }
      }),
      catchError((error) => {
        console.error('Erreur lors de la connexion:', error);
        return of(null);
      })
    );
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
        try {
            const decodedToken: any = this.decodeToken(token);
            // Utilisez la clé complète pour accéder au rôle
            const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
            console.log('Rôle dans le token:', decodedToken[roleKey]);
            return decodedToken[roleKey] || localStorage.getItem('userRole');
        } catch (error) {
            console.error('Erreur lors du décodage du token:', error);
            return null;
        }
    }
    return null;
}


  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userRole');
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decodedToken: any = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp ? decodedToken.exp > currentTime : true;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return false;
    }
  }

  // Décoder le jeton JWT
  decodeToken(token: string): any {
    try {
      const decoded = jwtDecode(token); // Utilisation de jwt-decode
      console.log('Token décodé:', decoded); // Ajoutez ceci pour voir la structure
      return decoded; // Vérifiez si le rôle est bien là
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

}
