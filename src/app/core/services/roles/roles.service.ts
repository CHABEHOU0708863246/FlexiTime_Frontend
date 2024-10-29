import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, catchError, tap, throwError } from 'rxjs';
import { RoleRequest } from '../../models/RoleRequest';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private apiUrl = 'https://localhost:7082/api/Roles';
  private roleUpdatedSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  //Renvoie tous les roles
  getRoles(): Observable<RoleRequest[]> {
    return this.http.get<RoleRequest[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  //Renvoie un role en fonction de son Id
  getRoleById(roleId: number): Observable<RoleRequest> {
    const url = `${this.apiUrl}/${roleId}`;
    return this.http.get<RoleRequest>(url).pipe(
      catchError(this.handleError)
    );
  }

  //Création d'un role
  createRole(role: any): Observable<any> {
    return this.http.post(this.apiUrl, role).pipe(
      catchError(this.handleError)
    );
  }

  //Supprime un role
  deleteRole(roleId: number): Observable<any> {
    const url = `${this.apiUrl}/${roleId}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  //Mise a jour d'un role
  getRoleUpdatedObservable(): Observable<void> {
    return this.roleUpdatedSubject.asObservable();
  }

  updateRole(roleId: number, roleData: any): Observable<any> {
    const url = `${this.apiUrl}/${roleId}`;
    return this.http.put(url, roleData).pipe(
      tap(() => {
        this.roleUpdatedSubject.next();
      }),
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error (HTTP ${error.status}): ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

}
