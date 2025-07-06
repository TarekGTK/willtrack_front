import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MagasinService {
  private baseUrl = 'http://localhost:1919/api/magasin-pieces';

  constructor(private http: HttpClient) {}

  /* MagasinPiece methods */
  getPieces(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addPiece(piece: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, piece);
  }
  updateQuantite(id: number, quantite: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/quantite`, { quantite });
  }
  /* Magasin methods */
  getMagasins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/magasins`);
  }

  getMagasin(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/magasins/${id}`);
  }

  /* Groupe methods */
  getGroupes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/groupes`);
  }

  getGroupe(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/groupes/${id}`);
  }

  /* SousGroupe methods */
  getSousGroupes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sous-groupes`);
  }

  getSousGroupesByGroupe(groupeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sous-groupes/by-groupe/${groupeId}`);
  }

  getSousGroupe(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sous-groupes/${id}`);
  }
}