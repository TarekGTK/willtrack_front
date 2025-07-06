import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../model/application.model'; // Adjust the import path as necessary
import { GlobalComponent } from '../../global-component';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly API_URL = GlobalComponent.API_URL;
  private readonly APPLICATION: string = "applications/";

  constructor(private http: HttpClient) { }

  addApplication(coverLetter: File, cv: File, idOffer: number, userId: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('coverLetter', coverLetter);
    formData.append('cv', cv);
    formData.append('idOffer',idOffer.toString())
    formData.append('userId', userId.toString());

    return this.http.post(this.API_URL+this.APPLICATION +  `addApplication` , formData);
  }

  updateApplication(coverLetter: File, cv: File, id: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('coverLetter', coverLetter);
    formData.append('cv', cv);

    return this.http.post(this.API_URL+this.APPLICATION +  `updateApplication/${id}`, formData);
  }

  gestionStatus(id: number, applicationDto: any): Observable<any> {
    return this.http.post(this.API_URL+this.APPLICATION +  `GestionStatus/${id}`, applicationDto);
  }

  retrieveApplication(id: number): Observable<Application> {
    return this.http.get<Application>(this.API_URL+this.APPLICATION +`getApplication/${id}`) ;
  }

  retrieveApplicationsByOfferId(id: number): Observable<Application[]> {
    return this.http.get<Application[]>(this.API_URL+this.APPLICATION +`getApplicatiosByOfferId/${id}`);
  }

  retrieveApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.API_URL+this.APPLICATION +`getApplications`);
  }

  deleteApplication(id: number, userId: number): Observable<any> {
    const params = { id: id.toString(), userId: userId.toString() };
    return this.http.delete(this.API_URL+this.APPLICATION + `deleteApplication`, { params });
  }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(this.API_URL+this.APPLICATION + `upload`, formData);
  }

  setStatusAccepted(id: number): Observable<any> {
    return this.http.post(this.API_URL+this.APPLICATION +`setStatusAccepted/${id}`, {});
  }

  setStatusRefused(id: number): Observable<any> {
    return this.http.post(this.API_URL+this.APPLICATION +`setStatusRefused/${id}`, {});
  }

  openFile(filename: string): Observable<Blob> {
    return this.http.get(this.API_URL+this.APPLICATION +`openFile/${filename}`, { responseType: 'blob' });
  }

  getApplicationsByUserId(userId: number): Observable<any> {
    return this.http.get(this.API_URL+this.APPLICATION +`${userId}`);
  }

}
