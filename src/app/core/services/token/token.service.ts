import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenKey = 'VGhpcyBpcyBhIG5pY2Ugc3VjY2Vzc2Z1bCB0aGF0IHNhaWQgb3V0IG15IGpldG9u';

  constructor(private router: Router) {}

  // Sauvegarde du token dans le local storage
  saveToken(token: string, role: string): void {
    const tokenData = { token, role };
    localStorage.setItem(this.tokenKey, JSON.stringify(tokenData));
  }

  // Si l'utilisateur est loggé
  isLogged(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }

  // Suppression du token
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/']);
  }

  // Suppression du token expiré
  clearTokenExpired(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['auth']);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  }
  // Renvoie du token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  //Renvoie de la payload
  getPayload(): AuthenticatorResponse | null {
    let userTokenInfo: AuthenticatorResponse | null = null;
    const token = this.getToken();

    if (token != null) {
      userTokenInfo = JSON.parse(atob(token.split('.')[1]));
    }

    return userTokenInfo;
  }

}
