import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attendance, AttendanceResponse } from '../../models/Attendance';
import { PaginatedRequest, PaginatedResponse } from '../../models/PaginatedRequest';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'https://localhost:7082/api/Attendance';

  constructor(private http: HttpClient) { }

  requestAbsence(request: Attendance): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(`${this.apiUrl}/Attendance`, request);
  }

  getAllAttendances(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.apiUrl);
  }

  getAttendanceById(id: string): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.apiUrl}/${id}`);
  }

  updateAttendanceStatus(id: string, status: string): Observable<AttendanceResponse> {
    return this.http.put<AttendanceResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  exportAttendances(fileType: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export?fileType=${fileType}`, { responseType: 'blob' });
  }

  getPaginatedAttendances(request: PaginatedRequest): Observable<PaginatedResponse<Attendance>> {
    return this.http.post<PaginatedResponse<Attendance>>(`${this.apiUrl}/paginated`, request);
  }

}
