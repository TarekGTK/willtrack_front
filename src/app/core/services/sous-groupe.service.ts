import { Injectable } from '@angular/core';
import { SousGroupe } from '../model/sousGroupe.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SousGroupeService {

  constructor(private http: HttpClient) {}
  getAll(): Observable<SousGroupe[]> {
    return this.http.get<SousGroupe[]>('http://localhost:1919/api/sous-groupes');
  }
  save(sousGroupe: SousGroupe): Observable<SousGroupe> {
    return this.http.post<SousGroupe>('http://localhost:1919/api/sous-groupes', sousGroupe);
  }
}
