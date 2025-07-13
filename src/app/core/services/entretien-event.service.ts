import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntretienEventService {
  private apiUrl = 'http://localhost:1919/api/entretiens'; 

  constructor(private http: HttpClient) { }

 
  getAllEntretiensWithApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/applications/entretiens`);
  }


  planifierEntretien(applicationId: string, type: string, date: Date, location: string): Observable<any> {
    const body = { applicationId, type, date, location };
    return this.http.post<any>(`${this.apiUrl}/planifier-entretien`, body);
  }

  
  updateApplicationStatus(applicationId: number, status: string): Observable<any> {
    const body = { applicationId, status }; 
    return this.http.put<any>(`${this.apiUrl}/update-application-status/${applicationId}`, body);
  }

  annulerEntretien(eventId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/annuler-entretien/${eventId}`);
  }
}
