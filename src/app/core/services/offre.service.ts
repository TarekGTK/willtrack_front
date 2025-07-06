import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offre } from '../model/offre.model';
import { GlobalComponent } from '../../global-component';
import {User} from "../../store/Authentication/auth.models"; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private readonly API_URL = GlobalComponent.API_URL;
  private readonly OFFRE: string = "offres/";

  constructor(private http: HttpClient) { }

  getAllOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.API_URL + this.OFFRE + 'all');
  }

  getOffreById(id: number): Observable<Offre> {
    return this.http.get<Offre>(this.API_URL + this.OFFRE + `${id}`);
  }

  createOffre(offre: Offre): Observable<Offre> {
    return this.http.post<Offre>(this.API_URL + this.OFFRE + "create", offre);
  }

  updateOffre(id: number, offre: Offre): Observable<Offre> {
    return this.http.put<Offre>(this.API_URL + this.OFFRE + `update/${id}` , offre);
  }

  deleteOffre(id: number): Observable<void> {
    return this.http.delete<void>(this.API_URL + this.OFFRE + `delete/${id}`);
  }


  getImage(offreId: number): Observable<Blob> {
    return this.http.get(this.API_URL + this.OFFRE + `image/${offreId}`, { responseType: 'blob' });
  }

  getOffresByCurrentUser(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.API_URL + this.OFFRE + 'offre');
  }

  getOffresNotByCurrentUser(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.API_URL + this.OFFRE + 'noffre');
  }

  getUserByOffreId(offreId: number): Observable<User> {
    return this.http.get<User>(this.API_URL + this.OFFRE + `${offreId}/user`);
  }
}
