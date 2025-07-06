import { Injectable } from '@angular/core';
import { Groupe } from '../model/groupe.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {

  constructor(private http: HttpClient) {}
  getAll(): Observable<Groupe[]> {
    return this.http.get<Groupe[]>('http://localhost:1919/api/groupes');
  }
  save(groupe: Groupe): Observable<Groupe> {
    return this.http.post<Groupe>('http://localhost:1919/api/groupes', groupe);
  }
}
