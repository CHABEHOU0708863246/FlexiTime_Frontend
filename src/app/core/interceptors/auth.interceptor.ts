import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();

    if (token) {
      // Crée une nouvelle requête avec des modifications
      request = request.clone({
        // Ajoute un en-tête d'autorisation avec le token
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    //Transmet la requête modifiée au prochain intercepteur
    return next.handle(request);
  }
}
